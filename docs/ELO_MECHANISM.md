# Elo

Calculating Elo is a complicated process. This file will not go into the details of that, as those can be found [on wikipedia](https://en.wikipedia.org/wiki/Elo_rating_system). Here, we'll dive into the engineering behind our calculation mechanism, how it works, and why we chose to do things this way.

## Background

Elo is calculated from both the results of a match *and* the Elo scores of its participants at the time of playing. This means that it is, in practice, serial. That is to say, computing Elo results for many games entails running those calculations on each game, one after the other in succession. It could theoretically be parallelized, but the dependency graph is such an interconnected mess that pwith even just 100 distinct matches, it would start to look more like a web than a graph with any meaning. Any benefits in efficiency are rapidly dwarved by the complexity introduced.

At the time of writing this, the match database contains close to 30,000 matches. So for our purposes, the process is considered as unconditionally serial: **each match's calculation is depended on the one immediately before it**.

### Complications

The way we do this in our database is by storing "snapshots" of Elo with each match in the `EloSnapshot` table. There is only one `EloSnapshot` per player, per match (mostly). This works great for storing a history of all matches, and we can even add a `current` flag (and index it) to make queries for a player's "current" Elo score much quicker. However, one small problem arises when we remember what metrics are typically associated with a rating system like this: people want rankings!

If the above solution was all we had, generating a list of "current" rankings would involve querying every single player's most up-to-date Elo value. Even with an indexed `current` flag, that's still one query of the `EloSnapshot` table for each player, for *every single player to ever play a game*. That's terribly inefficient, especially for a query that's likely to be one of the most common ones in the entire API. It is therefore prudent to put some engineering effort into optimizing it.

### Possibilities

The solution that came to mind most immediately is caching. If that query were run on a schedule, say, once per day, then the results could be cached and served whenever it was requested. This is a good starting point, it leaves out a few key things that we wanted to prioritize.

First, "Elo rank" isn't the only nontrivial metric end users are interested in. They may also be curious about a player's highest-ever Elo score or career win percentage. For some more complex metrics, maintaining dedicated queries to be carried out on a per-user basis may make sense, but for simple ones like these it's entirely reasonable for users to expect a query that can serve them en masse.

Second - and this is slightly less justifiable but still important - if we were to cache in this manner, the API wouldn't provide results that were truly "current." That could be improved by increasing the frequency of that caching, but that can also be risky because of how intensive those queries are - The risk of pooling issues or other difficult-to-diagnose delays increases dramatically with such large, locking queries.

This second issue also highlights the general dangers of a scheduled cache update query; due to the global and hobbyist natures of the communtiy, it is unlikely we can rely on API usage patterns to the degree that some software services do. There is no expectation that query traffic will decrease dramatically during European or North American nighttime (sleep schedules of some of our top players Western players nonwithstanding), because the community has a strong presence in East and Southeast Asia, Austrailia, and New Zealand.

## Approach

The principal issues that arise from any caching approach is that for any given parse, however frequent, the algorithm would need to query the entire `ComputedElo` table. It would then require the "current" (most recent) `EloSnapshot` entry for *every single player* in the database, at which point a massive in-memory parse and cross-comparison could begin. This is what's known in the industry as suboptimal.

For single-match results, however, an upper and lower bound are provided for the actual Elo score of affected players: the minimum and maximum Elo scores of the players, both before and after the match, provide an overall bound for the number of players whose `rank` fields may change. Here's an example:

> Two players with Elo scores `A (1351)` and `B (1420)` compete. Player `A` wins, making their new scores `A (1378)` and `B (1401)`. Those two entries can be added to the `EloSnapshot` model, and we can then update `ComputedElo` simultaneously; within it, we only need to update the entries with scores between `1351` and `1420`. **Crucially, those quantities are known *before* any queries take place**. The filtering can therefore occur at the database level, and the queries to pull from and write to the database are separated by a parse (within TypeScript) of just that small subset of the table.

It's even possible to extend this optimization to multiple matches when they're added to the database simultaneously. The biggest efficiency problem with the scheduled update approach is the expensive query on `EloSnapshot`, but if all new matches and their corresponding Elo changes already exist in memory (for instance, as part of a batch mutation whose `EloSnapshots` have already been generated), we can use the same technique outlined above but for all Elo updates from *all* matches to ensnare a slightly larger Elo range for updating. In that case, the highest and lowest overall Elo scores present in any of the matches would act as the lower and upper bounds.

A side note: It's theoretically possible to write a smarter algorithm that parses all the Elo changes and generates a number of ranges, to further minimize the parsing and sorting needed within TypeScript. However, that would result in far *more* queries to the database (one for each range, rather than just one in total), and would be a relatively complex set of logic for minimal benefit besides. It may eventually be worth it if we scale up to the point of computing these operations on database _replica_ sets, where the batching of write queries is multi-layered already, but even that is unlikely, and wholly out of scope regardless.

So, the approach is as follows, diagrammed with mermaidjs:

```mmd
graph TD
  Z["Start"] --> |"DB read"| A["All matches after timestamp"]
  A --> |"DB read"| B["ComputedElo entries to edit"]
  B --> W{{"Compute new Elo from match results"}} --> 
      C["Updated ComputedElo for participants"] & X["New EloSnapshots for matches"]
  C --> |"DB read"| D["Pull *all* ComputedElo in [min,max] range"]
  D --> |"in-memory sort"| E["Ordered and ranked ComputedElo, with all updates applied"]
  E --> |"DB write"| F["Write new ComputedElo"]
  X -....-> Y["Write new EloSnapshots"]
  F --> |"DB write"| Y
```

The two writes at the end, of updated `ComputedElo` entries and new `EloSnapshot` entries, could theoretically be batched, and indeed care was taken to batch all `ComputedElo` updates into a single query using [Prisma's transaction API](https://www.prisma.io/docs/concepts/components/prisma-client/transactions#the-transaction-api). However, there's no great need to batch the `EloSnapshot` updates into that, because they are queried much less frequently. We therefore perform that batched write *after* the `ComputedElo` updates have taken place. 

## Conclusion
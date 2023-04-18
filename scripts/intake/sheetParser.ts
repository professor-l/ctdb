import { readFileSync } from "fs";
import { EventTemp, GameTemp, MatchTemp } from "./types";
import { OrganizationTemp } from "./types";

const events = new Map<string, EventTemp>();
const matches = new Map<string, MatchTemp>();

export function parseCSV(organizations: Map<string, OrganizationTemp>) {
    // TODO: make this actually inputtable from command line
    const filename = 'scripts/intake/Classic_Tetris_Match_Database_MatchHistory_Delimited.txt';
    const result = readFileSync(filename, 'utf-8');
    
    // Split result into a 2d array
    const finalResult: string[] = result.split("\r\n");
    finalResult.shift();

    const twoPlayerMatches = new Map<string, string[]>();
    const threePlayerMatches = new Map<string, string[][]>();
    
    finalResult.forEach(f => {
        const row = f.split("|");
        const id = row[0];
        let m: string[] | undefined;
        let m2: string[][] | undefined;
        if ((m = twoPlayerMatches.get(id)) !== undefined) {
            twoPlayerMatches.delete(id);
            threePlayerMatches.set(id, [m, row]);
        }
        else if ((m2 = threePlayerMatches.get(id)) !== undefined) {
            m2.push(row);
        }
        else
            twoPlayerMatches.set(id, row);
    });

    // categorize each line
    for (let i = 1, a = finalResult.length; i < a; ++i) {

        /* here's how the array breaks down:
        0  : match number
        1  : first player name
        2  : first player score
        3  : second player score
        4  : second player name
        5  : bestOf
        6  : total competitors in match
        7  : event name
        8  : edition
        9  : date/time
        10 : round
        11 : streamer/location
        12 : competitve or friendly
        */
        
        const [
            matchNumber,
            p1Name,
            p1Score,
            p2Score,
            p2Name,
            , // bestOf (unused)
            , // playerCount (unused)
            eventName,
            eventEdition,
            timestamp,
            , // round (unused)
            location,
            matchType
        ] = finalResult[i].split("|");
        
        const eventId = eventName + " " + eventEdition;
        
        // Create a new event if necessary
        if (!events.has(eventId)) {
            const e: EventTemp = {
                id: eventId,
                name: eventId,
                organizer: location,
                matches: []
            };

            // Set the organization, creating a new one if necessary
            const org = orgExists(organizations, [eventId, location]);

            if (org !== null)
                organizations.get(org)?.events.push(e);

            else {
                organizations.set(location, {
                    id: location,
                    keywords: [location],
                    name: location,
                    events: [e]
                });
            }

            events.set(eventId, e);
        }

        // dispatch depending on player count
        if (threePlayerMatches.has(matchNumber))
            handleThreePlayerMatch(
                threePlayerMatches.get(matchNumber) || [[]],
                eventId
            );
        else
            handleTwoPlayerMatch(
                matchNumber,
                p1Name, p1Score,
                p2Name, p2Score,
                eventId,
                timestamp,
                matchType
            );
    }

    return organizations;
}

function handleTwoPlayerMatch(
    matchNumber: string,
    p1Name: string, p1Score: string,
    p2Name: string, p2Score: string,
    eventId: string,
    timestamp: string,
    matchType: string
) {

    // Create a new match
    const match: MatchTemp = {
        id: matchNumber,
        competitive: matchType == "COMP" ? true : false,
        games: [],
        timestamp: convertTime(timestamp)
    };

    // Create a new game and result, add to match
    let p1Victories = parseInt(p1Score);
    let p2Victories = parseInt(p2Score);

    for (let i = 0; i < p1Victories + p2Victories;) {
        const g: GameTemp = { results: [] };
        match.games.push(g);

        let pWinner = 1;
        if (p1Victories > 0) {
            pWinner = 0;
            --p1Victories;
        }
        else
            --p2Victories;

        g.results.push({
            player: p1Name,
            rank: pWinner + 1
        });
        g.results.push({
            player: p2Name,
            rank: (pWinner * -1) + 2
        });
    }

    matches.set(matchNumber, match);
    events.get(eventId)?.matches.push(match);
}

function handleThreePlayerMatch(
    matches: string[][],
    eventId: string
) {
    return [matches, eventId];
    // const results = new Map<string, number[]>();
    // const players = new Set<string>();

    // let gameCount = 0;
    // matches.forEach(m => {
    //     const v0 = m.slice(1, 5);
    //     const f = [[v0[0], v0[1]], [v0[3], v0[2]]].sort();
    //     const names = f[0][0] + "|" + f[1][0];
    //     const scores = [f[0][1], f[1][1]].map(x => parseInt(x));
    //     if (!gameCount)
    //         gameCount = scores[0] + scores[1];
    //     results.set(names, scores);
    //     players.add(f[0][0]);
    //     players.add(f[1][0]);
    // });

    // const games = [];
    // for (let i = 0; i < gameCount; ++i)
    //     games.push([]);

    // let emptyGame = 0;

    // let populated = false;

    // while (!populated) {
    //     const values = new Map<string, number>();
    //     const pairs = [...results.keys()].sort();
    //     const scores = pairs.map(p => results.get(p) || [0, 0]);

    //     players.forEach(p => values.set(p, 1));

    //     for (let i = 0; i < pairs.length; ++i) {
    //         const p = pairs[i].split("|");
    //         const s = scores[i] || 0;
    //         for (let j = 0; j < 2; ++j) {
    //             const v = values.get(p[j]) || 0;
    //             values.set(p[j], v * s[j]);
    //         }
    //     }

    //     [...values.keys()].forEach(p => {

    //     });
    // }
}

function orgExists(
  orgs: Map<string, OrganizationTemp>,
  searchInStrings: string[]
): string | null {
  let finalOrg: string | null = null;
  const s = searchInStrings.join(" ");
  
  for (const org of orgs.values()) {
    for (const keyword of org.keywords) {

      // if keyword is exclusionary and we find it, break inner loop
      if (keyword[0] == '!' && s.search(keyword.substring(1)) != -1) {
        finalOrg = null;
        break;
      }
    
      else if (s.search(keyword) != -1)
        finalOrg = org.id;
    }

    if (finalOrg !== null)
      break;
  }

  return finalOrg;

}

function convertTime(
  t: string
) {

  const s = t.split("/");
  if (s.length > 1) {
    const x = s[0];
    s[0] = s[1];
    s[1] = x;
  }

  return new Date(s.join("/") + " UTC");
}

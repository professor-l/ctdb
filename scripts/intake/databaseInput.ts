import { prisma } from "../../src/context";
import { OrganizationTemp } from "./types";
import { RomVersion, MatchType, Match } from "@prisma/client";

export async function addToDatabase(orgs: Map<string, OrganizationTemp>) {
  let matches = 0;

  const orgList = Array.from(orgs.values());

  console.log(orgList.map(o => o.name));

  // for each org
  for (const o of orgList) {

    // add org to db
    const prismaOrg = await prisma.organization.upsert({
      where: {
        name: o.name,
      },
      update: {},
      create: {
        name: o.name,
        description: "",
      }
    });

    // for each event
    for (const e of o.events) {
      // add event to db
      const prismaEvent = await prisma.event.upsert({
        where: { name: e.name },
        update: {},
        create: {
          name: e.name,
          organizerId: prismaOrg.id,
        }
      });

      // for each match
      for (const m of e.matches) {
        // add match to db
        let prismaMatch: Match;
        try {
          prismaMatch = await prisma.match.create({
            data: {
              eventId: prismaEvent.id,
              timestamp: m.timestamp,
              rom: RomVersion.NTSC,
              type: m.competitive ? MatchType.COMPETITIVE : MatchType.FRIENDLY,
            }
          });
        } catch (err) {
            console.log(err);
            console.log(m);
            console.log(prismaEvent);
            break;
        }

        // for each game
        for (const g of m.games) {
          // add game to db
          const prismaGame = await prisma.game.create({
            data: {
              matchId: prismaMatch.id,
            }
          });

          // for each result
          for (const r of g.results) {
            // upsert player from db
            const prismaPlayer = await prisma.player.upsert({
                where: {
                  eloName: r.player,
                },
                update: {
                  eloName: r.player,
                },
                create: {
                  eloName: r.player,
                }
            });

            // add result to db
            await prisma.result.create({
              data: {
                gameId: prismaGame.id,
                playerId: prismaPlayer.id,
                rank: r.rank,
                score: r.score,
              }
            });
          }
        }
        matches += 1;
        if (matches % 100 == 0)
          console.log("added " + matches + " matches");
      }
    }
  }
}

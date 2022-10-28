import { OrganizationTemp, EventTemp, PlayerTemp, ResultTemp, GameTemp, MatchTemp } from "./types";
import { events, players, results, games, matches } from "./sheetParser";
import { MatchType, RomVersion } from "../../src/types";
import { organizations } from "./orgList";
import { GraphQLContext, prisma } from "../../src/context";
import { Organization, Event, Match, Player, Result, Game } from "@prisma/client";

export async function input(){
    // Loop through each data structure (or just use the highest level and go down?)
    for (const org of organizations.values()){
        const finalOrg = await prisma.organization.create({
            data: {
                name: org.name,
                description: "PLACEHOLDER",
            }
        });        
        for (const event of org.events){
            const finalEvent = await prisma.event.create({
                data: {
                    name: event.name,
                    edition: event.edition,
                    organizerId: event.organizer,
                }
            });
            for (const match of event.matches){
                const finalMatch = await prisma.match.create({
                    data: {
                        event : {
                            connect: { name: event.name },
                        },
                        timestamp: match.timestamp
                    }
                });
                
                for (const game of match.games){
                    // results already created in player loop?
                    const finalGame = await prisma.game.create({
                        data: {
                            id: game.id,
                            matchId: game.match.id,
                            timestamp: new Date(game.timestamp)
                        }
                    });
                }

                for (const player of match.players){
                    const finalPlayer = await prisma.player.create({
                        data: {
                            name : player.name,
                            eloName : player.name
                        }
                    });

                    for(const result of player.results){
                        const finalResult = await prisma.result.create({    
                            data: {
                                player: {
                                    connect: { eloName: player.name},
                                },
                                game: {
                                    connect: {id: result.gameId},
                                },
                                rank: result.rank,
                                score: result.score
                            }
                        });
                    }
                }
            }
        }
    }
}
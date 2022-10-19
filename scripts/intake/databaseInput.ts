import { OrganizationTemp, EventTemp, PlayerTemp, ResultTemp, GameTemp, MatchTemp } from "./types";
import { events, players, results, games, matches } from "./sheetParser";
import { MatchType, RomVersion } from "../../src/types";
import { organizations } from "./orgList";
import { GraphQLContext, prisma } from "../../src/context";
import { Organization, Event, Match, Player, Result, Game } from "@prisma/client";

async function input(){
    // Loop through each data structure (or just use the highest level and go down?)
    for (const org of organizations.values()){
        var events : Event[];
        for (const event of org.events){
            var matches : Match[];
            for (const match of event.matches){
                var players : Player[];
                for (const player of match.players){
                    for(const result of player.results){

                    }
                }

                for (const game of match.games){
                    // results already created in player loop
                }
            }

            const finalEvent = await prisma.event.create({
                data: {
                    name: event.name,
                    edition: event.edition,
                    organizerId: event.organizer,
                    matches: matches
                }
            })
            events.push(finalEvent);
        }

        const finalOrg = await prisma.organization.create({
            data: {
                name: org.name,
                description: "PLACEHOLDER",
                events: events
            }
        });
    }
    // Turn  Temp types into proper Prisma types
}
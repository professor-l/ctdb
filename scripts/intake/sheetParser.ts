import { readFileSync } from "fs";
import { EventTemp, PlayerTemp, ResultTemp, GameTemp, MatchTemp } from "./types";
import { organizations } from "./orgList";

export var events = new Map<string, EventTemp>();
export var players = new Map<string, PlayerTemp>();
export var results = new Map<string, ResultTemp>();
export var games = new Map<string, GameTemp>();
export var matches = new Map<string, MatchTemp>();

export function parseCSV(){
    // TODO: make this actually inputtable from command line
    const filename : string = 'Classic_Tetris_Match_Database_MatchHistory_Delimited.txt'
    var result = readFileSync(filename, 'utf-8');

    // Split result into a 2d array
    var finalResult : string[] = result.split("\r\n");

    // categorize each line
    for(var i = 1; i < finalResult.length; ++i){
        var data = finalResult[i].split("|");
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

        const eventId = data[7] + " " + data[8];

        // Create a new event if necessary
        if (!events.has(eventId)){
            var e : EventTemp = {
                id : eventId,
                name : data[7],
                edition : data[8],
                organizer : data[11],
                matches : []
            }
            events.set(eventId, e);

            // Set the organization, creating a new one if necessary
            var orgAdded : Boolean = false;
            for(const org of organizations.values()){
                for(const keyword of org.keywords){
                    if(keyword[0] == '!' && eventId.search(keyword.substring(1)) != -1){
                        orgAdded = false;
                        break;
                    } else if (eventId.search(keyword) != -1 || data[11].search(keyword) != -1){
                        orgAdded = true;
                        e.organizer = org.id;
                        org.events.push(e);
                    }
                }
                if(orgAdded){
                    break;
                }
            }
            if(!orgAdded){
                organizations.set(data[11], {
                    id : data[11],
                    keywords : [data[11]],
                    name : data[11],
                    events : [e]
                });
            }
        } 

        // Create new players if necessary
        if (!players.has(data[1])){
            var p : PlayerTemp = {
                name : data[1],
                results : []
            };
            players.set(data[1], p);
        }
        if (!players.has(data[4])){
            var p : PlayerTemp = {
                name : data[4],
                results : []
            };
            players.set(data[4], p);
        }

        // Create a new match if necessary
        if (!matches.has(data[0])){
            var m : MatchTemp = {
                id : data[0],
                eventId : data[7],
                players : [players.get(data[1]) as PlayerTemp, players.get(data[4]) as PlayerTemp],
                competitive : (data[12]),
                games : []
            };
            matches.set(data[0], m);
            events.get(data[7] + " " + data[8])?.matches.push(m);
        }
        

        // Create a new game and result, add to match
        var p1result : ResultTemp = {
            id : data[0] + " " + data[1],
            player : players.get(data[1]) as PlayerTemp,
            gameId : data[0] + " " + data[1] + " " + data[4],
            rank : (parseInt(data[2]) > parseInt(data[3]) ? 1 : 2),
            score : parseInt(data[2])
        }
        players.get(data[1])?.results.push(p1result);
        results.set(data[0] + " " + data[1], p1result);
        var p2result : ResultTemp = {
            id : data[0] + " " + data[4],
            player : players.get(data[4]) as PlayerTemp,
            gameId : data[0] + " " + data[1] + " " + data[4],
            rank : (parseInt(data[2]) > parseInt(data[3]) ? 2 : 1),
            score : parseInt(data[3])
        }
        players.get(data[4])?.results.push(p2result);
        results.set(data[0] + " " + data[4], p2result);
        var g : GameTemp = {
            id : data[0] + " " + data[1] + " " + data[4],
            match : matches.get(data[0]) as MatchTemp,
            timestamp : data[9],
            results : [p1result, p2result]
        }
        games.set(data[0] + " " + data[1] + " " + data[4], g);

        matches.get(data[0])?.games.push(g);
    }
    
    console.log(organizations.get('CTM'));
    for (const org of organizations.entries()){
        console.log(org[1]);
    }
}
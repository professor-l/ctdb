import { readFileSync } from "fs";
import { EventTemp, PlayerTemp, ResultTemp, GameTemp, MatchTemp } from "./types";
import { organizations } from "./orgList";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

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
                games : [],
                timestamp : new Date(data[9]) 
            };
            matches.set(data[0], m);
            events.get(data[7] + " " + data[8])?.matches.push(m);
        } else {
            if (!matches.get(data[0])?.players.includes((players.get(data[1])) as PlayerTemp)){
                matches.get(data[0])?.players.push((players.get(data[1])) as PlayerTemp);
            }
            if (!matches.get(data[0])?.players.includes((players.get(data[4])) as PlayerTemp)){
                matches.get(data[0])?.players.push((players.get(data[4])) as PlayerTemp);
            }
        }
        

        // Create a new game and result, add to match
        // TODO: actually create multiple games
        var p1Victories = parseInt(data[2]);
        var p2Victories = parseInt(data[3]);
        for(var i = 0; i < p1Victories; ++i){
            var p1result : ResultTemp = {
                id : data[0] + " " + data[1],
                player : players.get(data[1]) as PlayerTemp,
                gameId : data[0] + " " + data[1] + " " + data[4],
                rank : 1,
                score : parseInt(data[2])
            }
            players.get(data[1])?.results.push(p1result);
            results.set(data[0] + " " + data[1], p1result);
            var p2result : ResultTemp = {
                id : data[0] + " " + data[4],
                player : players.get(data[4]) as PlayerTemp,
                gameId : data[0] + " " + data[1] + " " + data[4],
                rank : 2,
                score : parseInt(data[3])
            }
            players.get(data[4])?.results.push(p2result);
            results.set(data[0] + " " + data[4], p2result);
    
            var g : GameTemp = {
                id : data[0] + " " + data[1] + " " + data[4] + " p1 " + i,
                match : matches.get(data[0]) as MatchTemp,
                timestamp : new Date(data[9]),
                results : [p1result, p2result]
            }
            games.set(data[0] + " " + data[1] + " " + data[4] + " p1 " + i, g);
    
            matches.get(data[0])?.games.push(g);
        }
        for(var i = 0; i < p2Victories; ++i){
            var p1result : ResultTemp = {
                id : data[0] + " " + data[1],
                player : players.get(data[1]) as PlayerTemp,
                gameId : data[0] + " " + data[1] + " " + data[4],
                rank : 2,
                score : parseInt(data[2])
            }
            players.get(data[1])?.results.push(p1result);
            results.set(data[0] + " " + data[1], p1result);
            var p2result : ResultTemp = {
                id : data[0] + " " + data[4],
                player : players.get(data[4]) as PlayerTemp,
                gameId : data[0] + " " + data[1] + " " + data[4],
                rank : 1,
                score : parseInt(data[3])
            }
            players.get(data[4])?.results.push(p2result);
            results.set(data[0] + " " + data[4], p2result);
    
            var g : GameTemp = {
                id : data[0] + " " + data[1] + " " + data[4] + " p2 " + i,
                match : matches.get(data[0]) as MatchTemp,
                timestamp : new Date(data[9]),
                results : [p1result, p2result]
            }
            games.set(data[0] + " " + data[1] + " " + data[4] + " p2 " + i, g);
    
            matches.get(data[0])?.games.push(g);
        }
    }


    // Rectify Games and Results, handling 3+ player matches differently from 2 player
    var multiplayerMatches : MatchTemp[] = [];
    var sweepCase : MatchTemp[] = [];
    for (var match of matches.entries()){
        if(match[1].players.length > 2){
            multiplayerMatches.push(match[1]);
            /*
            Problem: For 3 player matches, the results are stored as 3 different games between each pair of player.
                     We need to change this to figure out how many games actually got played and store multiple games with three results for each
            
            For players a, b, c, we have results ab, ac, bc,
            For games g, each result will total both sides to g
            Where A is how many games a beat b, C is how many games c beat a, and B is how many games b beat c
               |  a  |  b  |  c  |
            ab |  A  | g-A |  X  | 
            ac | g-C |  X  |  C  |
            bc |  X  |  B  | g-B |

            We need to determine the order of rankings for each game.

            Special cases:

            player a wins all games against player b:
                Solved, as ac determines how many games a vs c are first, and bv determines how many games b vs c are last
                14 matches fit this case; 13 remain to be solved

            */
            var gameOne : number[] = [match[1].games[0].results[0].score, match[1].games[0].results[1].score];   //ab
            var gameTwo : number[] = [match[1].games[1].results[0].score, match[1].games[1].results[1].score];   //ac
            var gameThree : number[] = [match[1].games[2].results[0].score, match[1].games[2].results[1].score]; //bc
            var trueGameTotal : number = gameOne[0] + gameOne[1];
            var trueGameStandings : PlayerTemp[];

            // TODO: properly detect which games are which matchups since there isn't actually a standard order
            var playerA : PlayerTemp = match[1].games[0].results[0].player;
            var playerB : PlayerTemp = match[1].games[0].results[1].player;
            var playerC : PlayerTemp = match[1].games[1].results[1].player;
            
            if(gameOne[0] > gameOne[1]){ // a > b
                if(gameTwo[0] > gameTwo[1]){ // a > c
                    if(gameThree[0] > gameThree[1]){ // b > c
                        trueGameStandings = [playerA,
                            playerB,
                            playerC];
                    } else { // c > b
                        trueGameStandings = [playerA,
                            playerC,
                            playerB];
                    }
                } else { // c > a (forces c > b)
                    trueGameStandings = [playerC,
                        playerA,
                        playerB];
                }
            } else { // b > a
                if(gameTwo[0] > gameTwo[1]){ // a > c ( forces b > c)
                    trueGameStandings = [playerB,
                        playerA,
                        playerC];
                } else { // c > a
                    if(gameThree[0] > gameThree[1]){ // b > c
                        trueGameStandings = [playerB,
                            playerC,
                            playerA];
                    } else { // c > b
                        trueGameStandings = [playerC,
                            playerB,
                            playerA];
                    }
                }
            }
            
            for(const game of match[1].games.entries()){
                for(const result of game[1].results.entries()){
                    if(result[1].score == 0 && !sweepCase.includes(match[1])){
                        sweepCase.push(match[1]);
                    }
                }
            }

            console.log(match[1]);
            for(const game of match[1].games.entries()){
                console.log(game[1].id);
            }
            console.log(trueGameStandings);
        }
    }
    for (const match of multiplayerMatches){
        console.log(match.id);
    }
    console.log("Total Matches : " + matches.size);
    console.log("3 Player Matches : " + multiplayerMatches.length);
    console.log("Swept matches : " + sweepCase.length);
}
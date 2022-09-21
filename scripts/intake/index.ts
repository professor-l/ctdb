import { Organization, Event, Player, Result, Game, Match} from '@prisma/client';
import {readFileSync} from 'fs'
import { CountryCodeResolver } from 'graphql-scalars';
import { initial } from 'lodash';
import { StringLiteral } from 'typescript';
import org from '../../src/resolvers/Organization';
import { organizations, init } from './orgList';

// Storing all the data we find along the way in maps, keyed by name, except for matches
// QUESTION: does it make sense to build the actual objects as we go or use temp types
// var organizations = new Map<string, Organization>();
// var events = new Map<string, Event>();
// var players = new Map<string, Player>();
// var results = new Map<number, Result>();
// var games = new Map<number, Game>();
// var matches = new Map<number, Match>();

export type OrganizationTemp = {
    id : string,
    keywords : string[],
    name : string,
    events : EventTemp[]
};

type EventTemp = {
    id : string,
    name : string,
    edition : string,
    organizer : string,
    matches : MatchTemp[]
};

type PlayerTemp = {
    name : string,
    results : ResultTemp[]
};

type ResultTemp = {
    id : string,
    player : PlayerTemp,
    gameId : string,
    rank : number,
    score : number
};

type GameTemp = {
    id : string,
    match : MatchTemp,
    timestamp : string,
    results : ResultTemp[]
}

type MatchTemp = {
    id : string,
    eventId : string,
    players : PlayerTemp[],
    competitive : string, // true if COMP
    games : GameTemp[]
};

var events = new Map<string, EventTemp>();
var players = new Map<string, PlayerTemp>();
var results = new Map<string, ResultTemp>();
var games = new Map<string, GameTemp>();
var matches = new Map<string, MatchTemp>();

function main(){
    init();

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
        

        // Create any new necessary objects
        const eventId = data[7] + " " + data[8];
        if (!events.has(eventId)){
            var e : EventTemp = {
                id : eventId,
                name : data[7],
                edition : data[8],
                organizer : data[11],
                matches : []
            }
            events.set(eventId, e);

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
        

        // create new game and result, add to match
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


main();
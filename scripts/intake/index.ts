import { Organization, Event, Player, Result, Game, Match} from '@prisma/client';
import {readFileSync} from 'fs'
import { CountryCodeResolver } from 'graphql-scalars';
import { initial } from 'lodash';
import { StringLiteral } from 'typescript';

// Storing all the data we find along the way in maps, keyed by name, except for matches
// QUESTION: does it make sense to build the actual objects as we go or use temp types
// var organizations = new Map<string, Organization>();
// var events = new Map<string, Event>();
// var players = new Map<string, Player>();
// var results = new Map<number, Result>();
// var games = new Map<number, Game>();
// var matches = new Map<number, Match>();

type OrganizationTemp = {
    id : string,
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

var organizations = new Map<string, OrganizationTemp>();
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

        // TODO: learn what's up with these events
        // 'Singapore' | Multiple years here
        // CTWQ WestCoast 2018 | probably Classic Tetris World Championship?
        // NeoGeo | Is NeoGeo the organizer? Google says it's a console
        // Other | There's a few 'Other' where the only other info is location. Presumably I need to ask someone who knows the competitors
        // Tetris Deathmatch | I'd assume the streamer is the organizer but need to make sure
        // CTAO
        // Canada NWOntario
        // Canada Manitoba
        // Canada 2019
        // CT Entertainment | This feels like it's probably the name of the organizer too
        // 'Best of 75' | the organizer is just 'Richard' for this one
        // CTXYZ
        // Raccoon Cup | p sure this is self explanatory but it might be hosted by SFU Tetris?
        

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

            // Known organizers
            if (eventId.search('CTM') != -1){
                organizations.get('CTM')?.events.push(e);
            } else if (eventId.search('CTWC') != -1){
                organizations.get('CTWC')?.events.push(e);
            } else if (eventId.search('GDQ') != -1){
                organizations.get('GDQ')?.events.push(e);
            } else if (eventId.search('CT Gauntlet') != -1){
                organizations.get('CT Gauntlet')?.events.push(e);
            } else if (eventId.search('CTLATAM') != -1){
                organizations.get('CTLATAM')?.events.push(e);
            } else if (eventId.search('CT League') != -1){
                organizations.get('CT League')?.events.push(e);
            }
            // Unknown organizers
            else if (organizations.has(data[11])){
                organizations.get(data[11])?.events.push(e);
            } else {
                organizations.set(data[11], {
                    id : data[11],
                    name : data[11],
                    events : [e]
                })
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
    
    for (const org of organizations.entries()){
        console.log(org[1]);
        console.log(org[1].events);
    }
}

// Initialize data structures with known values
function init() {
    // Initialize known organizers
    // If title contains 'CTM' organizer is Classic Tetris Monthly
    // If title contains 'CTWC' organizer is Classic Tetris World Championship
    // If title contains 'GDQ' organizer is Games Done Quick
    // If title contains 'CT Gauntlet' organizer is Classic Tetris Gauntlet
    organizations.set('CTM', {
        id : 'CTM',
        name : 'Classic Tetris Monthly',
        events : []
    })
    organizations.set('CTWC', {
        id : 'CTWC',
        name : 'Classic Tetris World Championship',
        events : []
    })
    organizations.set('GDQ', {
        id : 'GDQ',
        name : 'Games Done Quick',
        events : []
    })
    organizations.set('CT Gauntlet', {
        id : 'CT Gauntlet',
        name : 'Classic Tetris Gauntlet',
        events : []
    })
    organizations.set('CTLATAM', {
        id : 'CTLATAM',
        name : 'Classic Tetris LATAM',
        events : []
    })
    organizations.set('CT League', {
        id : 'CT League',
        name : 'Classic Tetris League',
        events : []
    })

}
main();
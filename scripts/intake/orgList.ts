import { OrganizationTemp } from './types';

export var organizations = new Map<string, OrganizationTemp>();

// TODO: learn what's up with these events
// NeoGeo | Is NeoGeo the organizer? Google says it's a console
// CTAO | Classic Tetris Australia Online
// 'Best of 75' | the organizer is just 'Richard' for this one
// CTXYZ
// Elo Battles
// CT Level Twelve
// Sixfour Invitational
// BeNeLux

export function init() {
    organizations.set('CTM', {
        id : 'CTM',
        keywords : ['CTM', 'Deathmatch'],
        name : 'Classic Tetris Monthly',
        events : []
    });
    organizations.set('CTWC', {
        id : 'CTWC',
        keywords : ['CTWC', '!Qualifier'], //First instance of anti-key: w/! the key will exclude anything with it
        name : 'Classic Tetris World Championship',
        events : []
    });
    organizations.set('GDQ', {
        id : 'GDQ',
        keywords : ['GDQ'],
        name : 'Games Done Quick',
        events : []
    });
    organizations.set('CT Gauntlet', {
        id : 'CT Gauntlet',
        keywords : ['CT Gauntlet'],
        name : 'Classic Tetris Gauntlet',
        events : []
    });
    organizations.set('LATAM', {
        id : 'LATAM',
        keywords : ['LATAM'],
        name : 'Classic Tetris LATAM',
        events : []
    });
    organizations.set('CT League', {
        id : 'CT League',
        keywords : ['CT League'],
        name : 'Classic Tetris League',
        events : []
    });
    organizations.set('CT Entertainment', {
        id : 'CT Entertainment',
        keywords : ['CT Entertainment'],
        name : 'Classic Tetris Entertainment',
        events : []
    });
    organizations.set('LGBTetris', {
        id : 'LGBTetris',
        keywords : ['LGBTetris'],
        name : 'LGBT Tetris',
        events : []
    });
    organizations.set('CT Teams', {
        id : 'CT Teams',
        keywords : ['CT Teams'],
        name : 'Classic Tetris Teams',
        events : []
    });
    organizations.set('CTB', {
        id : 'CTB',
        keywords : ['CTB', 'CT Brawl'],
        name : 'Classic Tetris Brawl',
        events : []
    });
    organizations.set('WPL', {
        id : 'WPL',
        keywords : ['WPL'],
        name : 'World Puzzle League',
        events : []
    });
    organizations.set('CTG', {
        id : 'CTG',
        keywords : ['CTG', '!CTGL'],
        name : 'Classic Tetris Gauntlet',
        events : []
    });
    organizations.set('Friendlies', {
        id : 'Friendlies',
        keywords : ['Friendlies', 'Unfriendlies'],
        name : 'Friendlies',
        events : []
    });
    organizations.set('CT Asia', {
        id : 'CT Asia',
        keywords : ['Asia'],
        name : 'Classic Tetris Asia',
        events : []
    });
    organizations.set('Raccoon Cup', {
        id : 'Raccoon Cup',
        name : 'Raccoon Cup',
        keywords : ['Raccoon Cup'],
        events : []
    });
    organizations.set('Canada', {
        id : 'Canada',
        name : 'Classic Tetris Canada',
        keywords : ['Canada', 'Vancouver'],
        events : []
    });
    organizations.set('Poland', {
        id : 'Poland',
        name : 'Classic Tetris Poland',
        keywords : ['Poland'],
        events : []
    });
    organizations.set('Champions Summit', {
        id : 'Champions Summit',
        name : 'Champions Summit',
        keywords : ['Champions Summit'],
        events : []
    });
    organizations.set('Singapore', {
        id : 'Singapore',
        name : 'Classic Tetris Singapore',
        keywords : ['Singapore'],
        events : []
    });
    organizations.set('USA', {
        id : 'USA',
        name : 'Classic Tetris USA',
        keywords : ['USA', 'California', 'Wisconsin', 'Pennsylvania', 'Texas', 'Arizona', 'Connecticut', 'WestCoast', 
                    'MidEast', 'EastCoast', 'Southern', 'Desert', 'Minnesota'],
        events : []
    });
    organizations.set('Norway', {
        id : 'Norway',
        name : 'Classic Tetris Norway',
        keywords : ['Norway'],
        events : []
    });
    organizations.set('China', {
        id : 'China',
        name : 'Classic Tetris China',
        keywords : ['China'],
        events : []
    });
    organizations.set('UK', {
        id : 'UK',
        name : 'Classic Tetris UK',
        keywords : ['UK', 'England'],
        events : []
    });
    organizations.set('Luxembourg', {
        id : 'Luxembourg',
        name : 'Classic Tetris Luxembourg',
        keywords : ['Luxembourg'],
        events : []
    });
    organizations.set('Russia', {
        id : 'Russia',
        name : 'Classic Tetris Russia',
        keywords : ['Russia'],
        events : []
    });
    organizations.set('Hong Kong', {
        id : 'Hong Kong',
        name : 'Classic Tetris Hong Kong',
        keywords : ['Hong Kong'],
        events : []
    });
    organizations.set('Italy', {
        id : 'Italy',
        name : 'Classic Tetris Italy',
        keywords : ['Italy', 'italy'],
        events : []
    });
    organizations.set('Korea', {
        id : 'Korea',
        name : 'Classic Tetris Korea',
        keywords : ['korea', 'Korea'],
        events : []
    });
    organizations.set('Germany', {
        id : 'Germany',
        name : 'Classic Tetris Germany',
        keywords : ['Germany', 'CTGL'],
        events : []
    });
    organizations.set('Iberia', {
        id : 'Iberia',
        name : 'Classic Tetris Iberia',
        keywords : ['Iberia'],
        events : []
    });
    organizations.set('Japan', {
        id : 'Japan',
        name : 'Classic Tetris Japan',
        keywords : ['Japan'],
        events : []
    });
    organizations.set('Vietnam', {
        id : 'Vietnam',
        name : 'Classic Tetris Vietnam',
        keywords : ['Vietnam'],
        events : []
    });
    organizations.set('Brazil', {
        id : 'Brazil',
        name : 'Classic Tetris Brazil',
        keywords : ['Brazil', 'BRAZIL'],
        events : []
    });
    organizations.set('Argentina', {
        id : 'Argentina',
        name : 'Classic Tetris Argentina',
        keywords : ['Argentina', 'ARGENTINA'],
        events : []
    });
    organizations.set('Australia', {
        id : 'Australia',
        name : 'Classic Tetris Australia',
        keywords : ['Australia'],
        events : []
    });
    organizations.set('Tetris All-Stars', {
        id : 'Tetris All-Stars',
        name : 'Tetris All-Stars',
        keywords : ['Tetris All-Stars', 'Tetris Allstars', 'Tetris All Stars'],
        events : []
    });
    organizations.set('BeNeLux', {
        id : 'BeNeLux',
        name : 'Classic Tetris BeNeLux',
        keywords : ['BeNeLux', 'Benelux'],
        events : []
    });
    organizations.set('Gran Colombia', {
        id : 'Gran Colombia',
        name : 'Classic Tetris Gran Colombia',
        keywords : ['Gran Colombia'],
        events : []
    });
}
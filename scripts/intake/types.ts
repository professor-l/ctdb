export type OrganizationTemp = {
    id : string,
    keywords : string[],
    name : string,
    events : EventTemp[]
};

export type EventTemp = {
    id : string,
    name : string,
    edition : string,
    organizer : string,
    matches : MatchTemp[]
};

export type PlayerTemp = {
    name : string,
    results : ResultTemp[]
};

export type ResultTemp = {
    id : string,
    player : PlayerTemp,
    gameId : string,
    rank : number,
    score : number
};

export type GameTemp = {
    id : string,
    match : MatchTemp,
    timestamp : Date,
    results : ResultTemp[]
}

export type MatchTemp = {
    id : string,
    eventId : string,
    players : PlayerTemp[],
    competitive : string,
    games : GameTemp[],
    timestamp : Date
};
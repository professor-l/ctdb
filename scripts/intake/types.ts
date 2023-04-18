export type OrganizationTemp = {
    id : string,
    keywords : string[],
    name : string,
    events : EventTemp[]
};

export type EventTemp = {
    id : string,
    name : string,
    organizer : string,
    matches : MatchTemp[]
};

export type ResultTemp = {
    player : string,
    rank : number,
    score?: number
};

export type GameTemp = {
    results : ResultTemp[]
}

export type MatchTemp = {
    id : string,
    competitive : boolean,
    games : GameTemp[],
    timestamp : Date
};

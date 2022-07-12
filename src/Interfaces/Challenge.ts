export interface Challenge {
    name: string;           //name of the challenge (has to be unique)
    server: string;        //the id of the server that the challenge belongs to
    award: number;           //the points that the challenge gives
    solvedCount: number;     //number of times the challenge has been solved
}
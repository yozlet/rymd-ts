// Cells are what the grid is made of.
// Each cell is either empty space or belongs to a single Room.
import { Room } from "./room";
import { Flavour } from "./flavour";

class Cell {
    public room: Room | null = null;

    constructor(public x: number, public y: number) {
        this.x = x;
        this.y = y;
    }

    public isOccupied(): boolean {
        return this.room !== null;
    }

    public isCorridor(): boolean {
        return this.room !== null && this.room.flavour === Flavour.CORRIDOR;
    }
}

export { Cell };

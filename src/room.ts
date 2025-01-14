// Rooms are shaped like Tetris pieces.
// A Room has a set of its own Cells and a reference to a single 
// entrance/exit Cell.
// A Room has a single Flavour from a set of Flavours.

import { Cell } from "./cell";
import { Flavour } from "./flavour";
class Room {
    public cells: Array<Cell> = [];
    public flavour: Flavour;

    constructor(flavour: Flavour) {
        this.flavour = flavour;
    }

}

export { Room };

// Rooms are shaped like Tetris pieces.
// A Room has a set of its own Cells and a reference to a single 
// entrance/exit Cell.
// A Room has a single Flavour from a set of Flavours.

import { Cell } from "./cell";
import Flavour from "./flavour";

import { HMREventHandler } from './hotmodulereloadsetup';

if (import.meta.hot) {
  import.meta.hot.accept(HMREventHandler)
}

export default class Room {
    public cells: Array<Cell> = [];
    public flavour: Flavour;

    constructor(flavour: Flavour, cells: Array<Cell>) {
        this.flavour = flavour;
        this.cells = cells;
    }

}
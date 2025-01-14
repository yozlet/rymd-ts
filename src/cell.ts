// Cells are what the grid is made of.
// Each cell is either empty space or belongs to a single Room.
import { Room } from "./room";
class Cell {
    public room: Room | null = null;
}

export { Cell };
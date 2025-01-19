import { Cell } from "./cell";
import { Piece } from "./pieces";

class World {
    private grid: Array<Array<Cell>>;
    private pieceSequence: Array<Piece>;

    constructor(gridHeight: number, gridWidth: number) {
        this.grid = Array.from({ length: gridHeight }, 
                                () => Array.from({ length: gridWidth }, 
                                                 () => new Cell()));
        this.pieceSequence = [];
    }

    public getCell(x: number, y: number): Cell {
        return this.grid[y][x];
    }
}

export { World };
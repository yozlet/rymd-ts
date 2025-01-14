import { Cell } from "./cell";

class World {
    private grid: Array<Array<Cell>>;

    constructor(gridHeight: number, gridWidth: number) {
        this.grid = Array.from({ length: gridHeight }, 
                                () => Array.from({ length: gridWidth }, 
                                                 () => new Cell()));
    }

    public getCell(x: number, y: number): Cell {
        return this.grid[y][x];
    }
}

export { World };
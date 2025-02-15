import { Cell } from "./cell";
import World from "./world";
import { Flavours } from "./flavour";
import { HMREventHandler } from './hotmodulereloadsetup';

if (import.meta.hot) {
  import.meta.hot.accept(HMREventHandler)
}

// Minion: a little white entity that moves 1 cell per second along a corridor path.
// It picks a random corridor cell as its destination and uses a simple BFS to pathfind.
export default class Minion {
    public currentCell: Cell;
    private destinationCell: Cell | null = null;
    private path: Cell[] = [];
    private accumulatedTime: number = 0; // seconds

    constructor(initialCell: Cell) {
        this.currentCell = initialCell;
    }

    // Runs when the module is being swapped by Vite's Hot Module Reload.
	// Here we copy the state from the old module instance
	hotReload(oldModule: Minion) {
        console.log("hotReloading Minion");
        this.currentCell = oldModule.currentCell;
        this.destinationCell = oldModule.destinationCell;
        this.path = oldModule.path;
        this.accumulatedTime = oldModule.accumulatedTime;
    }

    // Update minion position; dt is the time delta (in milliseconds)
    public update(dt: number, world: World): void {
        this.accumulatedTime += dt;
        // If no path is available (or we reached our destination), pick a new task.
        if (this.path.length === 0) {
            this.pickNewTask(world);
        }
        // Move one cell each second.
        if (this.accumulatedTime >= 1000 && this.path.length > 0) {
            this.currentCell = this.path.shift()!;
            this.accumulatedTime -= 1000;
        }
    }

    // Select a random corridor cell in the world as destination,
    // then compute a path to it using BFS.
    private pickNewTask(world: World): void {
        let potentialCells: Cell[] = [];
        for (let y = 0; y < world.gridHeight; y++) {
            for (let x = 0; x < world.gridWidth; x++) {
                const cell = world.getCell(x, y);
                if (cell.room && cell.room.flavour === Flavours.CORRIDOR) {
                    potentialCells.push(cell);
                }
            }
        }
        if (potentialCells.length === 0) {
            return;
        }
        // Choose a random corridor destination.
        const randomIndex = Math.floor(Math.random() * potentialCells.length);
        this.destinationCell = potentialCells[randomIndex];
        this.path = this.findPath(world, this.currentCell, this.destinationCell);
        console.log(`Minion picked new task: heading to ${this.destinationCell.x},${this.destinationCell.y} using path ${this.path.map(cell => `[${cell.x},${cell.y}] `).join(',')}`);
    }

    // Compute a path from start to goal (BFS).
    // We only allow movement on corridor cells once the minion leaves its current cell.
    private findPath(world: World, start: Cell, goal: Cell): Cell[] {
        let queue: Array<{ cell: Cell; path: Cell[] }> = [];
        let visited = new Set<string>();
        const key = (cell: Cell) => `${cell.x},${cell.y}`;
        queue.push({ cell: start, path: [] });
        visited.add(key(start));

        while (queue.length > 0) {
            const { cell, path } = queue.shift()!;
            if (cell.x === goal.x && cell.y === goal.y) {
                // Return the computed path (a list of cells leading from start to goal)
                return path;
            }
            // Get 4-directional neighbors.
            const neighbors: Cell[] = [];
            if (cell.x > 0) neighbors.push(world.getCell(cell.x - 1, cell.y));
            if (cell.x < world.gridWidth - 1) neighbors.push(world.getCell(cell.x + 1, cell.y));
            if (cell.y > 0) neighbors.push(world.getCell(cell.x, cell.y - 1));
            if (cell.y < world.gridHeight - 1) neighbors.push(world.getCell(cell.x, cell.y + 1));

            for (let n of neighbors) {
                if (!visited.has(key(n))) {
                    // Allow neighbor if:
                    // - We're leaving the starting cell (even if the start cell isn't a corridor), and
                    // - The neighbor is part of a corridor OR the neighbor is in the same room as the start cell.
                    if (start === cell || (n.room && n.room.flavour === Flavours.CORRIDOR) || (n.room && n.room === start.room)) {
                        visited.add(key(n));
                        queue.push({ cell: n, path: [...path, n] });
                    }
                }
            }
        }
        return [];
    }
}

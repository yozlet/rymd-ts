import { Cell } from "./cell";
import Flavour, { Flavours } from "./flavour";
import Piece, { PieceName } from "./pieces";
import Room from "./room";
import SignalBox from "./signalbox";
import { Signal } from "@preact/signals";
import Minion from "./minion";

import { HMREventHandler } from './hotmodulereloadsetup';

if (import.meta.hot) {
  import.meta.hot.accept(HMREventHandler)
}

// World is where most of the game state and logic lives
export default class World {
    public gridHeight: number;
    public gridWidth: number;
    private grid: Array<Array<Cell>>;

    // List of upcoming pieces
    private pieceSequence: Array<PieceName>;
    private heldPiece: Signal<Piece | null>;
    private heldPieceFlavour: Signal<Flavour>;

    // Array holding active minions in the world
    public minions: Array<Minion> = [];

    constructor(gridHeight: number, gridWidth: number) {
        this.gridHeight = gridHeight;
        this.gridWidth = gridWidth;

        // World has references to key signals in the signalbox
        this.heldPiece = SignalBox.heldPiece;
        this.heldPieceFlavour = SignalBox.heldPieceFlavour;

        // Create the grid
        this.grid = Array.from({ length: gridHeight }, 
                                (_, y) => Array.from({ length: gridWidth }, 
                                                 (_, x) => new Cell(x, y)));

        // Middle of the grid has a corridor room
        const middleX = Math.floor(gridWidth / 2);
        const middleY = Math.floor(gridHeight / 2);
        this.getCell(middleX, middleY).room = new Room(Flavours.CORRIDOR, [this.getCell(middleX, middleY)]);

        // Start piece sequence with a two shuffled arrays of piece names
        this.pieceSequence = Piece.shufflePieceNames().concat(Piece.shufflePieceNames());
        // TODO: handle flavour picking
        this.heldPiece.value = new Piece(this.pieceSequence[0], 0);
    }

    // Runs when the module is being swapped by Vite's Hot Module Reload.
	// Here we copy the state from the old module instance
	hotReload(oldModule: World) {
        console.log("hotReloading World");
        this.gridHeight = oldModule.gridHeight;
        this.gridWidth = oldModule.gridWidth;
        this.grid = oldModule.grid;
        this.pieceSequence = oldModule.pieceSequence;
        this.heldPiece.value = oldModule.heldPiece.value;
        this.heldPieceFlavour.value = oldModule.heldPieceFlavour.value;
        this.minions = oldModule.minions;
	}


    public getCell(x: number, y: number): Cell {
        if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) {
            throw new Error(`Cell out of bounds: ${x}, ${y} (grid size: ${this.gridWidth}x${this.gridHeight})`);
        }
        return this.grid[y][x];
    }

    public getHeldPiece(): Piece {
        return this.heldPiece.value!;
    }

    public setPieceFlavour(flavour: Flavour): void {
        SignalBox.heldPieceFlavour.value = flavour;
    }

    // Returns the coordinates of each cell in the held piece, relative to the mouse position
    public getHeldPieceCellCoords(xMouse: number, yMouse: number): Array<[number, number]> {
        const piece = this.getHeldPiece();
        // Get the bounding box of the piece shape, and the mouse handle position,
        // all within the shape grid
        const { xMin, xMax, yMin, yMax, xHandle, yHandle } = piece.getBoundingHandles();
        const shape = piece.getShape();
        let cellCoords: Array<[number, number]> = [];
        for (let row = yMin; row <= yMax; row++) {
          for (let col = xMin; col <= xMax; col++) {
            if (shape[row][col] != ' ') {
              const xOffset = Math.min(Math.max(0, xMouse - xHandle), this.gridWidth - (xMax + 1));
              const yOffset = Math.min(Math.max(0, yMouse - yHandle), this.gridHeight - (yMax + 1));
              cellCoords.push([col + xOffset - xMin, row + yOffset - yMin]);
            }
          }
        }
        return cellCoords;
    }

    public placeHeldPiece(x: number, y: number): boolean {
        const pieceCellCoords = this.getHeldPieceCellCoords(x, y);
        
        if (this.pieceCanBePlacedOver(pieceCellCoords)) {
            const pieceCells = pieceCellCoords.map(([x, y]) => this.getCell(x, y));
            const room = new Room(this.heldPieceFlavour.value, pieceCells);
            for (const cell of pieceCells) {
                cell.room = room;
            }
            if (room.flavour === Flavours.QUARTERS) {
                const midIndex = Math.floor(pieceCells.length / 2);
                const initialCell = pieceCells[midIndex];
                this.minions.push(new Minion(initialCell));
            }
            this.heldPiece.value = this.getNextPiece();
            this.heldPieceFlavour.value = Flavours.CORRIDOR;
            return true;
        }
        return false;
    }

    // Runs all the checks to see if the piece can be placed at the given coordinates
    public pieceCanBePlacedOver(cellCoords: Array<[number, number]>): boolean {
        return this.pieceCanFitOver(cellCoords) && this.pieceCanConnectOver(cellCoords);
    }

    public pieceCanBePlacedAt(x: number, y: number): boolean {
        return this.pieceCanBePlacedOver(this.getHeldPieceCellCoords(x, y));
    }

    // Decides ONLY if there's room for the piece at the given set of coordinates.
    // Does not check for room connections.
    private pieceCanFitOver(cellCoords: Array<[number, number]>): boolean {
        for (const [x, y] of cellCoords) {
            if (this.getCell(x, y).isOccupied()) {
                return false;
            }
        }
        return true;
    }

    // Decides if there is an adjacent corridor cell to the piece.
    private pieceCanConnectOver(cellCoords: Array<[number, number]>): boolean {
        // Loop through all the cells in the piece
        for (const [x, y] of cellCoords) {
            // Check adjacent cells, but only if they're within grid boundaries
            // TODO: in the future when we have an expanding grid that starts at zero,
            // we should probably fix getCell to automatically return a null cell
            // if the coordinates are out of bounds
            if ((x + 1 < this.gridWidth && this.getCell(x + 1, y).isCorridor()) ||
                (x - 1 >= 0 && this.getCell(x - 1, y).isCorridor()) ||
                (y + 1 < this.gridHeight && this.getCell(x, y + 1).isCorridor()) ||
                (y - 1 >= 0 && this.getCell(x, y - 1).isCorridor())) {
                return true;
            }
        }
        return false;
    }

    private getNextPiece(): Piece {
        // TODO: handle flavour picking
        const piece = new Piece(this.pieceSequence[0], 0);
        this.pieceSequence.shift();
        if (this.pieceSequence.length < 7) {
            this.pieceSequence = this.pieceSequence.concat(Piece.shufflePieceNames());
        }
        return piece;
    }

    // New update method to advance minion movement.
    // dt is the time since the last frame in milliseconds.
    public update(dt: number): void {
        for (const minion of this.minions) {
            minion.update(dt, this);
        }
    }
}
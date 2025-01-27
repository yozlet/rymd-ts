import { Cell } from "./cell";
import { Flavour } from "./flavour";
import { Piece, PieceName } from "./pieces";
import { Room } from "./room";
import { Flavours } from "./flavour";
class World {
    private grid: Array<Array<Cell>>;

    // List of upcoming pieces
    private pieceSequence: Array<PieceName>;
    private heldPiece: Piece;
    private gridHeight: number;
    private gridWidth: number;

    constructor(gridHeight: number, gridWidth: number) {
        this.gridHeight = gridHeight;
        this.gridWidth = gridWidth;
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
        this.heldPiece = new Piece(this.pieceSequence[0], 0, Flavours.CORRIDOR);
    }

    public getCell(x: number, y: number): Cell {
        return this.grid[y][x];
    }

    public getHeldPiece(): Piece {
        return this.heldPiece;
    }

    public setPieceFlavour(flavour: Flavour): void {
        if (this.heldPiece) {
            this.heldPiece.flavour = flavour;
        }
    }

    public getHeldPieceCellCoords(x: number, y: number): Array<[number, number]> {
        const piece = this.getHeldPiece();
        // Get the bounding box of the piece shape, and the mouse handle position,
        // all within the shape grid
        const { xMin, xMax, yMin, yMax, xHandle, yHandle } = piece.getBoundingHandles();
        const shape = piece.getShape();
        let cellCoords: Array<[number, number]> = [];
        for (let row = 0; row < shape.length; row++) {
          for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col] != ' ') {
              // TODO: fix weird offset bugs where mouse seems to be off handle square
              const xOffset = Math.min(Math.max(0, x - xHandle), this.gridWidth - (xMax + 1));
              const yOffset = Math.min(Math.max(0, y - yHandle), this.gridHeight - (yMax + 1));
              cellCoords.push([col + xOffset - xMin, row + yOffset - yMin]);
            }
          }
        }
        return cellCoords;
    }

    public placeHeldPiece(x: number, y: number): boolean {
        const piece = this.heldPiece;
        const pieceCellCoords = this.getHeldPieceCellCoords(x, y);
        
        if (this.pieceCanBePlacedOver(pieceCellCoords)) {
            const pieceCells = pieceCellCoords.map(([x, y]) => this.getCell(x, y));
            const room = new Room(piece.flavour, pieceCells);
            for (const cell of pieceCells) {
                cell.room = room;
            }
            this.heldPiece = this.getNextPiece();
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
        const piece = new Piece(this.pieceSequence[0], 0, Flavours.CORRIDOR);
        this.pieceSequence.shift();
        if (this.pieceSequence.length < 7) {
            this.pieceSequence.concat(Piece.shufflePieceNames());
        }
        return piece;
    }
}

export { World };

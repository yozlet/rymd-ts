import { Cell } from "./cell";
import { Piece, PieceName } from "./pieces";

class World {
    private grid: Array<Array<Cell>>;

    // List of upcoming pieces
    private pieceSequence: Array<PieceName>;
    private heldPiece: Piece;

    constructor(gridHeight: number, gridWidth: number) {
        this.grid = Array.from({ length: gridHeight }, 
                                () => Array.from({ length: gridWidth }, 
                                                 () => new Cell()));
        // Start piece sequence with a two shuffled arrays of piece names
        this.pieceSequence = Piece.shufflePieceNames().concat(Piece.shufflePieceNames());
        this.heldPiece = new Piece(this.pieceSequence[0], 0);
    }

    public getCell(x: number, y: number): Cell {
        return this.grid[y][x];
    }

    public getHeldPiece(): Piece {
        return this.heldPiece;
    }

}

export { World };

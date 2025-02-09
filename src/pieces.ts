export type PieceName = 'i' | 'o' | 'j' | 'l' | 't' | 's' | 'z';

class Piece {
    public pieceName: PieceName;
    public rotation: number;
    private static pieceNames: Array<PieceName> = ['i', 'o', 'j', 'l', 't', 's', 'z'];

    constructor(shapeName: PieceName, rotation: number) {
        this.pieceName = shapeName;
        this.rotation = rotation;
    }

    public rotateRight(): void {
        this.rotation = (this.rotation + 1) % this.pieceStructures[this.pieceName].length;
    }

    public rotateLeft(): void {
        // the old Javascript negative modulo workaround
        const l = this.pieceStructures[this.pieceName].length;
        this.rotation = ((this.rotation - 1) + l) % l;
    }

    public getShape(): Array<Array<string>> {
        return this.pieceStructures[this.pieceName][this.rotation];
    }

    public getBoundingHandles(): { xMin: number, xMax: number, yMin: number, yMax: number, xHandle: number, yHandle: number } {
        const shape = this.getShape();
        let xMin: number = 3;
        let yMin: number = 3;
        let xMax: number = 0;
        let yMax: number = 0;
        let xHandle: number = 0;
        let yHandle: number = 0;
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] != ' ') {
                    xMin = Math.min(xMin, col);
                    yMin = Math.min(yMin, row);
                    xMax = Math.max(xMax, col);
                    yMax = Math.max(yMax, row);
                    xHandle = col;
                    yHandle = row;
                }
            }
        }
        return { xMin, xMax, yMin, yMax, xHandle, yHandle };
    }

    // Return a shuffled array of piece names  
    public static shufflePieceNames(): Array<PieceName> {
        const sequence = <Array<PieceName>>Object.values(this.pieceNames);
        for (let i = sequence.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
        }
        return sequence;
    }

    public pieceStructures: { [key in PieceName]: Array<Array<Array<string>>> } = {
        ['i']: [
            [
                [' ', ' ', ' ', ' '],
                ['i', 'i', 'i', 'i'],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ],
            [
                [' ', 'i', ' ', ' '],
                [' ', 'i', ' ', ' '],
                [' ', 'i', ' ', ' '],
                [' ', 'i', ' ', ' '],
            ],
        ],
        ['o']: [
            [
                [' ', ' ', ' ', ' '],
                [' ', 'o', 'o', ' '],
                [' ', 'o', 'o', ' '],
                [' ', ' ', ' ', ' '],
            ]
        ],
        ['j']: [
            [
                [' ', ' ', ' ', ' '],
                ['j', 'j', 'j', ' '],
                [' ', ' ', 'j', ' '],
                [' ', ' ', ' ', ' '],
            ],
            [
                [' ', 'j', ' ', ' '],
                [' ', 'j', ' ', ' '],
                ['j', 'j', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ],
            [
                ['j', ' ', ' ', ' '],
                ['j', 'j', 'j', ' '],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ],
            [
                [' ', 'j', 'j', ' '],
                [' ', 'j', ' ', ' '],
                [' ', 'j', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ]
        ],
        ['l']: [
            [
                [' ', ' ', ' ', ' '],
                ['l', 'l', 'l', ' '],
                ['l', ' ', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ],
            [
                [' ', 'l', ' ', ' '],
                [' ', 'l', ' ', ' '],
                [' ', 'l', 'l', ' '],
                [' ', ' ', ' ', ' '],
            ],
            [
                [' ', ' ', 'l', ' '],
                ['l', 'l', 'l', ' '],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ],
            [
                ['l', 'l', ' ', ' '],
                [' ', 'l', ' ', ' '],
                [' ', 'l', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ]
        ],
        ['t']: [
            [
                [' ', ' ', ' ', ' '],
                ['t', 't', 't', ' '],
                [' ', 't', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ],
            [
                [' ', 't', ' ', ' '],
                [' ', 't', 't', ' '],
                [' ', 't', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ],
            [
                [' ', 't', ' ', ' '],
                ['t', 't', 't', ' '],
                [' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ],
            [
                [' ', 't', ' ', ' '],
                ['t', 't', ' ', ' '],
                [' ', 't', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ]
        ],
        ['s']: [
            [
                [' ', ' ', ' ', ' '],
                [' ', 's', 's', ' '],
                ['s', 's', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ],
            [
                ['s', ' ', ' ', ' '],
                ['s', 's', ' ', ' '],
                [' ', 's', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ]
        ],
        ['z']: [
            [
                [' ', ' ', ' ', ' '],
                ['z', 'z', ' ', ' '],
                [' ', 'z', 'z', ' '],
                [' ', ' ', ' ', ' '],
            ],
            [
                [' ', 'z', ' ', ' '],
                ['z', 'z', ' ', ' '],
                ['z', ' ', ' ', ' '],
                [' ', ' ', ' ', ' '],
            ]
        ]
    };
    
}


export { Piece };
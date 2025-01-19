// TODO: make this a class



enum ShapeName {
    i,
    o,
    j,
    l,
    t,
    s,
    z
}
enum Rotation {
    zero,
    one,
    two,
    three
}

class Piece {
    public shapeName: ShapeName;
    public rotation: Rotation;

    constructor(shapeName: ShapeName, rotation: Rotation) {
        this.shapeName = shapeName;
        this.rotation = rotation;
    }

    public rotateRight(): void {
        this.rotation = <Rotation>(this.rotation + 1) % pieceStructures[this.shapeName].length;
    }

    public rotateLeft(): void {
        this.rotation = (this.rotation - 1) % pieceStructures[this.shapeName].length;
    }

    public getShape(): Array<Array<string>> {
        return pieceStructures[this.shapeName][this.rotation];
    }
}

const pieceStructures: { [key in ShapeName]: Array<Array<Array<string>>> } = {
    [ShapeName.i]: [
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
    [ShapeName.o]: [
        [
            [' ', ' ', ' ', ' '],
            [' ', 'o', 'o', ' '],
            [' ', 'o', 'o', ' '],
            [' ', ' ', ' ', ' '],
        ]
    ],
    [ShapeName.j]: [
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
    [ShapeName.l]: [
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
    [ShapeName.t]: [
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
    [ShapeName.s]: [
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
    [ShapeName.z]: [
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

export { Piece, ShapeName, Rotation };
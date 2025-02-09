import { signal, computed, ReadonlySignal } from "@preact/signals-core";
import { Piece } from "./pieces";
import { Flavour, Flavours } from "./flavour";

// SignalBox is a singleton that contains all the signals for the game.
// Signals are primarily used to record info to be shown in the UIController.
export class SignalBox {
    public static heldPiece = signal<Piece | null>(null);
    public static heldPieceFlavour = signal<Flavour>(Flavours.CORRIDOR);
    public static heldPiecePosition = signal<{ x: number, y: number }>({ x: 0, y: 0 });
}

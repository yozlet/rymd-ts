import { signal, computed, ReadonlySignal } from "@preact/signals-core";
import { Piece } from "./pieces";
import { Flavour, Flavours } from "./flavour";

export class SignalBox {
    public static heldPiece = signal<Piece | null>(null);
    public static heldPieceFlavour: ReadonlySignal<Flavour> = computed(() => SignalBox.heldPiece.value?.flavour ?? Flavours.CORRIDOR);
    public static heldPiecePosition = signal<{ x: number, y: number }>({ x: 0, y: 0 });
}

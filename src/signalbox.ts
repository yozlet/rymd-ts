import { signal, computed, ReadonlySignal } from "@preact/signals-core";
import { Piece } from "./pieces";
import { Flavour, Flavours } from "./flavour";

export class SignalBox {
    public heldPiece = signal<Piece | null>(null);
    public heldPieceFlavour: ReadonlySignal<Flavour> = computed(() => this.heldPiece.value?.flavour ?? Flavours.CORRIDOR);
    public heldPiecePosition = signal<{ x: number, y: number }>({ x: 0, y: 0 });
}

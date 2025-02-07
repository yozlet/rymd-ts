import { World } from './world';
import { Game } from './game';
import { Renderer } from './renderer';
import { Flavour } from './flavour';

class MessageRouter {
    private world: World;
    private game: Game;
    private renderer: Renderer | null = null;

    constructor(world: World, game: Game) {
        this.world = world;
        this.game = game;
    }

    public setRenderer(renderer: Renderer): void {
        this.renderer = renderer;
    }

    public setFlavour(flavour: Flavour): void {
        this.world.setPieceFlavour(flavour);
        this.renderer!.setFlavour(flavour);
    }
}

export { MessageRouter };
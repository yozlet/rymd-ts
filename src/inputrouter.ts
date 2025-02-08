import { World } from './world';
import { Game } from './game';
import { Flavour } from './flavour';

class InputRouter {
    private static world: World;
    private static game: Game;

    public static setWorld(world: World): void {
        InputRouter.world = world;
    }

    public static setGame(game: Game): void {
        InputRouter.game = game;
    }

    public static setFlavour(flavour: Flavour): void {
        InputRouter.world.setPieceFlavour(flavour);
    }
}

export { InputRouter as InputRouter };
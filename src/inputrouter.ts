import World from './world';
import Game from './game';
import Flavour from './flavour';
import FrameInput from './frameinput';

class InputRouter {
    private static world: World;
    private static game: Game;
    public static currentInput = new FrameInput();
    private static nextInput = new FrameInput();

    public static setWorld(world: World): void {
        InputRouter.world = world;
    }

    public static setGame(game: Game): void {
        InputRouter.game = game;
    }

    public static registerMouseMove(mouseX: number, mouseY: number, mouseGridX: number, mouseGridY: number): void {
        InputRouter.nextInput.mouseX = mouseX;
        InputRouter.nextInput.mouseY = mouseY;
        InputRouter.nextInput.mouseGridX = mouseGridX;
        InputRouter.nextInput.mouseGridY = mouseGridY;
    }

    public static registerMouseOver(mouseX: number, mouseY: number, mouseGridX: number, mouseGridY: number): void {
        InputRouter.nextInput.mouseX = mouseX;
        InputRouter.nextInput.mouseY = mouseY;
        InputRouter.nextInput.mouseGridX = mouseGridX;
        InputRouter.nextInput.mouseGridY = mouseGridY;
        InputRouter.nextInput.mouseOverGrid = true;
    }

    public static registerMouseOut(): void {
        InputRouter.nextInput.mouseOverGrid = false;
        InputRouter.nextInput.mouseX = null;
        InputRouter.nextInput.mouseY = null;
        InputRouter.nextInput.mouseGridX = null;
        InputRouter.nextInput.mouseGridY = null;
    }   

    public static registerClick(mouseX: number, mouseY: number, mouseGridX: number, mouseGridY: number): void {
        InputRouter.nextInput.click = true;
        InputRouter.nextInput.mouseX = mouseX;  
        InputRouter.nextInput.mouseY = mouseY;
        InputRouter.nextInput.mouseGridX = mouseGridX;
        InputRouter.nextInput.mouseGridY = mouseGridY;
    }

    public static registerKeyDown(key: string): void {
        InputRouter.nextInput.keysPressed.add(key);
    }

    public static registerKeyUp(key: string): void {
        InputRouter.nextInput.keysPressed.delete(key);
        InputRouter.nextInput.keysDone.delete(key);
    }

    public static handleInputForFrame(): void {
        InputRouter.currentInput.copyFrom(InputRouter.nextInput);
        InputRouter.handleInput(InputRouter.currentInput);
    }

    public static handleInput(input: FrameInput): void {
        if (input.keysPressed.has('z') && !input.keysDone.has('z')) {
            this.world.getHeldPiece().rotateLeft();
            this.nextInput.keysDone.add('z');
        }
        if (input.keysPressed.has('x') && !input.keysDone.has('x')) {
            this.world.getHeldPiece().rotateRight();
            this.nextInput.keysDone.add('x');
        }
        if (input.click) {
            // translate mouse position to grid position
            const result: boolean = InputRouter.world.placeHeldPiece(input.mouseGridX!, input.mouseGridY!);
            InputRouter.nextInput.click = false;
        }
    }

    public static setFlavour(flavour: Flavour): void {
        InputRouter.world.setPieceFlavour(flavour);
    }
}

export default InputRouter;
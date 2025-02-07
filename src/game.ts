import { FrameInput } from './frameinput';
import { World } from './world';
import { Flavours } from './flavour';
import { Renderer } from './renderer';
import { MessageRouter } from './messagerouter';

// Class for the game
class Game {
    private lastFrameTime: number = 0;
    private isRunning: boolean = false;
    
    // Grid size in blocks
    private readonly GRID_HEIGHT = 15;
    private readonly GRID_WIDTH = 15;
    private world: World;
    private defaultFlavour = Flavours.CORRIDOR;


    private currentInput = new FrameInput();
    private nextInput = new FrameInput();
    private renderer: Renderer;
    private messageRouter: MessageRouter;
    
    constructor() {
      this.world = new World(this.GRID_HEIGHT, this.GRID_WIDTH);
      this.messageRouter = new MessageRouter(this.world, this);
      this.renderer = new Renderer('#gamecanvas', this.messageRouter);
      this.messageRouter.setRenderer(this.renderer);

      this.setupCanvasListeners();
      this.renderer.setFlavour(Flavours.CORRIDOR);
    }
  
    private setupCanvasListeners(): void {
      const canvas = this.renderer.getCanvas();
      canvas.addEventListener('mousemove', (event: MouseEvent) => {
        // mouse position relative to canvas
        this.nextInput.mouseX = event.offsetX;
        this.nextInput.mouseY = event.offsetY;  
      });
      this.renderer.getCanvas().addEventListener('mouseover', (_: MouseEvent) => {
        this.nextInput.mouseOverGrid = true;
      });
      this.renderer.getCanvas().addEventListener('mouseout', (_: MouseEvent) => {
        this.nextInput.mouseOverGrid = false;
      });
      this.renderer.getCanvas().addEventListener('click', (_: MouseEvent) => {
        this.nextInput.click = true;
      });
      document.addEventListener('keydown', (event: KeyboardEvent) => {
        this.nextInput.keysPressed.add(event.key);
      });
      document.addEventListener('keyup', (event: KeyboardEvent) => {
        this.nextInput.keysPressed.delete(event.key);
        this.nextInput.keysDone.delete(event.key);
      });
    }
  
    public start(): void {
      if (!this.isRunning) {
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
      }
    }
  
    // Primary game loop. In the classic love2d style, 
    // it calls update() and then draw() once per frame
    private gameLoop(currentTime: number): void {
      if (!this.isRunning) return;
  
      const deltaTime = currentTime - this.lastFrameTime;
      this.lastFrameTime = currentTime;
  
      // TODO: work out if this is slower than moving and 
      // recreating the Input object
      this.currentInput.copyFrom(this.nextInput);
      // TODO: does nextInput need to be reset?
      
      this.update(deltaTime);
      this.renderer.draw(this.world, deltaTime, this.currentInput);
      requestAnimationFrame(this.gameLoop.bind(this));
    }

    // Read inputs and perform associated updates, then do
    // automated updates
    public update(_deltaTime: number): void {
      // Handle key presses
      this.handleInput(this.currentInput);
    } 
    
    private handleInput(input: FrameInput): void {
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
        const mouseX = Math.floor(input.mouseX / this.renderer.BLOCK_SIZE);
        const mouseY = Math.floor(input.mouseY / this.renderer.BLOCK_SIZE);
        const placedOK: boolean = this.world.placeHeldPiece(mouseX, mouseY);
        if (placedOK) {
          this.renderer.setFlavour(this.defaultFlavour);
        }
        this.nextInput.click = false;
      }
    }
  }

  
  export { Game };
import { World } from './world';
import { Renderer } from './renderer';
import { InputRouter } from './inputrouter';
// Class for the game
class Game {
    private lastFrameTime: number = 0;
    private isRunning: boolean = false;
    
    // Grid size in blocks
    private readonly GRID_HEIGHT = 15;
    private readonly GRID_WIDTH = 15;
    private world: World;

    private renderer: Renderer;

    constructor() {
      this.world = new World(this.GRID_HEIGHT, this.GRID_WIDTH);
      InputRouter.setGame(this);
      InputRouter.setWorld(this.world);
      this.renderer = new Renderer('uicontainer', 'gamecanvas');
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
        
      this.update(deltaTime);
      this.renderer.draw(this.world, InputRouter.currentInput);
      requestAnimationFrame(this.gameLoop.bind(this));
    }

    // Read inputs and perform associated updates, then do
    // automated updates
    public update(_deltaTime: number): void {
      // Handle key presses
      InputRouter.handleInputForFrame();
    } 
  }
  
  export { Game };
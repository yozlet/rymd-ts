import Renderer from './renderer';
import InputRouter from './inputrouter';
import HotModuleReloadSetup from './hotmodulereloadsetup';

import { HMREventHandler } from './hotmodulereloadsetup';

if (import.meta.hot) {
  import.meta.hot.accept(HMREventHandler)
}

// Class for the game
class Game {
    private lastFrameTime: number = 0;
    private isRunning: boolean = false;
    private hmr: HotModuleReloadSetup = new HotModuleReloadSetup();

    // Grid size in blocks
    private readonly GRID_HEIGHT = 15;
    private readonly GRID_WIDTH = 15;

    private renderer: Renderer;

    constructor() {
      // Setup HMR
      InputRouter.setGame(this);
      this.renderer = new Renderer('uicontainer', 'gamecanvas');
    }
  
    public async start(): Promise<void> {

      // Load a module that will be updated dynamically
      this.hmr.import(await import('./world.js'), this.GRID_HEIGHT, this.GRID_WIDTH);
      // Now we access it through hmr.instances['Draw']
      // which will point to the new module when it gets swapped

      InputRouter.setWorld(this.hmr.instances['World']);

      if (!this.isRunning) {
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
      }
    }
  
    // Primary game loop. In the classic love2d style, 
    // it calls update() and then draw() once per frame.
    // currentTime is the current time in milliseconds.
    private gameLoop(currentTime: number): void {
      if (!this.isRunning) return;
  
      const deltaTime = currentTime - this.lastFrameTime;
      this.lastFrameTime = currentTime;
        
      this.update(deltaTime);
      this.renderer.draw(this.hmr.instances['World'], InputRouter.currentInput);
      requestAnimationFrame(this.gameLoop.bind(this));
    }

    // Read inputs and perform associated updates, then do
    // automated updates.
    // deltaTime is the time since the last frame in milliseconds.
    public update(_deltaTime: number): void {
      // Handle key presses
      InputRouter.handleInputForFrame();
      this.hmr.instances['World'].update(_deltaTime);
    }
  }

export default Game;
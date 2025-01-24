import { FrameInput } from './frameinput';
import { World } from './world';
import { FlavourColour } from './flavour';
// Class for the game
class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private lastFrameTime: number = 0;
    private isRunning: boolean = false;
    
    // Grid size in blocks
    private readonly GRID_HEIGHT = 15;
    private readonly GRID_WIDTH = 15;
    private world: World;

    private readonly BLOCK_SIZE = 20;
    private currentInput = new FrameInput();
    private nextInput = new FrameInput();
  
    constructor() {
      this.canvas = document.querySelector<HTMLCanvasElement>('#gamecanvas')!;
      this.ctx = this.canvas.getContext('2d')!;
      this.setupCanvasListeners();

      this.world = new World(this.GRID_HEIGHT, this.GRID_WIDTH);
  
    }
  
    private setupCanvasListeners(): void {
      this.canvas.addEventListener('mousemove', (event) => {
        // mouse position relative to canvas
        this.nextInput.mouseX = event.offsetX;
        this.nextInput.mouseY = event.offsetY;  
      });
      this.canvas.addEventListener('mouseover', (_) => {
        this.nextInput.mouseOverGrid = true;
      });
      this.canvas.addEventListener('mouseout', (_) => {
        this.nextInput.mouseOverGrid = false;
      });
      this.canvas.addEventListener('click', (_) => {
        this.nextInput.click = true;
      });
      document.addEventListener('keydown', (event) => {
        this.nextInput.keysPressed.add(event.key);
      });
      document.addEventListener('keyup', (event) => {
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
  
    private gameLoop(currentTime: number): void {
      if (!this.isRunning) return;
  
      const deltaTime = currentTime - this.lastFrameTime;
      this.lastFrameTime = currentTime;
  
      // TODO: work out if this is slower than moving and 
      // recreating the Input object
      this.currentInput.copyFrom(this.nextInput);
      // TODO: does nextInput need to be reset?
      
      this.update(deltaTime);
      this.draw(deltaTime);
      requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    public draw(_deltaTime: number): void {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawGrid();
  
      // translate mouse position to grid position
      const mouseX = Math.floor(this.currentInput.mouseX / this.BLOCK_SIZE);
      const mouseY = Math.floor(this.currentInput.mouseY / this.BLOCK_SIZE);
      // draw block outline under the mouse
      this.drawHeldPiece(mouseX, mouseY);
      // this.drawBlockOutline(0, 0);
    }
  
    private drawGrid(): void {
      // change color to dark grey
      this.ctx.fillStyle = '#333';
      for (let row = 0; row < this.GRID_HEIGHT; row++) {
        for (let col = 0; col < this.GRID_WIDTH; col++) {
            const cell = this.world.getCell(col, row);
            if (cell.room) {
                this.ctx.fillStyle = FlavourColour[cell.room.flavour];
            } else {
                this.ctx.fillStyle = '#333';
            }
            this.ctx.fillRect((col * this.BLOCK_SIZE) + 1, (row * this.BLOCK_SIZE) + 1, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
        }
      }
    }
  
    // Draw the outline of the held piece within the bounds of the grid
    private drawHeldPiece(xMouse: number, yMouse: number): void {
      this.ctx.strokeStyle = '#f00';

      const cellCoords: Array<[number, number]> = this.world.getHeldPieceCellCoords(xMouse, yMouse);
      for (const [x, y] of cellCoords) {
        this.ctx.strokeRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
      }
    }

    private drawBlockOutline(x: number, y: number): void {
      this.ctx.strokeStyle = '#0f0';
      this.ctx.strokeRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
    }
    
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
      }``
      if (input.click) {
        this.world.placeHeldPiece();
        this.nextInput.click = false;
      }
    }
  }

  
  export { Game };
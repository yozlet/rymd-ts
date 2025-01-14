import './style.css'


// Class to hold input state for a frame
class FrameInput {
  public mouseX: number = 0;
  public mouseY: number = 0;
  public mouseOverGrid: boolean = false;
  public mouseDown: boolean = false;
  public keysPressed: Set<string> = new Set();

  // Copy input state from another Input object
  public copyFrom(other: FrameInput): void {
    this.mouseX = other.mouseX;
    this.mouseY = other.mouseY; 
    this.mouseOverGrid = other.mouseOverGrid;
    this.mouseDown = other.mouseDown;
    this.keysPressed = new Set(other.keysPressed);
  }
}


// Class for the game
class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastFrameTime: number = 0;
  private isRunning: boolean = false;
  
  // Grid size in blocks
  private readonly GRID_HEIGHT = 15;
  private readonly GRID_WIDTH = 15;
  private readonly BLOCK_SIZE = 20;
  private currentInput = new FrameInput();
  private nextInput = new FrameInput();

  constructor() {
    this.canvas = document.querySelector<HTMLCanvasElement>('#gamecanvas')!;
    this.ctx = this.canvas.getContext('2d')!;
    this.setupCanvasListeners();

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
    this.canvas.addEventListener('mousedown', (_) => {
      this.nextInput.mouseDown = true;
    });
    this.canvas.addEventListener('mouseup', (_) => {
      this.nextInput.mouseDown = false;
    });
    this.canvas.addEventListener('keydown', (event) => {
      this.nextInput.keysPressed.add(event.key);
    });
    this.canvas.addEventListener('keyup', (event) => {
      this.nextInput.keysPressed.delete(event.key);
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

  public update(_deltaTime: number): void {
    // TODO: implement update logic
  } 

  public draw(_deltaTime: number): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawUndergrid();

    // translate mouse position to grid position
    const mouseX = Math.floor(this.currentInput.mouseX / this.BLOCK_SIZE);
    const mouseY = Math.floor(this.currentInput.mouseY / this.BLOCK_SIZE);
    // draw block outline under the mouse
    this.drawBlockOutline(mouseX, mouseY);
  }

  private drawUndergrid(): void {
    // change color to dark grey
    this.ctx.fillStyle = '#333';
    for (let row = 0; row < this.GRID_HEIGHT; row++) {
      for (let col = 0; col < this.GRID_WIDTH; col++) {
        this.ctx.fillRect((col * this.BLOCK_SIZE) + 1, (row * this.BLOCK_SIZE) + 1, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
      }
    }
  }

  private drawBlockOutline(x: number, y: number): void {
    this.ctx.strokeStyle = '#f00';
    this.ctx.strokeRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
  }

}


const game = new Game();
game.start();
import { FrameInput } from './frameinput';
import { World } from './world';
import { UIController } from './ui-controller';

export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public readonly BLOCK_SIZE = 20;
    private container: HTMLElement;
    private ui: UIController;

    constructor(uicontainerId: string, canvasId: string) {
        this.container = document.getElementById(uicontainerId) as HTMLElement;
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        // this.setupFlavoursUI(messageRouter);
        this.ui = new UIController(this.container);
        this.ui.render();
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public draw(world: World, deltaTime: number, currentInput: FrameInput): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid(world);
        
        const mouseX = Math.floor(currentInput.mouseX / this.BLOCK_SIZE);
        const mouseY = Math.floor(currentInput.mouseY / this.BLOCK_SIZE);
        this.drawHeldPiece(world, mouseX, mouseY);
    }

    private drawGrid(world: World): void {
        // change color to dark grey
        this.ctx.fillStyle = '#333';
        for (let row = 0; row < world.gridHeight; row++) {
            for (let col = 0; col < world.gridWidth; col++) {
                const cell = world.getCell(col, row);
                if (cell.room) {
                    this.ctx.fillStyle = cell.room.flavour.colour;
                } else {
                    this.ctx.fillStyle = '#333';
                }
                this.ctx.fillRect((col * this.BLOCK_SIZE) + 1, (row * this.BLOCK_SIZE) + 1, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
            }
        }
    }
    
      // Draw the outline of the held piece within the bounds of the grid
    private drawHeldPiece(world: World, xMouse: number, yMouse: number): void {
        // Set stroke color to red or green depending on if the piece can be placed
        this.ctx.strokeStyle = world.pieceCanBePlacedAt(xMouse, yMouse) ? '#0f0' : '#f00';

        const cellCoords: Array<[number, number]> = world.getHeldPieceCellCoords(xMouse, yMouse);
        for (const [x, y] of cellCoords) {
            this.ctx.strokeRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
        }
    }

    private drawBlockOutline(world: World, x: number, y: number): void {
        this.ctx.strokeStyle = '#0f0';
        this.ctx.strokeRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
    }
}
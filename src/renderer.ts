import { FrameInput } from './frameinput';
import { World } from './world';
import { UIController } from './ui-controller';
import { SignalBox } from './signalbox';
import { InputRouter } from './inputrouter';

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
        this.setupCanvasListeners(this.canvas);
        this.ui = new UIController(this.container);
        this.ui.render();
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public setupCanvasListeners(canvas: HTMLCanvasElement): void {
        canvas.addEventListener('mousemove', (event: MouseEvent) => {
            const {mouseGridX, mouseGridY} = this.getMouseGridPosition(event.offsetX, event.offsetY);
            InputRouter.registerMouseMove(event.offsetX, event.offsetY, mouseGridX, mouseGridY);
        });
        canvas.addEventListener('mouseover', (event: MouseEvent) => {
            const {mouseGridX, mouseGridY} = this.getMouseGridPosition(event.offsetX, event.offsetY);
            InputRouter.registerMouseOver(event.offsetX, event.offsetY, mouseGridX, mouseGridY);
        });
        canvas.addEventListener('mouseout', (_: MouseEvent) => {
            InputRouter.registerMouseOut();
        });
        canvas.addEventListener('click', (event: MouseEvent) => {
            const {mouseGridX, mouseGridY} = this.getMouseGridPosition(event.offsetX, event.offsetY);
            InputRouter.registerClick(event.offsetX, event.offsetY, mouseGridX, mouseGridY);
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            InputRouter.registerKeyDown(event.key);
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            InputRouter.registerKeyUp(event.key);
        });
    }   

    // Get the mouse position in grid blocks on the canvas
    public getMouseGridPosition(mousePixelX: number, mousePixelY: number): { mouseGridX: number, mouseGridY: number } {
        // Canvas clientHeight and clientWidth are the size in screen pixels.
        // Need to adjust the pixel size ratio to match the block size. 
        const pixelXRatio = this.canvas.clientWidth / this.canvas.width;
        const pixelYRatio = this.canvas.clientHeight / this.canvas.height;
        const mouseGridX = Math.floor((mousePixelX / pixelXRatio) / this.BLOCK_SIZE);
        const mouseGridY = Math.floor((mousePixelY / pixelYRatio) / this.BLOCK_SIZE);
        return { mouseGridX: mouseGridX, mouseGridY: mouseGridY };
    }

    // This is the primary draw function, called once per frame.
    // It draws the state of the world, and the held piece.
    // (It does NOT update the HTML UI - UIController does that in 
    // response to signals.)
    public draw(world: World, currentInput: FrameInput): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid(world);
        this.drawMinions(world);
        
        SignalBox.heldPiecePosition.value = { x: currentInput.mouseGridX, y: currentInput.mouseGridY };
        SignalBox.mousePixels.value = { x: currentInput.mouseX, y: currentInput.mouseY };
        if (currentInput.mouseGridX !== null && currentInput.mouseGridY !== null) {
            this.drawHeldPiece(world, currentInput.mouseGridX, currentInput.mouseGridY);
        }
    }

    private drawGrid(world: World): void {
        // change color to dark grey
        this.ctx.fillStyle = '#0E1117';
        for (let row = 0; row < world.gridHeight; row++) {
            for (let col = 0; col < world.gridWidth; col++) {
                const cell = world.getCell(col, row);
                if (cell.room) {
                    this.ctx.fillStyle = cell.room.flavour.colour;
                } else {
                    this.ctx.fillStyle = '#0E1117';
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

    // New method: Draw each minion as a small white rectangle.
    private drawMinions(world: World): void {
        this.ctx.fillStyle = "#fff"; // white color for minions
        for (const minion of world.minions) {
            // Draw a smaller rectangle inside the cell (with a small margin)
            this.ctx.fillRect(
                minion.currentCell.x * this.BLOCK_SIZE + 2, 
                minion.currentCell.y * this.BLOCK_SIZE + 3, 
                this.BLOCK_SIZE - 8, 
                this.BLOCK_SIZE - 8
            );
        }
    }

    private drawBlockOutline(x: number, y: number): void {
        this.ctx.strokeStyle = '#0f0';
        this.ctx.strokeRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
    }
}
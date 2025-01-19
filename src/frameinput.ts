// Class to hold input state for a frame
class FrameInput {
    public mouseX: number = 0;
    public mouseY: number = 0;
    public mouseOverGrid: boolean = false;
    public mouseDown: boolean = false;
    public keysPressed: Set<string> = new Set();
    public keysDone: Set<string> = new Set();
  
    // Copy input state from another Input object
    public copyFrom(other: FrameInput): void {
      this.mouseX = other.mouseX;
      this.mouseY = other.mouseY; 
      this.mouseOverGrid = other.mouseOverGrid;
      this.mouseDown = other.mouseDown;
      this.keysPressed = new Set(other.keysPressed);
      this.keysDone = new Set(other.keysDone);
    }
  }
  
  export { FrameInput };
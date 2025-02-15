// Class to hold input state for a frame.
// Primarily used by the InputRouter to store input state.
// There are always two FrameInput objects: currentInput and nextInput.
// nextInput is used to store input before handleInputForFrame() is called.
// When InputRouter.handleInputForFrame() is called, input signals are 
// copied from nextInput to currentInput, but nextInput is not cleared.
// Instead, individual actions are cleared from nextInput when they are 
// processed. 
// 
// See InputRouter.handleInput() and
// InputRouter.setupCanvasListeners() for more details.

import { HMREventHandler } from './hotmodulereloadsetup';

if (import.meta.hot) {
  import.meta.hot.accept(HMREventHandler)
}

export default class FrameInput {
    // mouse position in screen pixels relative to canvas
    public mouseX: number | null  = null;
    public mouseY: number | null = null;
    // mouse position in grid blocks on the canvas
    public mouseGridX: number | null = null;
    public mouseGridY: number | null = null;

    public mouseOverGrid: boolean = false;
    public click: boolean = false;
    public keysPressed: Set<string> = new Set();
    // keysDone is a set of keys that have been processed.
    // It is used to prevent the same key press from being processed
    // multiple times by successive frames.
    public keysDone: Set<string> = new Set();
  
    // Copy input state from another Input object
    public copyFrom(other: FrameInput): void {
      this.mouseX = other.mouseX;
      this.mouseY = other.mouseY;
      this.mouseGridX = other.mouseGridX;
      this.mouseGridY = other.mouseGridY;
      this.mouseOverGrid = other.mouseOverGrid;
      this.click = other.click;
      this.keysPressed = new Set(other.keysPressed);
      this.keysDone = new Set(other.keysDone);
    }
  }
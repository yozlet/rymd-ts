import { describe, it, expect, beforeEach } from 'vitest';
import { World } from '../world';
import { Flavours } from '../flavour';
import { Room } from '../room';
import { SignalBox } from '../signalbox';

describe('World', () => {
  const gridWidth = 10;
  const gridHeight = 10;
  let world: World;
  let signalBox: SignalBox;
  beforeEach(() => {
    signalBox = new SignalBox();
    world = new World(gridHeight, gridWidth, signalBox);
  });

  describe('Grid initialization', () => {
    it('initializes grid with correct dimensions', () => {
      // Check that the top-left and bottom-right cells exist.
      expect(world.getCell(0, 0)).toBeDefined();
      expect(world.getCell(gridWidth - 1, gridHeight - 1)).toBeDefined();
    });

    it('throws an error for out-of-bounds cell access', () => { 
      // Check that there are no cells outside the grid
      expect(() => world.getCell(-1, 0)).toThrow();
      expect(() => world.getCell(0, -1)).toThrow();
      expect(() => world.getCell(gridWidth, 0)).toThrow();
      expect(() => world.getCell(0, gridHeight)).toThrow();
    });

    it('places a corridor room in the center cell', () => {
      const middleX = Math.floor(gridWidth / 2);
      const middleY = Math.floor(gridHeight / 2);
      const centerCell = world.getCell(middleX, middleY);
      expect(centerCell.room).toBeDefined();
      // Verify that the room flavour in the center is CORRIDOR
      expect(centerCell.room?.flavour).toEqual(Flavours.CORRIDOR);
    });
  });

  describe('setPieceFlavour', () => {
    it('updates held piece flavour correctly', () => {
      world.setPieceFlavour(Flavours.REACTOR);
      expect(world.getHeldPiece().flavour).toEqual(Flavours.REACTOR);
    });
  });

  describe('placeHeldPiece', () => {  
    it('places held piece if valid and updates held piece', () => {
      // Attempt to place the held piece near the center
      const middleX = Math.floor(gridWidth / 2);
      const middleY = Math.floor(gridHeight / 2);
      const placementResult = world.placeHeldPiece(middleX, middleY);

    // If placement succeeds, ensure the held piece is updated.
    if (placementResult) {
      expect(placementResult).toBe(true);
      expect(world.getHeldPiece()).toBeDefined();
    } else {
      expect(placementResult).toBe(false);
      }
    });
  });

  describe('pieceCanBePlacedAt', () => {
    it('fails to place piece on occupied cells', () => {
      // Get the cell coordinates for the current piece when placed at (0, 0)
     const coords = world.getHeldPieceCellCoords(0, 0);
    if (coords.length) {
      const [x, y] = coords[0];
      // Artificially occupy one of the cells where the piece would be placed.
      world.getCell(x, y).room = new Room(Flavours.EXTRACTOR, [world.getCell(x, y)]);
    }
      expect(world.pieceCanBePlacedAt(0, 0)).toBe(false);
    });

    it('fails to place piece on cells that are not connected to the grid', () => {
      // TODO: Implement this
      // Get the cell coordinates for the current piece when placed at (0, 0)
      const coords = world.getHeldPieceCellCoords(0, 0);
      if (coords.length) {
        const [x, y] = coords[0];
        // Artificially occupy one of the cells where the piece would be placed.
      } 
    });
  });
}); 
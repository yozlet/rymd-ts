import { describe, test, expect } from 'vitest';
import { Flavour, Flavours, FlavourOrder } from '../flavour';

describe('Flavours', () => {
  test('should have correct flavour constants', () => {
    expect(Flavours.CORRIDOR).toEqual({ name: 'corridor', colour: 'darkkhaki' });
    expect(Flavours.EXTRACTOR).toEqual({ name: 'extractor', colour: 'orchid' });
    expect(Flavours.REACTOR).toEqual({ name: 'reactor', colour: 'cyan' });
  });

  test('FlavourOrder should maintain correct order', () => {
    expect(FlavourOrder).toEqual([
      expect.objectContaining({ name: 'corridor' }),
      expect.objectContaining({ name: 'extractor' }),
      expect.objectContaining({ name: 'reactor' })
    ]);
  });

  test('Flavour type should have required properties', () => {
    const testFlavour: Flavour = { name: 'test', colour: 'red' };
    expect(testFlavour).toHaveProperty('name');
    expect(testFlavour).toHaveProperty('colour');
  });
}); 
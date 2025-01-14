// Flavours are the different types of rooms.
// This is a simple enum of flavour names and colours for now.
enum Flavour {
    CORRIDOR = "corridor",
    EXTRACTOR = "extractor",
    REACTOR = "reactor"
}

const FlavourColour: { [key in Flavour]: string } = {
    [Flavour.CORRIDOR]: "#663",
    [Flavour.EXTRACTOR]: "#A3A",
    [Flavour.REACTOR]: "#3AA",
  };
  
export { Flavour, FlavourColour };
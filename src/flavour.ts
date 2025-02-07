// Flavours are the different types of rooms.

export type Flavour = {
  name: string;
  colour: string;
}

const Flavours = {
  CORRIDOR: {name: "corridor", colour: "darkkhaki"},
  EXTRACTOR: {name: "extractor", colour: "orchid"},
  REACTOR: {name: "reactor", colour: "cyan"},
}

const FlavourOrder: Array<Flavour> = [
  Flavours.CORRIDOR,
  Flavours.EXTRACTOR,
  Flavours.REACTOR,
]

export { Flavours, FlavourOrder };
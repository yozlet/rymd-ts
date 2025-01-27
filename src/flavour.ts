// Flavours are the different types of rooms.

export type Flavour = {
  name: string;
  colour: string;
}

const FlavourOrder: Array<Flavour> = [
  {name: "corridor", colour: "darkkhaki"},
  {name: "extractor", colour: "orchid"},
  {name: "reactor", colour: "cyan"},
]

const Flavours = {
  CORRIDOR: {name: "corridor", colour: "darkkhaki"},
  EXTRACTOR: {name: "extractor", colour: "orchid"},
  REACTOR: {name: "reactor", colour: "cyan"},
}

export { Flavours, FlavourOrder };
// Flavours are the different types of rooms.
import { HMREventHandler } from './hotmodulereloadsetup';

if (import.meta.hot) {
  import.meta.hot.accept(HMREventHandler)
}


type Flavour = {
  name: string;
  colour: string;
}

const Flavours = {
  CORRIDOR: {name: "corridor", colour: "#81655B"},
  EXTRACTOR: {name: "extractor", colour: "#855383"},
  REACTOR: {name: "reactor", colour: "#4EA9A0"},
  GARDEN: {name: "garden", colour: "#7CA823"},
  KITCHEN: {name: "kitchen", colour: "#E0A11C"},
  QUARTERS: {name: "quarters", colour: "#D36B25"},
  SECURITY: {name: "security", colour: "#2C7684"},
  STORAGE: {name: "storage", colour: "#434242"},
}

const FlavourOrder: Array<Flavour> = [
  Flavours.CORRIDOR,
  Flavours.EXTRACTOR,
  Flavours.REACTOR,
  Flavours.GARDEN,
  Flavours.KITCHEN,
  Flavours.SECURITY,
]

export { Flavours, FlavourOrder };

export default Flavour;
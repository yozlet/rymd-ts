import { render, JSX } from 'preact';
import { Flavours } from './flavour';
import SignalBox from './signalbox';
import InputRouter from './inputrouter';

import { HMREventHandler } from './hotmodulereloadsetup';

if (import.meta.hot) {
  import.meta.hot.accept(HMREventHandler)
}

export default class UIController {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    render() {
        render(<UIComponent/>, this.container);
    }
}

function UIComponent(): JSX.Element {
    return (
        <div id="ui-container">
            <FlavourList/>
        </div>
    );
}

function FlavourList(): JSX.Element {
    return (
        <div id="flavours-container">
            <div className="flavours-list" id="flavours">
                {Object.values(Flavours).map((flavour) => (
                    <button
                        key={flavour.name}
                        className={`flavour ${SignalBox.heldPieceFlavour.value === flavour ? 'active' : ''}`}
                        onClick={() => InputRouter.setFlavour(flavour)}
                        style={{ color: flavour.colour }}
                >
                    {flavour.name}
                </button>
            ))}
            </div>
        </div>
    );
}
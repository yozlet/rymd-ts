import { render, JSX } from 'preact';
import { Flavours } from './flavour';
import { SignalBox } from './signalbox';
import { InputRouter } from './inputrouter';

export class UIController {
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
            <h3>Mouse: {SignalBox.heldPiecePosition.value.x}, {SignalBox.heldPiecePosition.value.y}</h3>
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
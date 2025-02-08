import { render, Component, ComponentChildren } from 'preact';
import { Flavours } from './flavour';
import { SignalBox } from './signalbox';
import { InputRouter } from './inputrouter';

interface UIState {
}

interface UIProps {
}

export class UIController {
    private container: HTMLElement;
    
    constructor(container: HTMLElement) {
        this.container = container;
    }

    render() {
        render(<UIComponent/>, this.container);
    }
}

export class UIComponent extends Component<UIProps, UIState> {
    //private statsContainer!: HTMLElement;
    //private debugInfo!: HTMLElement;

    constructor(props: UIProps) {
        super(props);
    }   

    render(): ComponentChildren {
        return (
            <div id="ui-container">
                {/* <div id="stats" ref={e => this.statsContainer = e!}></div> */}
                <div id="flavors-container">
                    <h3>Flavors</h3>
                    <div className="flavors-list">
                        {Object.values(Flavours).map((flavour) => (
                            <button
                                key={flavour.name}
                                className={`flavor-btn ${SignalBox.heldPieceFlavour.value === flavour ? 'active' : ''}`}
                                onClick={() => InputRouter.setFlavour(flavour)}
                                style={{ backgroundColor: flavour.colour }}
                            >
                                {flavour.name}
                            </button>
                        ))}
                    </div>
                </div>
                {/* <div id="debug-info" ref={e => this.debugInfo = e!}></div> */}
            </div>
        );
    }   

    // updateStats(fps: number): void {
    //     this.statsContainer.innerHTML = `FPS: ${fps.toFixed(1)}`;
    // }

    // updateDebugInfo(info: string): void {
    //     this.debugInfo.textContent = info;
    // }
} 
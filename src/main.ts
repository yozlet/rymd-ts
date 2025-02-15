import './style.css';
import Game from './game';

const game = new Game();

// Keep game object accessible from browser devtools
declare global {
  interface Window {
    game: Game;
  }
}
window.game = game;

game.start();

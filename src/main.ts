import './style.css';
import { Game } from './game';

const game = new Game();
window.game = game;
game.start();

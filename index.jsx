/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import './popup.css';
import App from './src/App';

const root = document.getElementById('popup');

if (!(root instanceof HTMLElement)) {
  throw new Error('Popup element not found!');
}

render(() => <App />, root);

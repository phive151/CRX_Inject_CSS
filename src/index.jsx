/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import './popup.css'
import Popup from './Popup'

const root = document.getElementById('popup')
if (root) {
  render(() => <Popup />, root)
}

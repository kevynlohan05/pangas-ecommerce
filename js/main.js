import state from './state.js';
import { initCatalog } from './catalog.js';
import { renderSelected, initSelected } from './selected.js';
import { renderCart, initCart } from './cart.js';
import './checkout.js'; 


document.addEventListener('DOMContentLoaded', () => {
  initCatalog();

  initSelected();
  renderSelected();

  initCart();
  renderCart();
});

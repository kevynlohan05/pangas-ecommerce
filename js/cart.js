import state from "./state.js";
import { fmtBRL } from "./utils.js";

const cartContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("subtotal");
const cartEmpty = document.getElementById("cartEmpty");

export function renderCart() {
  cartContainer.innerHTML = "";

  if (!state.cart.items.length) {
    cartEmpty.style.display = "block";
    cartTotal.textContent = fmtBRL(0);
    return;
  }

  cartEmpty.style.display = "none";

  state.cart.items.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item flex items-center justify-between gap-3 p-2 border-b border-gray-200";

    div.innerHTML = `
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <img src="${item.product?.images[0] ?? ''}" alt="${item.product?.name ?? 'Produto'}" class="w-28 h-28 object-cover rounded-lg flex-shrink-0">
        <div class="flex flex-col min-w-0">
          <span class="truncate font-medium text-gray-800 text-sm">${item.product?.name ?? "Produto inválido"}</span>
        </div>
      </div>

      <div class="flex flex-col items-center gap-1">
        <div class="flex items-center gap-1">
          <button class="qty-decrease bg-gray-200 px-2 py-1 rounded text-sm" data-id="${item.product?.id}">-</button>
          <span class="w-6 text-center text-sm">${item.qty}</span>
          <button class="qty-increase bg-gray-200 px-2 py-1 rounded text-sm" data-id="${item.product?.id}">+</button>
        </div>
        <span class="text-sm font-medium text-gray-700 mt-1">${fmtBRL(item.product?.price ?? 0)}</span>
      </div>

      <button class="remove text-red-500 font-bold px-2 py-1 rounded hover:bg-red-100 text-base" data-id="${item.product?.id}">×</button>
    `;

    cartContainer.appendChild(div);
  });

  cartTotal.textContent = fmtBRL(state.cart.subtotal);

  registerCartEvents();
}

export function initCart() {
  renderCart();
}

export function addToCart(product, qty = 1) {
  state.cart.add(product, qty);
  renderCart();
}

function registerCartEvents() {
    cartContainer.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", e => {
        const id = parseInt(e.target.dataset.id, 10);
        state.cart.remove(id);
        renderCart();
    });
    });

    cartContainer.querySelectorAll(".qty-decrease").forEach(btn => {
    btn.addEventListener("click", e => {
        const id = parseInt(e.target.dataset.id, 10);
        const item = state.cart.items.find(i => i.product.id === id);
        if (item) {
        state.cart.update(id, item.qty - 1);
        renderCart();
        }
    });
    });

    cartContainer.querySelectorAll(".qty-increase").forEach(btn => {
    btn.addEventListener("click", e => {
        const id = parseInt(e.target.dataset.id, 10);
        const item = state.cart.items.find(i => i.product.id === id);
        if (item) {
        state.cart.update(id, item.qty + 1);
        renderCart();
        }
    });
    });
}

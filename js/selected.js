import state from "./state.js";
import { fmtBRL } from "./utils.js";
import { showDetail } from "./detail.js"; 
import { addToCart } from "./cart.js";  


const elSelected = document.getElementById("selectedProducts");

export function renderSelected() {
  const selected = state.products.filter(p => p.category === "Selecionados");
  elSelected.innerHTML = '';

  selected.forEach(p => {
    const card = document.createElement("article");
    card.className = "selected-card";

    card.innerHTML = `
      <img src="${p.images[0]}" alt="${p.name}" class="h-48 w-full object-cover" loading="lazy">
      <div class="p-4 flex flex-col flex-1">
        <h3 class="text-lg font-semibold text-gray-800">${p.name}</h3>
        <p class="text-sm text-gray-600 flex-1 mt-1">${p.description}</p>
        <div class="mt-4">
          <span class="block text-xl font-bold text-blue-600 mb-3">${fmtBRL(p.price)}</span>
          <div class="flex gap-2">
            <button data-action="detail" data-id="${p.id}" class="flex-1 bg-gray-100 text-gray-800 font-medium px-3 py-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-200 transition">Detalhes</button>
            <button data-action="add" data-id="${p.id}" class="flex-1 bg-yellow-400 text-gray-900 font-semibold px-3 py-2 rounded-lg shadow hover:bg-yellow-300 transition">Adicionar</button>
          </div>
        </div>
      </div>
    `;

    card.addEventListener("click", e => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      const product = state.products.find(p => p.id === id);

      if (action === "detail") showDetail(product);
      else if (action === "add") addToCart(product, 1);
    });

    elSelected.appendChild(card);
  });
}

export function initSelected() {
  renderSelected();
}

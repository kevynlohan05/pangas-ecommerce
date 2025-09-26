import state from "./state.js";
import { fmtBRL } from "./utils.js";
import { showDetail } from "./detail.js"; 
import { addToCart } from "./cart.js";    

const elCatalog = document.getElementById("catalog");
const elCatFilter = document.getElementById("cat");
const elQ = document.getElementById("q");
const elSort = document.getElementById("sort");

function initCatalogFilters() {
  const cats = [...new Set(state.products.map(p => p.category))];
  cats.forEach(c => {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    elCatFilter.appendChild(o);
  });

  elQ.addEventListener("input", e => {
    state.filters.q = e.target.value.trim().toLowerCase();
    renderCatalog();
  });

  elCatFilter.addEventListener("change", e => {
    state.filters.cat = e.target.value;
    renderCatalog();
  });

  elSort.addEventListener("change", e => {
    state.filters.sort = e.target.value;
    renderCatalog();
  });
}

function getFilteredProducts() {
  let list = [...state.products];
  const { q, cat, sort } = state.filters;

  if (q) list = list.filter(p => p.name.toLowerCase().includes(q));
  if (cat) list = list.filter(p => p.category === cat);

  switch(sort) {
    case "name-asc": list.sort((a,b) => a.name.localeCompare(b.name)); break;
    case "name-desc": list.sort((a,b) => b.name.localeCompare(a.name)); break;
    case "price-asc": list.sort((a,b) => a.price - b.price); break;
    case "price-desc": list.sort((a,b) => b.price - a.price); break;
  }

  return list;
}

export function renderCatalog() {
  const list = getFilteredProducts().filter(p => p.category !== "Selecionados");
  elCatalog.innerHTML = '';

  if (list.length === 0) {
    elCatalog.innerHTML = '<p class="text-center text-gray-600 col-span-3">Nenhum produto encontrado.</p>';
    return;
  }

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "bg-white rounded-xl shadow-md overflow-hidden flex flex-col w-full max-w-xs hover:shadow-lg transition";

    card.innerHTML = `
      <img src="${p.images[0]}" alt="${p.name}" class="h-48 w-full object-cover">
      <div class="p-4 flex flex-col flex-1">
        <h3 class="text-lg font-semibold text-gray-800">${p.name}</h3>
        <p class="text-sm text-gray-600 flex-1 mt-1">${p.description}</p>
        <span class="block text-xl font-bold text-blue-600 mb-3">${fmtBRL(p.price)}</span>
        <div class="flex gap-2">
          <button data-action="detail" data-id="${p.id}" class="flex-1 bg-gray-100 text-gray-800 font-medium px-3 py-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-200 transition">Detalhes</button>
          <button data-action="add" data-id="${p.id}" class="flex-1 bg-yellow-400 text-gray-900 font-semibold px-3 py-2 rounded-lg shadow hover:bg-yellow-300 transition">Adicionar</button>
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

    elCatalog.appendChild(card);
  });
}

export function initCatalog() {
  initCatalogFilters();
  renderCatalog();
}

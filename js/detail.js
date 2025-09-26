import state from "./state.js";
import { addToCart } from "./cart.js";
import { fmtBRL } from "./utils.js";

const dlgDetail = document.getElementById("dlgDetail");
const btnCloseDetail = document.getElementById("closeDetail");
const btnAddToCart = document.getElementById("addToCart");
const detailQty = document.getElementById("detailQty");
const detailTitle = document.getElementById("detailTitle");
const detailImage = document.getElementById("detailImage");
const detailDesc = document.getElementById("detailDesc");
const detailCat = document.getElementById("detailCat");
const detailPrice = document.getElementById("detailPrice");
const detailThumbs = document.getElementById("detailThumbs");

export function showDetail(product) {
  console.log("Mostrar detalhes do produto:", product.name);

  state.currentDetail = product;

  detailTitle.textContent = product.name;
  detailImage.src = product.images[0] ?? "";
  detailDesc.textContent = product.description;
  detailCat.textContent = product.category;
  detailPrice.textContent = fmtBRL(product.price);

  detailThumbs.innerHTML = "";
  product.images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "w-12 h-12 object-cover rounded cursor-pointer";
    img.addEventListener("click", () => {
      detailImage.src = src;
    });
    detailThumbs.appendChild(img);
  });

  detailQty.value = 1; 
  dlgDetail.showModal();
}

btnCloseDetail.addEventListener("click", () => {
  dlgDetail.close();
});

btnAddToCart.addEventListener("click", () => {
  if (!state.currentDetail) return;
  const qty = parseInt(detailQty.value) || 1;
  addToCart(state.currentDetail, qty);
  dlgDetail.close();
});

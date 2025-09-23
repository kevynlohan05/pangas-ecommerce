const PRODUCTS = [
  {id:1,name:'Headset Gamer',price:249.9,category:'Acessórios',description:'Headset com som 7.1, microfone removível e acolchoamento macio.',images:['https://images.unsplash.com/photo-1583394838336-acd977736f90','https://images.unsplash.com/photo-1518445076-838ce5f3f3f1']},
  {id:2,name:'Teclado Mecânico',price:399.0,category:'Periféricos',description:'Switches azuis, iluminação RGB e construção em alumínio.',images:['https://images.unsplash.com/photo-1517336714731-489689fd1ca8','https://images.unsplash.com/photo-1518779578993-ec3579fee39f']},
  {id:3,name:'Mouse Sem Fio',price:159.9,category:'Periféricos',description:'Sensor de alta precisão, 2.4Ghz e Bluetooth, até 70h bateria.',images:['https://images.unsplash.com/photo-1583394838336-acd977736f90','https://images.unsplash.com/photo-1518445076-838ce5f3f3f1']},
  {id:4,name:'Notebook 14"',price:3499.0,category:'Computadores',description:'Ryzen 5, 16GB RAM, SSD 512GB, tela Full HD.',images:['https://images.unsplash.com/photo-1517336714731-489689fd1ca8']},
  {id:5,name:'Monitor 27" 144Hz',price:1799.9,category:'Monitores',description:'Painel IPS, 1ms, HDR10, bordas finas.',images:['https://images.unsplash.com/photo-1517336714731-489689fd1ca8']},
  {id:6,name:'Cadeira Ergonômica',price:1299.9,category:'Móveis',description:'Apoio lombar, ajuste de altura e inclinação.',images:['https://images.unsplash.com/photo-1583394838336-acd977736f90','https://images.unsplash.com/photo-1518445076-838ce5f3f3f1']},
  {id:7,name:'SSD NVMe 1TB',price:449.9,category:'Armazenamento',description:'Leituras até 3500 MB/s, 5 anos de garantia.',images:['https://images.unsplash.com/photo-1583394838336-acd977736f90','https://images.unsplash.com/photo-1518445076-838ce5f3f3f1']},
  {id:8,name:'Webcam 1080p',price:229.0,category:'Acessórios',description:'Autofoco, microfone estéreo e clip universal.',images:['https://images.unsplash.com/photo-1517336714731-489689fd1ca8']}
];

const fmtBRL = n => n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const byId = id => document.getElementById(id);

const state = {
  products: PRODUCTS,
  cart: JSON.parse(localStorage.getItem('cart')||'[]'),
  filters: {q:'',cat:'',sort:'name-asc'},
  currentDetail: null
};

const elCatalog = byId('catalog');
const elCatFilter = byId('cat');
const elQ = byId('q');
const elSort = byId('sort');

const elCartItems = byId('cartItems');
const elCartEmpty = byId('cartEmpty');
const elSubtotal = byId('subtotal');
const btnCheckout = byId('btnCheckout');

const dlgDetail = byId('dlgDetail');
const detailTitle = byId('detailTitle');
const detailImage = byId('detailImage');
const detailThumbs = byId('detailThumbs');
const detailDesc = byId('detailDesc');
const detailCat = byId('detailCat');
const detailPrice = byId('detailPrice');
const detailQty = byId('detailQty');
const addToCart = byId('addToCart');
const closeDetail = byId('closeDetail');

const dlgCheckout = byId('dlgCheckout');
const closeCheckout = byId('closeCheckout');
const formCheckout = byId('formCheckout');

// ====== Inicializar filtros ======
function initFilters(){
  const cats = [...new Set(state.products.map(p=>p.category))];
  cats.forEach(c=>{
    const o = document.createElement('option'); 
    o.value = c; o.textContent = c;
    elCatFilter.appendChild(o);
  });

  elQ.addEventListener('input', e => {state.filters.q=e.target.value.trim().toLowerCase(); renderCatalog();});
  elCatFilter.addEventListener('change', e => {state.filters.cat=e.target.value; renderCatalog();});
  elSort.addEventListener('change', e => {state.filters.sort=e.target.value; renderCatalog();});
}

// ====== Filtrar e ordenar ======
function getFiltered(){
  let list = [...state.products];
  const {q,cat,sort} = state.filters;
  if(q) list = list.filter(p => p.name.toLowerCase().includes(q));
  if(cat) list = list.filter(p => p.category === cat);
  switch(sort){
    case 'name-asc': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case 'name-desc': list.sort((a,b)=>b.name.localeCompare(a.name)); break;
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
  }
  return list;
}

// ====== Renderizar catálogo ======
function renderCatalog(){
  const list = getFiltered();
  elCatalog.innerHTML = '';
  if(list.length === 0){elCatalog.innerHTML = '<p>Nenhum produto encontrado.</p>'; return;}
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className='card';
    card.innerHTML=`
      <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
      <div class="content">
        <div class="row">
          <strong>${p.name}</strong>
          <span class="pill">${p.category}</span>
        </div>
        <div class="row" style="margin-top:6px">
          <span class="price">${fmtBRL(p.price)}</span>
          <div style="display:flex;gap:8px">
            <button data-action="detail" data-id="${p.id}">Detalhes</button>
            <button data-action="add" data-id="${p.id}">+ Carrinho</button>
          </div>
        </div>
      </div>
    `;
    elCatalog.appendChild(card);
  });
  attachCardEvents();
}

// ====== Eventos nos botões dos cards ======
function attachCardEvents(){
  document.querySelectorAll('#catalog button').forEach(btn=>{
    const id = parseInt(btn.dataset.id);
    btn.onclick = ()=> {
      if(btn.dataset.action==='detail') showDetail(id);
      else addCart(id,1);
    };
  });
}

// ====== Detalhe do produto ======
function showDetail(id){
  const p = state.products.find(x=>x.id===id);
  if(!p) return;
  state.currentDetail = p;
  detailTitle.textContent = p.name;
  detailImage.src = p.images[0];
  detailDesc.textContent = p.description;
  detailCat.textContent = p.category;
  detailPrice.textContent = fmtBRL(p.price);
  detailQty.value=1;
  detailThumbs.innerHTML = '';
  p.images.forEach(src=>{
    const img = document.createElement('img');
    img.src=src; img.onclick=()=> detailImage.src=src;
    detailThumbs.appendChild(img);
  });
  dlgDetail.showModal();
}

closeDetail.onclick = ()=> dlgDetail.close();
addToCart.onclick = ()=> {addCart(state.currentDetail.id, parseInt(detailQty.value)||1); dlgDetail.close();}

// ====== Carrinho ======
function saveCart(){localStorage.setItem('cart', JSON.stringify(state.cart)); renderCart();}
function addCart(id,qty){
  const idx = state.cart.findIndex(x=>x.id===id);
  if(idx>-1) state.cart[idx].qty += qty;
  else state.cart.push({id,qty});
  saveCart();
}
function removeCart(id){state.cart = state.cart.filter(x=>x.id!==id); saveCart();}

function renderCart(){
  elCartItems.innerHTML='';
  if(state.cart.length===0){elCartEmpty.style.display='block'; elSubtotal.textContent='R$ 0,00'; return;}
  elCartEmpty.style.display='none';
  let total=0;
  state.cart.forEach(item=>{
    const p = state.products.find(x=>x.id===item.id);
    total += p.price*item.qty;
    const div = document.createElement('div');
    div.className='cart-item';
    div.innerHTML=`
      <img src="${p.images[0]}" alt="${p.name}">
      <div>
        <strong>${p.name}</strong>
        <div class="qty">
          <button data-action="dec" data-id="${p.id}">-</button>
          <input type="text" value="${item.qty}" readonly>
          <button data-action="inc" data-id="${p.id}">+</button>
        </div>
      </div>
      <button class="remove" data-id="${p.id}">x</button>
    `;
    elCartItems.appendChild(div);
  });

  elSubtotal.textContent = fmtBRL(total);

  // Eventos do carrinho
  elCartItems.querySelectorAll('.remove').forEach(btn=>btn.onclick=()=>removeCart(parseInt(btn.dataset.id)));
  elCartItems.querySelectorAll('.qty button').forEach(btn=>{
    const id=parseInt(btn.dataset.id);
    const item = state.cart.find(x=>x.id===id);
    if(btn.dataset.action==='inc'){btn.onclick=()=>{item.qty++; saveCart();};}
    if(btn.dataset.action==='dec'){btn.onclick=()=>{item.qty--; if(item.qty<1) removeCart(id); else saveCart();};}
  });
}

// ====== Checkout ======
btnCheckout.onclick = ()=> dlgCheckout.showModal();
closeCheckout.onclick = ()=> dlgCheckout.close();
formCheckout.onsubmit = e=>{
  e.preventDefault();
  alert('Pedido finalizado!'); 
  state.cart=[]; saveCart(); dlgCheckout.close(); formCheckout.reset();
}

// ====== Boot ======
initFilters();
renderCatalog();
renderCart();

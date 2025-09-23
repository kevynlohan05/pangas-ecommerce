// ====== Dados dos produtos ======
const PRODUCTS = [
    {id:1, name:'Headset Gamer', price:249.9, category:'Acessórios', description:'Headset com som 7.1, microfone removível e acolchoamento macio.', images:['https://images.unsplash.com/photo-1583394838336-acd977736f90','https://images.unsplash.com/photo-1518445076-838ce5f3f3f1']},
    {id:2, name:'Teclado Mecânico', price:399.0, category:'Periféricos', description:'Switches azuis, iluminação RGB e construção em alumínio.', images:['https://images.unsplash.com/photo-1517336714731-489689fd1ca8','https://images.unsplash.com/photo-1518779578993-ec3579fee39f']},
    {id:3, name:'Mouse Sem Fio', price:159.9, category:'Periféricos', description:'Sensor de alta precisão, 2.4Ghz e Bluetooth, até 70h bateria.', images:['https://images.unsplash.com/photo-1587825140400-9b06d8f67b2c']},
    {id:4, name:'Notebook 14"', price:3499.0, category:'Computadores', description:'Ryzen 5, 16GB RAM, SSD 512GB, tela Full HD.', images:['https://images.unsplash.com/photo-1517336714731-489689fd1ca8']},
    {id:5, name:'Monitor 27" 144Hz', price:1799.9, category:'Monitores', description:'Painel IPS, 1ms, HDR10, bordas finas.', images:['https://images.unsplash.com/photo-1517336714731-489689fd1ca8']},
    {id:6, name:'Cadeira Ergonômica', price:1299.9, category:'Móveis', description:'Apoio lombar, ajuste de altura e inclinação.', images:['https://images.unsplash.com/photo-1598300053650-3a15f3f24d2b']},
    {id:7, name:'SSD NVMe 1TB', price:449.9, category:'Armazenamento', description:'Leituras até 3500 MB/s, 5 anos de garantia.', images:['https://images.unsplash.com/photo-1616348436166-7c2a8b3b5ffe']},
    {id:8, name:'Webcam 1080p', price:229.0, category:'Acessórios', description:'Autofoco, microfone estéreo e clip universal.', images:['https://images.unsplash.com/photo-1517336714731-489689fd1ca8']}
];

// ====== Utilidades ======
const fmtBRL = n => n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const byId = id => document.getElementById(id);

// ====== Estado ======
const state = {
  products: PRODUCTS,
  cart: JSON.parse(localStorage.getItem('cart')||'[]'),
  filters: {q:'', cat:'', sort:'name-asc'},
  currentDetail: null
};

// ====== Elementos ======
const elCatalog = byId('catalog');
const elCatFilter = byId('cat');
const elQ = byId('q');
const elSort = byId('sort');

const elCartItems = byId('cartItems');
const elCartEmpty = byId('cartEmpty');
const elSubtotal = byId('subtotal');
const elBtnCheckout = byId('btnCheckout');

const dlgDetail = byId('dlgDetail');
const detailTitle = byId('detailTitle');
const detailImage = byId('detailImage');
const detailThumbs = byId('detailThumbs');
const detailDesc = byId('detailDesc');
const detailCat = byId('detailCat');
const detailPrice = byId('detailPrice');
const detailQty = byId('detailQty');
const addToCartBtn = byId('addToCart');
const closeDetailBtn = byId('closeDetail');

const dlgCheckout = byId('dlgCheckout');
const formCheckout = byId('formCheckout');
const elCep = byId('cep');
const elRua = byId('rua');
const elNumero = byId('numero');
const elBairro = byId('bairro');
const elCidade = byId('cidade');
const elUF = byId('uf');
const elMensagemCEP = byId('cep-message');

// ====== Inicializar filtros ======
function initFilters(){
  const cats = [...new Set(state.products.map(p=>p.category))];
  cats.forEach(c=>{
    const o = document.createElement('option'); 
    o.value = c; 
    o.textContent = c; 
    elCatFilter.appendChild(o);
  });

  elQ.addEventListener('input', e=>{
    state.filters.q = e.target.value.trim().toLowerCase();
    renderCatalog();
  });

  elCatFilter.addEventListener('change', e=>{
    state.filters.cat = e.target.value;
    renderCatalog();
  });

  elSort.addEventListener('change', e=>{
    state.filters.sort = e.target.value;
    renderCatalog();
  });
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
  if(list.length === 0){
    elCatalog.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }
  for(const p of list){
    const card = document.createElement('article');
    card.className='card';
    card.innerHTML = `
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
  }
}

// ====== Renderizar carrinho ======
function renderCart(){
  elCartItems.innerHTML = '';
  if(state.cart.length===0){
    elCartEmpty.style.display = 'block';
    elSubtotal.textContent = fmtBRL(0);
    return;
  }
  elCartEmpty.style.display = 'none';
  let subtotal = 0;
  state.cart.forEach(item=>{
    subtotal += item.price * item.qty;
    const div = document.createElement('div');
    div.className='cart-item';
    div.innerHTML = `
      <img src="${item.images[0]}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong><br>
        <span class="muted">${fmtBRL(item.price)} x ${item.qty}</span>
      </div>
      <div class="qty">
        <button data-action="dec" data-id="${item.id}">-</button>
        <input type="text" value="${item.qty}" readonly>
        <button data-action="inc" data-id="${item.id}">+</button>
      </div>
      <button class="remove" data-action="remove" data-id="${item.id}">x</button>
    `;
    elCartItems.appendChild(div);
  });
  elSubtotal.textContent = fmtBRL(subtotal);
  localStorage.setItem('cart',JSON.stringify(state.cart));
}

// ====== Ações do catálogo ======
elCatalog.addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = parseInt(btn.dataset.id);
  const action = btn.dataset.action;
  const product = state.products.find(p=>p.id===id);

  if(action==='detail'){
    state.currentDetail = product;
    showDetail(product);
  } else if(action==='add'){
    addToCart(product,1);
  }
});

// ====== Detalhes do produto ======
function showDetail(product){
  detailTitle.textContent = product.name;
  detailImage.src = product.images[0];
  detailDesc.textContent = product.description;
  detailCat.textContent = product.category;
  detailPrice.textContent = fmtBRL(product.price);
  detailQty.value = 1;

  // Thumbnails
  detailThumbs.innerHTML = '';
  product.images.forEach(src=>{
    const img = document.createElement('img');
    img.src = src;
    img.addEventListener('click',()=>{detailImage.src=src});
    detailThumbs.appendChild(img);
  });

  dlgDetail.showModal();
}

addToCartBtn.addEventListener('click',()=>{
  const qty = parseInt(detailQty.value)||1;
  addToCart(state.currentDetail, qty);
  dlgDetail.close();
});

closeDetailBtn.addEventListener('click',()=>dlgDetail.close());

// ====== Adicionar ao carrinho ======
function addToCart(product, qty){
  const existing = state.cart.find(p=>p.id===product.id);
  if(existing){
    existing.qty += qty;
  } else {
    state.cart.push({...product, qty});
  }
  renderCart();
}

// ====== Ações do carrinho ======
elCartItems.addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = parseInt(btn.dataset.id);
  const action = btn.dataset.action;
  const item = state.cart.find(p=>p.id===id);
  if(!item) return;

  switch(action){
    case 'inc': item.qty++; break;
    case 'dec': item.qty = Math.max(1,item.qty-1); break;
    case 'remove': state.cart = state.cart.filter(p=>p.id!==id); break;
  }
  renderCart();
});

// ====== Checkout ======
elBtnCheckout.addEventListener('click',()=>dlgCheckout.showModal());

formCheckout.addEventListener('submit', e=>{
  e.preventDefault();
  alert('Compra finalizada com sucesso!');
  state.cart = [];
  renderCart();
  dlgCheckout.close();
});

// ====== CEP autopreenchimento ======
function formatCep(value){
  value = value.replace(/\D/g,'');
  if(value.length>5) value=value.replace(/^(\d{5})(\d)/,'$1-$2');
  return value;
}

async function buscarCep(cep){
  try{
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if(!res.ok) throw new Error('Falha de rede');
    const data = await res.json();
    if(data.erro){
      elMensagemCEP.textContent="CEP não encontrado. Preencha manualmente.";
      elMensagemCEP.setAttribute('aria-live','assertive');
      return;
    }
    elRua.value = data.logradouro||'';
    elBairro.value = data.bairro||'';
    elCidade.value = data.localidade||'';
    elUF.value = data.uf||'';
    elMensagemCEP.textContent='';
    elNumero.focus();
  } catch(err){
    elMensagemCEP.textContent="Não foi possível buscar o CEP. Preencha manualmente.";
    elMensagemCEP.setAttribute('aria-live','assertive');
  }
}

elCep.addEventListener('input', e=>{
  e.target.value = formatCep(e.target.value);
  const cepLimpo = e.target.value.replace(/\D/g,'');
  if(cepLimpo.length===8) buscarCep(cepLimpo);
  else elMensagemCEP.textContent='';
});

// ====== Inicialização ======
initFilters();
renderCatalog();
renderCart();

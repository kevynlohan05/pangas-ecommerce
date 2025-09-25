const PRODUCTS = [
    {id:1, name:'Headset Gamer', price:249.9, category:'Acessórios', description:'Headset com som 7.1, microfone removível e acolchoamento macio.', images:['https://images.unsplash.com/photo-1583394838336-acd977736f90']},
    {id:2, name:'Teclado Mecânico', price:399.0, category:'Periféricos', description:'Switches azuis, iluminação RGB e construção em alumínio.', images:['https://m.media-amazon.com/images/I/61FR1BJ71IL._UF894,1000_QL80_.jpg']},
    {id:3, name:'Mouse Sem Fio', price:159.9, category:'Periféricos', description:'Sensor de alta precisão, 2.4Ghz e Bluetooth, até 70h bateria.', images:['https://www.bright.com.br/media/djcatalog2/images/item/4/mouse-sem-fio-preto_f.jpg']},
    {id:4, name:'Notebook 14"', price:3499.0, category:'Computadores', description:'Ryzen 5, 16GB RAM, SSD 512GB, tela Full HD.', images:['https://images.unsplash.com/photo-1517336714731-489689fd1ca8']},
    {id:5, name:'Monitor 27" 144Hz', price:1799.9, category:'Monitores', description:'Painel IPS, 1ms, HDR10, bordas finas.', images:['https://t17208.vtexassets.com/arquivos/ids/161466/Monitor-Gamer-LG-24--Full-HD-144-Hz-Widescreen-24GL600F.png?v=638780083535300000']},
    {id:6, name:'Cadeira Ergonômica', price:1299.9, category:'Móveis', description:'Apoio lombar, ajuste de altura e inclinação.', images:['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaqZ0wYW0BEzPDt7YJzS7nbj9xw-sX_XeZow&s']},
    {id:7, name:'SSD NVMe 1TB', price:449.9, category:'Armazenamento', description:'Leituras até 3500 MB/s, 5 anos de garantia.', images:['https://static.gigabyte.com/StaticFile/Image/Global/13fdaa6e6dc982d0753d32c70c23d92c/Product/30161/Png']},
    {id:8, name:'Webcam 1080p', price:229.0, category:'Acessórios', description:'Autofoco, microfone estéreo e clip universal.', images:['https://m.media-amazon.com/images/I/51OEgiWAoKL.jpg']},
    
    {id:9, name: "Combo Gamer Meetion", price:299.90, category:'Selecionados', description:'Combo gamer completo Meetion.', images:['/assets/images/product-4.png']},
    {id:10, name: "Msi GeForce Gtx 1650", price:1399.90, category:'Selecionados', description:'Placa de vídeo MSI GeForce GTX 1650.', images:['/assets/images/product-5.png']},
    {id:11, name: "Controle Dualsense PS5", price:349.90, category:'Selecionados', description:'Controle oficial Dualsense para PS5.', images:['/assets/images/product-6.png']},
    {id:12, name: "Cadeira Gamer Frizzi", price:299.90, category:'Selecionados', description:'Cadeira gamer Frizzi confortável.', images:['/assets/images/product-7.png']},
];

const fmtBRL = n => n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const byId = id => document.getElementById(id);

const state = {
  products: PRODUCTS,
  cart: JSON.parse(localStorage.getItem('cart')||'[]'),
  filters: {q:'', cat:'', sort:'name-asc'},
  currentDetail: null
};

const elSelected = byId('selectedProducts');
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
const closeCheckoutBtn = byId('closeCheckout'); 

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

function renderSelected(){
  const selected = state.products.filter(p=>p.category==='Selecionados');
  elSelected.innerHTML = '';
  selected.forEach(p=>{
    const card = document.createElement('article');
    card.className = "bg-white rounded-xl shadow-md overflow-hidden flex flex-col w-full max-w-xs hover:shadow-lg transition cursor-pointer";

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
    elSelected.appendChild(card);
  });
}

function renderCatalog() {
  const list = getFiltered().filter(p=>p.category!=='Selecionados');
  elCatalog.innerHTML = '';
  if (list.length === 0) {
    elCatalog.innerHTML = '<p class="col-span-full text-center text-gray-600">Nenhum produto encontrado.</p>';
    return;
  }

  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = "bg-white rounded-xl shadow-md overflow-hidden flex flex-col w-full max-w-xs hover:shadow-lg transition";

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
    elCatalog.appendChild(card);
  });
}

function renderCart() {
  elCartItems.innerHTML = '';
  if (state.cart.length === 0) {
    elCartEmpty.style.display = 'block';
    elSubtotal.textContent = fmtBRL(0);
    return;
  }
  elCartEmpty.style.display = 'none';

  let subtotal = 0;
  state.cart.forEach(item=>{
    subtotal += item.price * item.qty;
    const div = document.createElement('div');
    div.className = "flex items-center bg-gray-50 rounded-lg p-3 shadow-sm";
    div.innerHTML = `
      <img src="${item.images[0]}" alt="${item.name}" class="w-14 h-14 object-cover rounded flex-shrink-0">
      <div class="flex-1 px-3 min-w-0">
        <p class="font-semibold text-gray-800 truncate">${item.name}</p>
        <p class="text-sm text-gray-500">${fmtBRL(item.price)}</p>
      </div>
      <div class="flex flex-col items-center gap-1">
        <div class="flex items-center gap-1">
          <button data-action="dec" data-id="${item.id}" class="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full border hover:bg-gray-200 transition text-sm">–</button>
          <span class="w-6 text-center text-sm font-medium text-gray-800">${item.qty}</span>
          <button data-action="inc" data-id="${item.id}" class="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full border hover:bg-gray-200 transition text-sm">+</button>
        </div>
        <button data-action="remove" data-id="${item.id}" class="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition text-sm">✕</button>
      </div>
    `;
    elCartItems.appendChild(div);
  });

  elSubtotal.textContent = fmtBRL(subtotal);
  localStorage.setItem('cart', JSON.stringify(state.cart));
}

[elSelected, elCatalog].forEach(container=>{
  container.addEventListener('click', e=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const id = parseInt(btn.dataset.id);
    const action = btn.dataset.action;
    const product = state.products.find(p=>p.id===id);

    if(action==='detail'){
      showDetail(product);
    } else if(action==='add'){
      addToCart(product, 1);
    }
  });
});

function showDetail(product){
  state.currentDetail = product; 

  detailTitle.textContent = product.name;
  detailImage.src = product.images[0];
  detailImage.className = "w-full max-h-96 object-contain rounded-xl bg-gray-50";
  detailDesc.textContent = product.description;
  detailCat.textContent = product.category;
  detailPrice.textContent = fmtBRL(product.price);
  detailQty.value = 1;

  detailThumbs.innerHTML = '';
  detailThumbs.className = "mt-3 flex flex-wrap gap-2 items-start";

  product.images.forEach((src, idx)=>{
    const btn = document.createElement('button');
    btn.type = "button";
    btn.className = "p-0 rounded-lg outline-none focus:ring-2 focus:ring-blue-300";

    const img = document.createElement('img');
    img.src = src;
    img.alt = `${product.name} miniatura ${idx+1}`;
    img.className = "w-16 h-16 object-cover rounded-lg border-2 border-transparent hover:border-blue-400 transition";

    btn.addEventListener('click', ()=>{
      detailImage.src = src;
      [...detailThumbs.querySelectorAll('img')].forEach(i=>{
        i.classList.remove("ring-2","ring-blue-500","border-blue-500");
        i.classList.add("border-transparent");
      });
      img.classList.add("ring-2","ring-blue-500","border-blue-500");
    });

    btn.appendChild(img);
    detailThumbs.appendChild(btn);
    if(idx===0) img.classList.add("ring-2","ring-blue-500","border-blue-500");
  });

  dlgDetail.showModal();
}

addToCartBtn.addEventListener('click', ()=>{
  const qty = parseInt(detailQty.value) || 1;
  addToCart(state.currentDetail, qty);
  dlgDetail.close();
});

closeDetailBtn.addEventListener('click', ()=> dlgDetail.close());

function addToCart(product, qty){
  const existing = state.cart.find(p=>p.id===product.id);
  if(existing) existing.qty += qty;
  else state.cart.push({...product, qty});
  renderCart();
}

elCartItems.addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = parseInt(btn.dataset.id);
  const action = btn.dataset.action;
  const item = state.cart.find(p=>p.id===id);
  if(!item) return;

  switch(action){
    case 'inc': item.qty++; break;
    case 'dec': item.qty = Math.max(1, item.qty-1); break;
    case 'remove': state.cart = state.cart.filter(p=>p.id!==id); break;
  }
  renderCart();
});

elBtnCheckout.addEventListener('click', ()=> dlgCheckout.showModal());
closeCheckoutBtn.addEventListener('click', ()=> dlgCheckout.close());

formCheckout.addEventListener('submit', e=>{
  e.preventDefault();
  alert('Compra finalizada com sucesso!');
  state.cart = [];
  renderCart();
  dlgCheckout.close();
});

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

initFilters();
renderSelected();
renderCatalog();
renderCart();

import { Product } from './models/Product.js';
import { Cart } from './models/Cart.js';

const PRODUCTS = [
  new Product(1, 'Headset Gamer', 249.9, 'Acessórios', 'Headset com som 7.1, microfone removível e acolchoamento macio.', ['https://images.unsplash.com/photo-1583394838336-acd977736f90']),
  new Product(2, 'Teclado Mecânico', 399.0, 'Periféricos', 'Switches azuis, iluminação RGB e construção em alumínio.', ['https://m.media-amazon.com/images/I/61FR1BJ71IL._UF894,1000_QL80_.jpg']),
  new Product(3, 'Mouse Sem Fio', 159.9, 'Periféricos', 'Sensor de alta precisão, 2.4Ghz e Bluetooth, até 70h bateria.', ['https://www.bright.com.br/media/djcatalog2/images/item/4/mouse-sem-fio-preto_f.jpg']),
  new Product(4, 'Notebook 14"', 3499.0, 'Computadores', 'Ryzen 5, 16GB RAM, SSD 512GB, tela Full HD.', ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8']),
  new Product(5, 'Monitor 27" 144Hz', 1799.9, 'Monitores', 'Painel IPS, 1ms, HDR10, bordas finas.', ['https://t17208.vtexassets.com/arquivos/ids/161466/Monitor-Gamer-LG-24--Full-HD-144-Hz-Widescreen-24GL600F.png?v=638780083535300000']),
  new Product(6, 'Cadeira Ergonômica', 1299.9, 'Móveis', 'Apoio lombar, ajuste de altura e inclinação.', ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaqZ0wYW0BEzPDt7YJzS7nbj9xw-sX_XeZow&s']),
  new Product(7, 'SSD NVMe 1TB', 449.9, 'Armazenamento', 'Leituras até 3500 MB/s, 5 anos de garantia.', ['https://static.gigabyte.com/StaticFile/Image/Global/13fdaa6e6dc982d0753d32c70c23d92c/Product/30161/Png']),
  new Product(8, 'Webcam 1080p', 229.0, 'Acessórios', 'Autofoco, microfone estéreo e clip universal.', ['https://m.media-amazon.com/images/I/51OEgiWAoKL.jpg']),
  
  new Product(9, 'Combo Gamer Meetion', 299.90, 'Selecionados', 'Combo gamer completo Meetion.', ['/assets/images/product-4.png']),
  new Product(10, 'Msi GeForce Gtx 1650', 1399.90, 'Selecionados', 'Placa de vídeo MSI GeForce GTX 1650.', ['/assets/images/product-5.png']),
  new Product(11, 'Controle Dualsense PS5', 349.90, 'Selecionados', 'Controle oficial Dualsense para PS5.', ['/assets/images/product-6.png']),
  new Product(12, 'Cadeira Gamer Frizzi', 299.90, 'Selecionados', 'Cadeira gamer Frizzi confortável.', ['/assets/images/product-7.png']),
];

const state = {
  products: PRODUCTS,
  cart: new Cart(),
  filters: { q: '', cat: '', sort: 'name-asc' },
  currentDetail: null
};

export default state;

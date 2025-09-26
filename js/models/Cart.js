import { CartItem } from './CartItem.js';
import { Product } from './Product.js';

export class Cart {
  constructor() {
    this.items = (JSON.parse(localStorage.getItem('cart')) || [])
      .map(i => {
        if (i.id == null || i.price == null) return null;
        return new CartItem(
          new Product(i.id, i.name, i.price, i.category, i.description, i.images),
          i.qty
        );
      })
      .filter(Boolean);
  }

  add(product, qty = 1) {
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push(new CartItem(product, qty));
    }
    this.save();
  }

  remove(productId) {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.save();
  }

  update(productId, qty) {
    const item = this.items.find(i => i.product.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
      this.save();
    }
  }

  get subtotal() {
    return this.items.reduce((sum, i) => sum + ((i.product?.price ?? 0) * i.qty), 0);
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  clear() {
    this.items = [];
    this.save();
  }
}

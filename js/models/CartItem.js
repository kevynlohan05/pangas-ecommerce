export class CartItem {
  constructor(product, qty = 1) {
    this.product = product;
    this.qty = qty;
  }

  get total() {
    return (this.product?.price ?? 0) * this.qty;
  }
}
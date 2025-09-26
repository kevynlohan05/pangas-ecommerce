export class Product {
  constructor(id, name, price, category, description, images) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.description = description;
    this.images = images;
  }

  get formattedPrice() {
    return this.price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}

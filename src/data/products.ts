import productsData from './products.json';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: 'Vlift Pro' | 'Seffiline';
  category: 'Hilos PDO' | 'Medicina Regenerativa';
  shortDesc: string;
  description: string;
  features: string[];
  specs: ProductSpec[];
  image: string;
  price: number;
}

// Cast JSON array to typed Product array
export const products: Product[] = productsData.products as Product[];

// Dynamically bind product.price getter/setter to localStorage override values
products.forEach(product => {
  const defaultPrice = product.price;
  Object.defineProperty(product, 'price', {
    get() {
      const saved = localStorage.getItem(`latmedical_price_${product.id}`);
      return saved ? parseFloat(saved) : defaultPrice;
    },
    set(newVal: number) {
      localStorage.setItem(`latmedical_price_${product.id}`, newVal.toString());
    },
    configurable: true,
    enumerable: true
  });
});

import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): Promise<void>;
  increment(id: string): Promise<void>;
  decrement(id: string): Promise<void>;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const foundProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );

      if (foundProducts) {
        const storagedProducts: Product[] = JSON.parse(foundProducts);

        setProducts(storagedProducts);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      const existentProduct = products.find(item => item.id === product.id);

      if (existentProduct) {
        const newProductsArray = products.map(item =>
          item.id === existentProduct.id
            ? { ...existentProduct, quantity: existentProduct.quantity + 1 }
            : item,
        );

        setProducts(newProductsArray);
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const index = products.findIndex(product => product.id === id);

      const newProductsArray = [...products];

      newProductsArray[index].quantity += 1;

      setProducts(newProductsArray);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(newProductsArray),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const index = products.findIndex(product => product.id === id);

      const newProductsArray = [...products];

      newProductsArray[index].quantity -= 1;

      if (newProductsArray[index].quantity === 0) {
        newProductsArray.splice(index, 1);
      }

      setProducts(newProductsArray);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(newProductsArray),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };

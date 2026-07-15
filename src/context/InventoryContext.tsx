import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  variantName?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  fullName: string;
  specialty: string;
  licenseNumber: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  province: string;
  paymentMethod: string;
  items: OrderItem[];
  total: number;
  status: 'Pendiente' | 'Aprobado' | 'Despachado' | 'Cancelado';
}

export interface VariantStock {
  id: string;
  name: string; // e.g., "30G x 25mm"
  stock: number;
}

export interface ProductInventory {
  productId: string;
  hasVariants: boolean;
  stock: number; // if no variants
  variants: VariantStock[];
}

interface InventoryContextType {
  inventory: ProductInventory[];
  orders: Order[];
  updateStock: (productId: string, variantId: string | undefined, newStock: number) => void;
  decrementStockForOrder: (items: OrderItem[]) => void;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Initial default stock data populated from product definitions
const defaultInventory: ProductInventory[] = [
  {
    productId: 'vlift-mono',
    hasVariants: true,
    stock: 0,
    variants: [
      { id: '30g-25', name: '30G x 25mm', stock: 150 },
      { id: '29g-38', name: '29G x 38mm', stock: 120 },
      { id: '29g-50', name: '29G x 50mm', stock: 80 },
      { id: '27g-60', name: '27G x 60mm', stock: 95 },
      { id: '25g-90', name: '25G x 90mm', stock: 50 }
    ]
  },
  {
    productId: 'vlift-biocanula',
    hasVariants: true,
    stock: 0,
    variants: [
      { id: '23g-38', name: '23G x 38mm', stock: 45 },
      { id: '23g-60', name: '23G x 60mm', stock: 50 }
    ]
  },
  {
    productId: 'vlift-single-screw',
    hasVariants: true,
    stock: 0,
    variants: [
      { id: '29g-38', name: '29G x 38mm', stock: 60 },
      { id: '27g-50', name: '27G x 50mm', stock: 75 }
    ]
  },
  {
    productId: 'vlift-double-screw',
    hasVariants: true,
    stock: 0,
    variants: [
      { id: '27g-50', name: '27G x 50mm', stock: 40 },
      { id: '26g-60', name: '26G x 60mm', stock: 35 }
    ]
  },
  {
    productId: 'vlift-genesis',
    hasVariants: true,
    stock: 0,
    variants: [
      { id: '19g-70', name: '19G x 70mm', stock: 30 },
      { id: '19g-90', name: '19G x 90mm', stock: 35 },
      { id: '21g-70', name: '21G x 70mm', stock: 25 },
      { id: '21g-90', name: '21G x 90mm', stock: 30 },
      { id: '23g-70', name: '23G x 70mm', stock: 20 },
      { id: '23g-90', name: '23G x 90mm', stock: 25 }
    ]
  },
  {
    productId: 'vlift-nose',
    hasVariants: true,
    stock: 0,
    variants: [
      { id: '19g-38', name: '19G x 38mm', stock: 55 },
      { id: '19g-50', name: '19G x 50mm', stock: 40 },
      { id: '21g-60', name: '21G x 60mm', stock: 45 }
    ]
  },
  {
    productId: 'vlift-eye',
    hasVariants: true,
    stock: 0,
    variants: [
      { id: '30g-25', name: '30G x 25mm', stock: 90 },
      { id: '30g-38', name: '30G x 38mm', stock: 110 }
    ]
  },
  {
    productId: 'vlift-premium',
    hasVariants: true,
    stock: 0,
    variants: [
      { id: '19g-70', name: '19G x 70mm', stock: 45 },
      { id: '19g-90', name: '19G x 90mm', stock: 50 },
      { id: '21g-70', name: '21G x 70mm', stock: 60 },
      { id: '21g-90', name: '21G x 90mm', stock: 55 },
      { id: '23g-70', name: '23G x 70mm', stock: 40 },
      { id: '23g-90', name: '23G x 90mm', stock: 45 }
    ]
  },
  {
    productId: 'vlift-cones',
    hasVariants: true,
    stock: 0,
    variants: [
      { id: '18g-100', name: '18G x 100mm', stock: 20 }
    ]
  },
  {
    productId: 'vlift-tensio',
    hasVariants: true,
    stock: 0,
    variants: [
      { id: '19g-100', name: '19G x 100mm', stock: 15 }
    ]
  },
  // Seffiline kits (usually sold as single standardized box kits, no sizes needed, managed as flat stock)
  {
    productId: 'seffi-filler',
    hasVariants: false,
    stock: 50,
    variants: []
  },
  {
    productId: 'seffi-hair',
    hasVariants: false,
    stock: 40,
    variants: []
  },
  {
    productId: 'seffi-care',
    hasVariants: false,
    stock: 30,
    variants: []
  },
  {
    productId: 'seffi-gyn',
    hasVariants: false,
    stock: 25,
    variants: []
  }
];

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<ProductInventory[]>(() => {
    const isUpdated = localStorage.getItem('latmedical_inventory_v2');
    if (!isUpdated) {
      localStorage.removeItem('latmedical_inventory');
      localStorage.setItem('latmedical_inventory_v2', 'true');
      return defaultInventory;
    }
    const saved = localStorage.getItem('latmedical_inventory');
    return saved ? JSON.parse(saved) : defaultInventory;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('latmedical_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('latmedical_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('latmedical_orders', JSON.stringify(orders));
  }, [orders]);

  const updateStock = (productId: string, variantId: string | undefined, newStock: number) => {
    setInventory((prevInv) =>
      prevInv.map((item) => {
        if (item.productId !== productId) return item;
        if (item.hasVariants && variantId) {
          return {
            ...item,
            variants: item.variants.map((v) =>
              v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v
            )
          };
        } else {
          return { ...item, stock: Math.max(0, newStock) };
        }
      })
    );
  };

  const decrementStockForOrder = (items: OrderItem[]) => {
    setInventory((prevInv) =>
      prevInv.map((item) => {
        const orderItem = items.find((oi) => oi.productId === item.productId);
        if (!orderItem) return item;

        if (item.hasVariants && orderItem.variantName) {
          return {
            ...item,
            variants: item.variants.map((v) =>
              v.name === orderItem.variantName
                ? { ...v, stock: Math.max(0, v.stock - orderItem.quantity) }
                : v
            )
          };
        } else {
          return { ...item, stock: Math.max(0, item.stock - orderItem.quantity) };
        }
      })
    );
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `LM-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Pendiente'
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    decrementStockForOrder(newOrder.items);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter((o) => o.id !== orderId));
  };

  return (
    <InventoryContext.Provider value={{
      inventory,
      orders,
      updateStock,
      decrementStockForOrder,
      addOrder,
      updateOrderStatus,
      deleteOrder
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory debe utilizarse dentro de un InventoryProvider');
  }
  return context;
};

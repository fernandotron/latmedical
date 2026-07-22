import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultInventoryData from '../data/inventory.json';
import defaultOrdersData from '../data/orders.json';

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
  stockDecremented?: boolean;
  timestamp?: number;
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

const defaultInventory = defaultInventoryData as ProductInventory[];
const defaultOrders = defaultOrdersData as Order[];

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
    return saved ? JSON.parse(saved) : defaultOrders;
  });

  useEffect(() => {
    localStorage.setItem('latmedical_inventory', JSON.stringify(inventory));
    fetch('/api/save-inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inventory, null, 2)
    }).catch(err => console.error('Error saving inventory locally:', err));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('latmedical_orders', JSON.stringify(orders));
    fetch('/api/save-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orders, null, 2)
    }).catch(err => console.error('Error saving orders locally:', err));
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

  const incrementStockForOrder = (items: OrderItem[]) => {
    setInventory((prevInv) =>
      prevInv.map((item) => {
        const orderItem = items.find((oi) => oi.productId === item.productId);
        if (!orderItem) return item;

        if (item.hasVariants && orderItem.variantName) {
          return {
            ...item,
            variants: item.variants.map((v) =>
              v.name === orderItem.variantName
                ? { ...v, stock: v.stock + orderItem.quantity }
                : v
            )
          };
        } else {
          return { ...item, stock: item.stock + orderItem.quantity };
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
      status: 'Pendiente',
      stockDecremented: true,
      timestamp: Date.now()
    };

    decrementStockForOrder(newOrder.items);
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => {
        if (o.id !== orderId) return o;
        
        let stockDecremented = o.stockDecremented || false;
        
        if (status === 'Cancelado' && stockDecremented) {
          incrementStockForOrder(o.items);
          stockDecremented = false;
        } else if (status !== 'Cancelado' && !stockDecremented) {
          decrementStockForOrder(o.items);
          stockDecremented = true;
        }
        
        return { ...o, status, stockDecremented };
      })
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prevOrders) => {
      const orderToDelete = prevOrders.find((o) => o.id === orderId);
      if (orderToDelete && orderToDelete.stockDecremented) {
        incrementStockForOrder(orderToDelete.items);
      }
      return prevOrders.filter((o) => o.id !== orderId);
    });
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

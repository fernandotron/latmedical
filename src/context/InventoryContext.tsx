import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultInventoryData from '../data/inventory.json';
import defaultOrdersData from '../data/orders.json';
import defaultClearanceData from '../data/clearance.json';

export interface ClearanceOffer {
  id: string;
  productId: string;
  variantId?: string;
  variantName?: string;
  productName: string;
  brand: string;
  image: string;
  regularPrice: number;
  clearancePrice: number;
  stock: number;
  expiryDate: string; // e.g., "Octubre 2026"
  batchNumber?: string; // e.g., "LOTE-202610"
  note?: string;
  active: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  variantName?: string;
  quantity: number;
  price: number;
  isClearance?: boolean;
  clearanceId?: string;
  expiryDate?: string;
  batchNumber?: string;
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
  price?: number;
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
  clearanceOffers: ClearanceOffer[];
  updateStock: (productId: string, variantId: string | undefined, newStock: number, newPrice?: number) => void;
  decrementStockForOrder: (items: OrderItem[]) => void;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  addClearanceOffer: (offer: Omit<ClearanceOffer, 'id'>) => ClearanceOffer;
  updateClearanceOffer: (id: string, updated: Partial<ClearanceOffer>) => void;
  deleteClearanceOffer: (id: string) => void;
  toggleClearanceOffer: (id: string) => void;
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

  // Sync orders from server on mount so admin sees orders placed on all devices
  useEffect(() => {
    fetch(`/api/data/orders.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders((prevOrders) => {
            const map = new Map<string, Order>();
            prevOrders.forEach((o) => {
              if (o && o.id) map.set(o.id, o);
            });
            data.forEach((o: any) => {
              if (o && o.id) map.set(o.id, o);
            });
            const merged = Array.from(map.values());
            localStorage.setItem('latmedical_orders', JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch((err) => console.error('Error syncing remote orders:', err));
  }, []);

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

  const updateStock = (productId: string, variantId: string | undefined, newStock: number, newPrice?: number) => {
    setInventory((prevInv) =>
      prevInv.map((item) => {
        if (item.productId !== productId) return item;
        if (item.hasVariants && variantId) {
          return {
            ...item,
            variants: item.variants.map((v) =>
              v.id === variantId
                ? {
                    ...v,
                    stock: Math.max(0, newStock),
                    ...(newPrice !== undefined ? { price: Math.max(0, newPrice) } : {})
                  }
                : v
            )
          };
        } else {
          return { ...item, stock: Math.max(0, newStock) };
        }
      })
    );
  };

  const [clearanceOffers, setClearanceOffers] = useState<ClearanceOffer[]>(() => {
    const isV5 = localStorage.getItem('latmedical_clearance_v5');
    if (!isV5) {
      localStorage.setItem('latmedical_clearance_v5', 'true');
      localStorage.setItem('latmedical_clearance', JSON.stringify(defaultClearanceData));
      return defaultClearanceData as ClearanceOffer[];
    }
    const saved = localStorage.getItem('latmedical_clearance');
    return saved ? JSON.parse(saved) : (defaultClearanceData as ClearanceOffer[]);
  });

  // Sync clearance from server on mount with intelligent two-way merge
  useEffect(() => {
    fetch(`/api/data/clearance.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((remoteData) => {
        if (Array.isArray(remoteData) && remoteData.length > 0) {
          setClearanceOffers((prevLocal) => {
            const map = new Map<string, ClearanceOffer>();
            // 1. Initialize with server definitions (ensuring new images/titles take effect)
            remoteData.forEach((rItem: any) => {
              if (rItem && rItem.id) {
                const localItem = prevLocal.find(l => l.id === rItem.id);
                map.set(rItem.id, {
                  ...rItem,
                  ...(localItem ? { stock: localItem.stock, active: localItem.active } : {})
                });
              }
            });
            // 2. Keep any custom items created locally
            prevLocal.forEach((lItem) => {
              if (lItem && lItem.id && !map.has(lItem.id)) {
                map.set(lItem.id, lItem);
              }
            });
            const merged = Array.from(map.values());
            localStorage.setItem('latmedical_clearance', JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch((err) => console.error('Error syncing remote clearance offers:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('latmedical_clearance', JSON.stringify(clearanceOffers));
    fetch('/api/save-clearance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clearanceOffers, null, 2)
    }).catch(err => console.error('Error saving clearance locally:', err));
  }, [clearanceOffers]);

  const addClearanceOffer = (offerData: Omit<ClearanceOffer, 'id'>): ClearanceOffer => {
    const newOffer: ClearanceOffer = {
      ...offerData,
      id: `clr-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    setClearanceOffers(prev => [newOffer, ...prev]);
    return newOffer;
  };

  const updateClearanceOffer = (id: string, updated: Partial<ClearanceOffer>) => {
    setClearanceOffers(prev =>
      prev.map(item => item.id === id ? { ...item, ...updated } : item)
    );
  };

  const deleteClearanceOffer = (id: string) => {
    setClearanceOffers(prev => prev.filter(item => item.id !== id));
  };

  const toggleClearanceOffer = (id: string) => {
    setClearanceOffers(prev =>
      prev.map(item => item.id === id ? { ...item, active: !item.active } : item)
    );
  };

  const decrementStockForOrder = (items: OrderItem[]) => {
    // 1. Decrement regular inventory for non-clearance items
    setInventory((prevInv) =>
      prevInv.map((item) => {
        const orderItem = items.find((oi) => !oi.isClearance && oi.productId === item.productId);
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

    // 2. Decrement clearance stock for clearance items
    setClearanceOffers(prevClr =>
      prevClr.map(clr => {
        const clrOrderItem = items.find(oi => oi.isClearance && oi.clearanceId === clr.id);
        if (!clrOrderItem) return clr;
        return {
          ...clr,
          stock: Math.max(0, clr.stock - clrOrderItem.quantity)
        };
      })
    );
  };

  const incrementStockForOrder = (items: OrderItem[]) => {
    // 1. Increment regular inventory
    setInventory((prevInv) =>
      prevInv.map((item) => {
        const orderItem = items.find((oi) => !oi.isClearance && oi.productId === item.productId);
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

    // 2. Increment clearance stock
    setClearanceOffers(prevClr =>
      prevClr.map(clr => {
        const clrOrderItem = items.find(oi => oi.isClearance && oi.clearanceId === clr.id);
        if (!clrOrderItem) return clr;
        return {
          ...clr,
          stock: clr.stock + clrOrderItem.quantity
        };
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
      clearanceOffers,
      updateStock,
      decrementStockForOrder,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      addClearanceOffer,
      updateClearanceOffer,
      deleteClearanceOffer,
      toggleClearanceOffer
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

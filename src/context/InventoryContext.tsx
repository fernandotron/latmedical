import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultInventoryData from '../data/inventory.json';
import defaultOrdersData from '../data/orders.json';
import defaultClearanceData from '../data/clearance.json';
import { products } from '../data/products';

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
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'> & { status?: Order['status'] }) => Order;
  updateOrder: (orderId: string, updated: Partial<Order>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  restoreOrder: (order: Order) => void;
  addClearanceOffer: (offer: Omit<ClearanceOffer, 'id'>) => ClearanceOffer;
  updateClearanceOffer: (id: string, updated: Partial<ClearanceOffer>) => void;
  deleteClearanceOffer: (id: string) => void;
  restoreClearanceOffer: (offer: ClearanceOffer) => void;
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

  const getDeletedOrderIds = (): Set<string> => {
    try {
      const saved = localStorage.getItem('latmedical_deleted_order_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  };

  const [orders, setOrders] = useState<Order[]>(() => {
    const deletedIds = getDeletedOrderIds();
    const saved = localStorage.getItem('latmedical_orders');
    const initialList: Order[] = saved ? JSON.parse(saved) : defaultOrders;
    return initialList.filter(o => o && o.id && !deletedIds.has(o.id));
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
          const deletedIds = getDeletedOrderIds();
          setOrders((prevOrders) => {
            const map = new Map<string, Order>();
            prevOrders.forEach((o) => {
              if (o && o.id && !deletedIds.has(o.id)) map.set(o.id, o);
            });
            data.forEach((o: any) => {
              if (o && o.id && !deletedIds.has(o.id)) map.set(o.id, o);
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

  const sanitizeOffer = (o: ClearanceOffer): ClearanceOffer => {
    const pName = (o.productName || '').toLowerCase();
    const pId = (o.productId || '').toLowerCase();
    const oId = (o.id || '').toLowerCase();

    if (oId.includes('exosoma') || pId.includes('exosoma') || pName.includes('exosoma')) {
      return { ...o, image: '/images/products/exosomas-hair.png', brand: 'V-Lift Pro', productName: 'Exosomas E-50 Hair' };
    }
    if (oId.includes('elastica') || pId.includes('elastica') || pName.includes('elastica')) {
      return { ...o, image: '/images/products/elastica-hydroboost.png', brand: 'V-Lift Pro', productName: 'Elastica Hydroboost Dorada' };
    }
    return o;
  };

  const [clearanceOffers, setClearanceOffers] = useState<ClearanceOffer[]>(() => {
    const isV6 = localStorage.getItem('latmedical_clearance_v6');
    if (!isV6) {
      localStorage.setItem('latmedical_clearance_v6', 'true');
      const sanitized = (defaultClearanceData as ClearanceOffer[]).map(sanitizeOffer);
      localStorage.setItem('latmedical_clearance', JSON.stringify(sanitized));
      return sanitized;
    }
    const saved = localStorage.getItem('latmedical_clearance');
    const parsed = saved ? JSON.parse(saved) : (defaultClearanceData as ClearanceOffer[]);
    return parsed.map(sanitizeOffer);
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
                map.set(rItem.id, sanitizeOffer({
                  ...rItem,
                  ...(localItem ? { stock: localItem.stock, active: localItem.active } : {})
                }));
              }
            });
            // 2. Keep any custom items created locally
            prevLocal.forEach((lItem) => {
              if (lItem && lItem.id && !map.has(lItem.id)) {
                map.set(lItem.id, sanitizeOffer(lItem));
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

  const isMatchProduct = (invProductId: string, item: OrderItem): boolean => {
    if (!item) return false;
    if (item.productId && item.productId.toLowerCase() === invProductId.toLowerCase()) return true;
    const prod = products.find(p => p.id.toLowerCase() === invProductId.toLowerCase());
    if (prod && item.productName && prod.name.trim().toLowerCase() === item.productName.trim().toLowerCase()) return true;
    return false;
  };

  const isMatchVariant = (varName: string, orderVarName?: string): boolean => {
    if (!orderVarName) return false;
    return varName.trim().toLowerCase() === orderVarName.trim().toLowerCase();
  };

  const decrementStockForOrder = (items: OrderItem[]) => {
    if (!items || items.length === 0) return;

    // 1. Decrement regular inventory for non-clearance items
    setInventory((prevInv) =>
      prevInv.map((invItem) => {
        const matchingItems = items.filter((oi) => !oi.isClearance && isMatchProduct(invItem.productId, oi));
        if (matchingItems.length === 0) return invItem;

        if (invItem.hasVariants && invItem.variants && invItem.variants.length > 0) {
          return {
            ...invItem,
            variants: invItem.variants.map((v) => {
              const totalDeduct = matchingItems
                .filter((oi) => isMatchVariant(v.name, oi.variantName))
                .reduce((sum, oi) => sum + (oi.quantity || 0), 0);
              
              if (totalDeduct <= 0) return v;
              return {
                ...v,
                stock: Math.max(0, v.stock - totalDeduct)
              };
            })
          };
        } else {
          const totalDeduct = matchingItems.reduce((sum, oi) => sum + (oi.quantity || 0), 0);
          return { ...invItem, stock: Math.max(0, invItem.stock - totalDeduct) };
        }
      })
    );

    // 2. Decrement clearance stock for clearance items
    setClearanceOffers((prevClr) =>
      prevClr.map((clr) => {
        const matchingClrItems = items.filter((oi) => oi.isClearance && (oi.clearanceId === clr.id || (oi.productName && clr.productName && oi.productName.toLowerCase() === clr.productName.toLowerCase())));
        if (matchingClrItems.length === 0) return clr;
        const totalDeduct = matchingClrItems.reduce((sum, oi) => sum + (oi.quantity || 0), 0);
        return {
          ...clr,
          stock: Math.max(0, clr.stock - totalDeduct)
        };
      })
    );
  };

  const incrementStockForOrder = (items: OrderItem[]) => {
    if (!items || items.length === 0) return;

    // 1. Increment regular inventory
    setInventory((prevInv) =>
      prevInv.map((invItem) => {
        const matchingItems = items.filter((oi) => !oi.isClearance && isMatchProduct(invItem.productId, oi));
        if (matchingItems.length === 0) return invItem;

        if (invItem.hasVariants && invItem.variants && invItem.variants.length > 0) {
          return {
            ...invItem,
            variants: invItem.variants.map((v) => {
              const totalAdd = matchingItems
                .filter((oi) => isMatchVariant(v.name, oi.variantName))
                .reduce((sum, oi) => sum + (oi.quantity || 0), 0);
              
              if (totalAdd <= 0) return v;
              return {
                ...v,
                stock: v.stock + totalAdd
              };
            })
          };
        } else {
          const totalAdd = matchingItems.reduce((sum, oi) => sum + (oi.quantity || 0), 0);
          return { ...invItem, stock: invItem.stock + totalAdd };
        }
      })
    );

    // 2. Increment clearance stock
    setClearanceOffers((prevClr) =>
      prevClr.map((clr) => {
        const matchingClrItems = items.filter((oi) => oi.isClearance && (oi.clearanceId === clr.id || (oi.productName && clr.productName && oi.productName.toLowerCase() === clr.productName.toLowerCase())));
        if (matchingClrItems.length === 0) return clr;
        const totalAdd = matchingClrItems.reduce((sum, oi) => sum + (oi.quantity || 0), 0);
        return {
          ...clr,
          stock: clr.stock + totalAdd
        };
      })
    );
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'> & { status?: Order['status'] }) => {
    const newId = `LM-${Math.floor(100000 + Math.random() * 900000)}`;
    const deletedIds = getDeletedOrderIds();
    if (deletedIds.has(newId)) {
      deletedIds.delete(newId);
      localStorage.setItem('latmedical_deleted_order_ids', JSON.stringify(Array.from(deletedIds)));
    }

    const newOrder: Order = {
      ...orderData,
      id: newId,
      date: new Date().toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: orderData.status || 'Pendiente',
      stockDecremented: orderData.status !== 'Cancelado',
      timestamp: Date.now()
    };

    if (newOrder.status !== 'Cancelado') {
      decrementStockForOrder(newOrder.items);
    }
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => {
        if (o.id !== orderId) return o;
        
        let stockDecremented = o.stockDecremented ?? true;
        
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

  const updateOrder = (orderId: string, updatedData: Partial<Order>) => {
    setOrders((prevOrders) => {
      const existingOrder = prevOrders.find((o) => o.id === orderId);
      if (existingOrder && updatedData.items && existingOrder.stockDecremented) {
        // Reconcile stock: restore previous items and deduct new items
        incrementStockForOrder(existingOrder.items);
        decrementStockForOrder(updatedData.items);
      }
      return prevOrders.map((o) => {
        if (o.id !== orderId) return o;
        return { ...o, ...updatedData };
      });
    });
  };

  const deleteOrder = (orderId: string) => {
    // 1. Permanently record deleted ID so remote sync or reload never brings it back
    const deletedIds = getDeletedOrderIds();
    deletedIds.add(orderId);
    localStorage.setItem('latmedical_deleted_order_ids', JSON.stringify(Array.from(deletedIds)));

    setOrders((prevOrders) => {
      const orderToDelete = prevOrders.find((o) => o.id === orderId);
      // Restore stock only if order was previously decremented and not cancelled
      if (orderToDelete && (orderToDelete.stockDecremented ?? true) && orderToDelete.status !== 'Cancelado') {
        incrementStockForOrder(orderToDelete.items);
      }
      const updated = prevOrders.filter((o) => o.id !== orderId);
      localStorage.setItem('latmedical_orders', JSON.stringify(updated));
      return updated;
    });
  };

  const restoreOrder = (order: Order) => {
    // 1. Remove from deleted IDs
    const deletedIds = getDeletedOrderIds();
    deletedIds.delete(order.id);
    localStorage.setItem('latmedical_deleted_order_ids', JSON.stringify(Array.from(deletedIds)));

    // 2. Decrement stock if order is active and not cancelled
    if (order.status !== 'Cancelado') {
      decrementStockForOrder(order.items);
    }

    // 3. Add back to orders
    setOrders((prevOrders) => {
      if (prevOrders.some(o => o.id === order.id)) return prevOrders;
      const updated = [order, ...prevOrders];
      localStorage.setItem('latmedical_orders', JSON.stringify(updated));
      return updated;
    });
  };

  const restoreClearanceOffer = (offer: ClearanceOffer) => {
    setClearanceOffers((prev) => {
      if (prev.some(o => o.id === offer.id)) return prev;
      return [offer, ...prev];
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
      updateOrder,
      updateOrderStatus,
      deleteOrder,
      restoreOrder,
      addClearanceOffer,
      updateClearanceOffer,
      deleteClearanceOffer,
      restoreClearanceOffer,
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

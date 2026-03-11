import { create } from 'zustand';

export interface POSItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
  unitAr: string;
  stock: number;
}

interface POSStore {
  items: POSItem[];
  customerName: string;
  customerPhone: string;
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER';
  discount: number;
  amountPaid: number;
  addItem: (item: Omit<POSItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setPaymentMethod: (method: 'CASH' | 'CARD' | 'BANK_TRANSFER') => void;
  setDiscount: (discount: number) => void;
  setAmountPaid: (amount: number) => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  getChange: () => number;
  clearSale: () => void;
}

export const usePOSStore = create<POSStore>((set, get) => ({
  items: [],
  customerName: '',
  customerPhone: '',
  paymentMethod: 'CASH',
  discount: 0,
  amountPaid: 0,
  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },
  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
  },
  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, Math.min(quantity, i.stock)) } : i))
        .filter((i) => i.quantity > 0),
    }));
  },
  setCustomerName: (name) => set({ customerName: name }),
  setCustomerPhone: (phone) => set({ customerPhone: phone }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setDiscount: (discount) => set({ discount: Math.max(0, discount) }),
  setAmountPaid: (amount) => set({ amountPaid: amount }),
  getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  getTax: () => {
    const subtotal = get().getSubtotal();
    return subtotal * 0.17; // 17% VAT
  },
  getTotal: () => {
    const subtotal = get().getSubtotal();
    const tax = get().getTax();
    return subtotal + tax - get().discount;
  },
  getChange: () => Math.max(0, get().amountPaid - get().getTotal()),
  clearSale: () =>
    set({
      items: [],
      customerName: '',
      customerPhone: '',
      paymentMethod: 'CASH',
      discount: 0,
      amountPaid: 0,
    }),
}));

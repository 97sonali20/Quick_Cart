import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './productSlice';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  return { totalItems, totalAmount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          product,
          quantity,
        });
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.product.id !== productId);
        } else {
          item.quantity = quantity;
        }
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.product.id === action.payload);
      if (item) {
        item.quantity += 1;
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.product.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
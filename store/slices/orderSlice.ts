import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress: string;
}

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
};

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    items: [
      {
        id: '1',
        product: {
          id: '1',
          name: 'iPhone 15 Pro',
          description: 'Latest iPhone with A17 Pro chip',
          price: 999,
          image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
          category: 'Electronics',
          stock: 10,
          rating: 4.8,
        },
        quantity: 1,
      },
    ],
    totalAmount: 999,
    totalItems: 1,
    status: 'delivered',
    createdAt: '2024-01-15T10:30:00Z',
    deliveryAddress: '123 Main St, City, State 12345',
  },
  {
    id: '2',
    userId: '1',
    items: [
      {
        id: '3',
        product: {
          id: '3',
          name: 'Nike Air Max',
          description: 'Comfortable running shoes',
          price: 150,
          image: 'https://via.placeholder.com/300x300?text=Nike+Air+Max',
          category: 'Footwear',
          stock: 25,
          rating: 4.5,
        },
        quantity: 2,
      },
    ],
    totalAmount: 300,
    totalItems: 2,
    status: 'shipped',
    createdAt: '2024-01-20T14:45:00Z',
    deliveryAddress: '123 Main St, City, State 12345',
  },
];

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockOrders.filter(order => order.userId === userId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: {
    userId: string;
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
    deliveryAddress: string;
  }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOrder: Order = {
        ...orderData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      return newOrder;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const order = mockOrders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders cases
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create order cases
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch order by ID cases
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
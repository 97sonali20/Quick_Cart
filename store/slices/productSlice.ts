import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
};


export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      return data.products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const setSelectedProduct = createAsyncThunk(
  'products/setSelectedProduct',
  async (productId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { products: ProductState };
      const product = state.products.products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products cases
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Set selected product cases
      .addCase(setSelectedProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setSelectedProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
        state.error = null;
      })
      .addCase(setSelectedProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, setSelectedCategory, clearSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
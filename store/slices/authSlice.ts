import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }:any) => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 30,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return {
        user: {
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          image: data.image,
        },
        token: data.token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, firstName, lastName }: { email: string; password: string; firstName: string; lastName: string }, { rejectWithValue }:any) => {
    try {
      return {
        user: { 
          id: Date.now(), 
          email, 
          firstName, 
          lastName, 
          gender: 'male', 
          image: 'https://dummyjson.com/icon/default/128' 
        },
        token: 'mock-jwt-token-' + Date.now(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state:any) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state:any) => {
      state.error = null;
    },
  },
  extraReducers: (builder:any) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state:any) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state:any, action:any) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state:any, action:any) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state:any) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state:any, action:any) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state:any, action:any) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
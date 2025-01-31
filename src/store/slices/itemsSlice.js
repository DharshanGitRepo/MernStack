import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async ({ search, category } = {}, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/items`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, category },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createItem = createAsyncThunk(
  'items/createItem',
  async (itemData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${API_URL}/items`, itemData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, itemData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.patch(`${API_URL}/items/${id}`, itemData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${API_URL}/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedItem: null,
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch items';
      })
      // Create Item
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload.data);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create item';
      })
      // Update Item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item._id === action.payload.data._id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update item';
      })
      // Delete Item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete item';
      });
  },
});

export const { setSelectedItem, clearError } = itemsSlice.actions;
export default itemsSlice.reducer;

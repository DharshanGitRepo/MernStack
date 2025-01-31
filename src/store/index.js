import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import itemsReducer from './slices/itemsSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
  },
});

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import ProductSlices from "./slices/productSlices";
import userSlices from "./slices/userSlices";
import GlobalSettingSlices from "./slices/globalSettings";
import cartSlices from "./slices/cart";

// Combine all reducers into one
const rootReducer = combineReducers({
  product: ProductSlices,
  user: userSlices,
  settings: GlobalSettingSlices,
  cart:cartSlices
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user","settings","cart"], // ✅ Only persist 'user' slice
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const USER_INITIAL_STATE = {
  currentUser: null,
  error: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: USER_INITIAL_STATE,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    signInError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    signInSuccess: (state, action) => {
      state.error = null;
      state.loading = false;
      state.currentUser = action.payload;
    },
    signOutSuccess: (state) => {
      state.error = null;
      state.loading = false;
      state.currentUser = null;
    },
  },
});

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedStore = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedStore,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const { signOutSuccess, signInError, signInStart, signInSuccess } =
  userSlice.actions;
export const persistor = persistStore(store);

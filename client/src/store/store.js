import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const USER_INITIAL_STATE = {
  currentUser: null,
  error: null,
  loading: false,
};

const draftSlice = createSlice({
  name: "draft",
  initialState: { title: "", content: "" },
  reducers: {
    setDraft: (state, action) => {
      state.title = action.payload.title;
      state.content = action.payload.content;
    },
    clearDraft: (state) => {
      state.title = "";
      state.content = "";
    },
  },
});

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
  draft: draftSlice.reducer,
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

export const { setDraft, clearDraft } = draftSlice.actions;
export const persistor = persistStore(store);

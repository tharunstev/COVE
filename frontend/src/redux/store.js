
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import whoReducer from './slice'; 
import postReducer from './postSlice'; 


const persistConfig = {
  key: 'root',
  storage,
};


const rootReducer = combineReducers({
  who: whoReducer,
  post:postReducer,
 
});


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});


const persistor = persistStore(store);

export { store, persistor };

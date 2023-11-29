import { createStore, combineReducers } from 'redux';

// Define tu estado inicial y los reducers
interface AppState {
  valueGaia: number;
  // ... otras propiedades del estado
}

const initialState: AppState = {
  valueGaia: 100,
  // ... otras propiedades iniciales aquí
};

const rootReducer = (state: AppState = initialState, action: any,) => {
  switch (action.type) {
    case 'SET_VALUE_GAIA':
      return { ...state, valueGaia: action.payload };
    // ... otros casos y lógicas de reducer
    default:
      return state;
  }
};
// Combina los reducers si tienes más de uno
const combinedReducers = combineReducers({
  app: rootReducer,
  // ... otros reducers
});

// Crea la tienda Redux
const store = createStore(combinedReducers);

export type RootState = ReturnType<typeof combinedReducers>;

export  {store};
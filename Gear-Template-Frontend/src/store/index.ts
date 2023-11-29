import { createStore, combineReducers, Action } from 'redux';

// Define tu estado inicial y los reducers
interface AppState {
  valueGaia: number;
  // ... otras propiedades del estado
}

const initialState: AppState = {
  valueGaia: 100,
  // ... otras propiedades iniciales aquí
};

// Definir tipos de acciones
const SET_VALUE_GAIA = 'SET_VALUE_GAIA';

// Definir tipos de acciones
interface SetValueGaiaAction extends Action {
  type: typeof SET_VALUE_GAIA;
  payload: number;
}

// Otros tipos de acciones aquí

type AppActionTypes = SetValueGaiaAction;

// eslint-disable-next-line @typescript-eslint/default-param-last
const rootReducer = (state: AppState = initialState, action: AppActionTypes) => {
  switch (action.type) {
    case SET_VALUE_GAIA:
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

export { store };
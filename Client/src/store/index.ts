import { createStore, combineReducers, Action } from 'redux';



// Define tu interfaz de usuario
interface User {
  _id: any;
  address: any | null;
  bank_account_status: any | null;
  credentials: any | null;
  devices: any[];
  email: any;
  full_name: any | null;
  identification_number: any | null;
  identity_document: any | null;
  other_financial_documents: any | null;
  phone: any | null;
  secret_key: any | null;
  tax_declarations: any | null;
}

// Define tu estado inicial y los reducers
interface AppState {
  valueGaia: number;
  valueVara: number;
  loggedInUser: User | null;
  // ... otras propiedades del estado
}

const initialState: AppState = {
  valueGaia: 100,
  valueVara: 0,
  loggedInUser: null
  // ... otras propiedades iniciales aquí
};

// Definir tipos de acciones
const SET_VALUE_GAIA = 'SET_VALUE_GAIA';
const SET_VALUE_VARA = 'SET_VALUE_VARA';
const SET_LOGGED_IN_USER = 'SET_LOGGED_IN_USER';

interface SetValueGaiaAction extends Action<typeof SET_VALUE_GAIA> {
  payload: number;
}

interface SetValueVaraAction extends Action<typeof SET_VALUE_VARA> {
  payload: number;
}

interface SetLoggedInUserAction extends Action<typeof SET_LOGGED_IN_USER> {
  payload: User | null;
}

// Define la acción creadora
export const setLoggedInUser = (user: User | null): SetLoggedInUserAction => ({
  type: SET_LOGGED_IN_USER,
  payload: user,
});

// Definir tipos de acciones
type AppActionTypes = SetValueGaiaAction | SetValueVaraAction | SetLoggedInUserAction;

// eslint-disable-next-line @typescript-eslint/default-param-last
const rootReducer = (state: AppState = initialState, action: AppActionTypes): AppState => {
  switch (action.type) {
    case SET_VALUE_GAIA:
      return { ...state, valueGaia: action.payload };
    case SET_VALUE_VARA:
      return { ...state, valueVara: action.payload };
    case SET_LOGGED_IN_USER:
      return {
        ...state,
        loggedInUser: action.payload,
      };
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

import { createStore, combineReducers, Action } from 'redux';

// Define tu interfaz de usuario
interface User {
  find(arg0: (usuario: any) => boolean): unknown;
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

interface Energy {
  pvGenerationPower: any | 0;
  pvBattery: number | 0;
  devicesList: any | null;
  plantsList : any | null ;
  pvGenerationPerMonth: any | 0
}

// Define tu estado inicial y los reducers
interface AppState {
  valueGaia: number;
  valueVara: number;
  loggedInUser: User | null;
  pvGeneration: Energy | null; // Corregido el nombre de la propiedad
  // ... otras propiedades del estado
}

const initialState: AppState = {
  valueGaia: 100,
  valueVara: 0,
  loggedInUser: null,
  pvGeneration: null, // Corregido el nombre de la propiedad
  // ... otras propiedades iniciales aquí
};

// Definir tipos de acciones
const SET_VALUE_GAIA = 'SET_VALUE_GAIA';
const SET_VALUE_VARA = 'SET_VALUE_VARA';
const SET_LOGGED_IN_USER = 'SET_LOGGED_IN_USER';
const SET_PV_GENERATION_POWER = 'SET_PV_GENERATION_POWER';
const SET_PV_BATTERY = 'SET_PV_BATTERY';
const SET_PV_PER_MONTH = 'SET_PV_PER_MONTH';
const SET_PLANT_LIST = 'SET_PLANT_LIST';

interface SetValueGaiaAction extends Action<typeof SET_VALUE_GAIA> {
  payload: number;
}

interface SetValueVaraAction extends Action<typeof SET_VALUE_VARA> {
  payload: number;
}

interface SetLoggedInUserAction extends Action<typeof SET_LOGGED_IN_USER> {
  payload: User | null;
}

interface SetPvGenerationPowerAction extends Action<typeof SET_PV_GENERATION_POWER> {
  payload: any | null; // Corregido el tipo
}

interface SetPvBatteryAction extends Action<typeof SET_PV_BATTERY> {
  payload: any | null; // Corregido el tipo
}
interface SetPvGenerationPowerMonthAction extends Action<typeof SET_PV_PER_MONTH> {
  payload: any | null; // Corregido el tipo
}

interface SetPlantListAction extends Action<typeof SET_PLANT_LIST> {
  payload: any | null; // Corregido el tipo
}


// Crea las acciones para actualizar cada campo
export const setPvGenerationPower = (pvGenerationPower: any[] | null): SetPvGenerationPowerAction => ({
  type: SET_PV_GENERATION_POWER,
  payload: pvGenerationPower,
});

export const setPvGenerationPowerPerMonth = (pvGenerationPerMonth: any | null): SetPvGenerationPowerMonthAction => ({
  type: SET_PV_PER_MONTH,
  payload: pvGenerationPerMonth,
});

export const setPvBattery = (pvBattery: number | null): SetPvBatteryAction => ({
  type: SET_PV_BATTERY,
  payload: pvBattery,
});

export const setPlantList = (plantsList: any | null): SetPlantListAction => ({
  type: SET_PLANT_LIST,
  payload: plantsList,
});

// Define la acción creadora
export const setLoggedInUser = (user: User | null): SetLoggedInUserAction => ({
  type: SET_LOGGED_IN_USER,
  payload: user,
});

// Definir tipos de acciones
type AppActionTypes = SetValueGaiaAction | SetValueVaraAction | SetLoggedInUserAction | SetPvGenerationPowerAction | SetPvBatteryAction | SetPvGenerationPowerMonthAction | SetPlantListAction;

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
    case SET_PV_GENERATION_POWER:
      return {
        ...state,
        pvGeneration: {
          ...state.pvGeneration,
          pvGenerationPower: action.payload,
        },
      };
    case SET_PV_BATTERY:
      return {
        ...state,
        pvGeneration: {
          ...state.pvGeneration,
          pvBattery: action.payload,
        },
      };
      case SET_PV_PER_MONTH:
        return {
          ...state,
          pvGeneration: {
            ...state.pvGeneration,
            pvGenerationPerMonth: action.payload,
          },
        };
        case SET_PLANT_LIST:
          return {
            ...state,
            pvGeneration: {
              ...state.pvGeneration,
              plantsList: action.payload,
            },
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

// src/redux/actions.ts

import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

// Tipos para las acciones

interface FetchDataFailureAction extends Action<'FETCH_DATA_FAILURE'> {
  error: string;
}

// Tipo para las acciones asíncronas (Thunk)


// Acción asíncrona para cargar datos


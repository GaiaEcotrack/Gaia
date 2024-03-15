// src/redux/actions.ts
import axios from 'axios';
import { getAuth } from "firebase/auth";
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

// Tipos para las acciones

interface FetchDataFailureAction extends Action<'FETCH_DATA_FAILURE'> {
  error: string;
}


// Tipo para las acciones asíncronas (Thunk)


export const fetchUserData = () => {
  return async (dispatch, getState) => {
    try {
      const url = import.meta.env.VITE_APP_API_URL;
      const auth = getAuth();
      const user = auth.currentUser?.email;

      const request = await axios.get(`${url}/users/`);
      const response = request.data.users;
      const filter = response.filter(userLog => userLog.email === user);

      dispatch({ type: "SET_LOGGED_IN_USER", payload: filter });
    } catch (error) {
      console.log(error);
    }
  };
};

// Acción asíncrona para cargar datos


// // src/store/reducers/index.ts
 import { combineReducers } from 'redux';
// / Importa tus reductores aquí

 const rootReducer = combineReducers({
   // Agrega tus reductores aquí
 });

 export type RootState = ReturnType<typeof rootReducer>;

 export default rootReducer;
export {};

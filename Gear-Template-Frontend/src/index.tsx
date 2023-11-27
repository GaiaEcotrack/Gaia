import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from 'react-redux';
import store from './store/index';
import { App } from "./App";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

root.render(
  <Provider store={store}>
  <ChakraProvider>
    <App />
  </ChakraProvider>
  </Provider>
);

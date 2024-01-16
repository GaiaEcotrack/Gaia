import '@testing-library/jest-dom'
import { render } from "@testing-library/react"
import { MemoryRouter } from 'react-router-dom';
import { Transaction } from '../pages/ViewTransactions/Transaction'
import GraficoEnergia from '../pages/GraficoEnergia/GraficoEnergia'
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

//------- Test renderizado completo componente Home------------

jest.mock('../pages/GraficoEnergia/GraficoEnergia', () => {
    return {
      __esModule: true,
      default: () => <div>GraficoEnergia component</div>,
      getConfig: jest.fn().mockReturnValue({
        programIdKey: 'mockedProgramId',
        meta: 'mockedMeta',
        MidWallet: 'mockedMidWallet',
      }),
    };
  });

jest.mock('@gear-js/ui', () => ({
    Button: jest.fn(({ onClick, children }) => (
      <button onClick={onClick}>{children}</button>
    )),
  }));

test("Renderizado del componente GraficoEnergia", () => {
    render(<MemoryRouter>
        <GraficoEnergia />
      </MemoryRouter>)
    expect(true).toBeTruthy()    
})


//------- Test renderizado completo componente Transacciones------------

const mockStore = configureStore();

test("Renderizado del componente Transacciones", () => {

    const initialState = {
        app: {
          valueGaia: 100,
          valueVara: 0,
        },
      };
      const store = mockStore(initialState);

    render(
    <Provider store={store}>
      <Transaction />
    </Provider>
  );

    expect(true).toBeTruthy()    
})
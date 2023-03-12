
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
//Importo firebase para implementar autenticação com google.

import {AuthContextProvider} from './contexts/AuthContext';

function App() {



    return (
      <BrowserRouter> 
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Home/>} /> 
            <Route path="/rooms/new" element={<NewRoom/>} />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    );
}
  //Desta forma tudo que estiver dentro do provider vai conseguir enxergar o valor do contexto
  //Obs: Exact (valor true) diz que o endereço precisa ser exatamente "/", para que nao haja ruidos com outros enderecos comecando por "/", ou serao mostradas todas a paginas com / de uma so vez

export default App;

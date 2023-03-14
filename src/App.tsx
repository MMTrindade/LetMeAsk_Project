
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

//Importo firebase para implementar autenticação com google.

import {AuthContextProvider} from './contexts/AuthContext';
import { Room } from './pages/Room';

function App() {



    return (
      <BrowserRouter> 
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Home/>} /> 
            <Route path="/rooms/new" element={<NewRoom/>} />
            <Route path="/rooms/:id" element={<Room/>} />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    );
}
  //Desta forma tudo que estiver dentro do provider vai conseguir enxergar o valor do contexto
  //Obs: Exact (valor true) diz que o endereço precisa ser exatamente "/", para que nao haja ruidos com outros enderecos comecando por "/", ou serao mostradas todas a paginas com / de uma so vez
//:id retorna o componente room e passa pra dentro um parametro id que e tudo que tem depois da barra (check ID em Firebase)
export default App;

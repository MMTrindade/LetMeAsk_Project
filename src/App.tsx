//Autoimort: Identifica a importação do componente Home e faz de forma automática
//contexto permite features como autenticação funcionarem em todas as páginas sem precisar repetir o código
import {useState} from 'react'
import {createContext} from 'react'
import { BrowserRouter, Route, Routes, RouteProps } from 'react-router-dom';
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

//Implementando contexto -> string valor inicial
export const AuthContext = createContext({} as any);

function App() {
const [user, setUser] =  useState('Teste');

  return (
    <BrowserRouter> 
      <AuthContext.Provider value={{value,setValue}}>
        <Routes>
          <Route path="/" element={<Home/>} /> 
          <Route path="/rooms/new" element={<NewRoom/>} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}
//Desta forma tudo que estiver dentro do provider vai conseguir enxergar o valor do contexto
//Obs: Exact (valor true) diz que o endereço precisa ser exatamente "/", para que nao haja ruidos com outros enderecos comecando por "/", ou serao mostradas todas a paginas com / de uma so vez

export default App;

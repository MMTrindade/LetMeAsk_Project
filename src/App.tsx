//Autoimort: Identifica a importação do componente Home e faz de forma automática

import { BrowserRouter, Route } from 'react-router-dom';
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

function App() {
  return (
    <BrowserRouter>
     <Route path="/" exact component={Home} /> 
     <Route path="/rooms/new" component={NewRoom} />
    </BrowserRouter>
  );
}
//Obs: Exact (valor true) diz que o endereço precisa ser exatamente "/", para que nao haja ruidos com outros enderecos comecando por "/", ou serao mostradas todas a paginas com / de uma so vez

export default App;

//Autoimort: Identifica a importação do componente Home e faz de forma automática> Command, aceitar importacoes automaticas
//contexto permite features como autenticação funcionarem em todas as páginas sem precisar repetir o código
//useEffect e um hook para disparo de efeitos colaterais, quando quero disparar uma funcao sempre que algo acontecer, ex: uma informacao mudou.
//import firebase from "firebase/compat";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
  }
  
type AuthContextType = {
    user: User | undefined; //No primeiro momento nao existe usuario logado, logo ele e undefined!
    signInWithGoogle: () => Promise <void>; //Toda funcao assincrona retorna uma promessa e void - Funcao que nao tem parametros no () e tambem nao tem return dentro dela 
  }
  
type AuthContextProviderProps = {
    children: ReactNode;
}
//children faz referencia a elements das routes, que sao elementos do react, aos quais me refiro com ReactNode, que precisa ser importado.

//Implementando contexto -> string valor inicial
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props : AuthContextProviderProps) {

    const [user, setUser] =  useState<User>();

    //useEffect: Caso onAuthStateChanged, em contato com firebase, detectar que usuario havia logado anteriormente, vai manter o nome do usuario logado mediante a atualizacao da pagina
    //Boa pratica: Toda vez que se declara um eventlistener no React e recomendado que se use uma variavel, e tambem criar um retorno que te descadastre de todos os event listeners usado
    
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) { //Se foi resultado um usuario dessa autenticacao, then..
          const {displayName, photoURL, uid} = user
  
          //Se o user nao tenha nome ou foto, a aplicacao nao vai funcionar
          if (!displayName || !photoURL) {
            throw new Error('Missing information from Google Account.');
            }
  
            setUser({
              id: uid,
              name: displayName,
              avatar:photoURL
            })
        }
      })
  
      return () => {
        unsubscribe();
      }
  
    }, []) //Primerio qual funcao eu quero executar, segundo quando <Array> que eu quero executar essa funcao, qual parametro que vai mudar e ser trigger para disparar a funcao, se eu deixar o array vazio, ela dispara uma unica vez
  
    async function signInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      
      const result = await auth.signInWithPopup(provider);
      //signInwithPopup: Fazer autenticação direto com Poupup na tela, ao inves de redirecionar o cliente.
      
      if (result.user) { //Se foi resultado um usuario dessa autenticacao, then..
        const {displayName, photoURL, uid} = result.user
  
        //Se o user nao tenha nome ou foto, a aplicacao nao vai funcionar
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar:photoURL
          })
        }
            
    }
  
    //Jogando signInWithGoogle a AuthContext, leva a autenticacao a todas as paginas --gracas a API de contexto!!!
    return (
        <AuthContext.Provider value={{ user, signInWithGoogle}}> 
            {props.children}
        </AuthContext.Provider>
    )
}
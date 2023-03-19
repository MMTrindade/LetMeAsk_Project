//Onde faco o carregamento das perguntas
//Crio hook quando desejo padronizar funcionalidades, e componentes para elementos visuais.
//Trago para este hook todas as funcionalidades que irao funcionar da mesma forma tanto para a sala do usuario quanto do admin.

import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

//Para declarar tipagem de objetos no TS uso Record<tipo da chave, tipo do valor - que nesse caso e outro objeto>
type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string; 
    isAnswered: boolean;
    isHighlighted: boolean;
    //likes - are objects, with a key as string.
    likes: Record<string, {
        authorId: string;
    }>
}>

type Question = {
    id:string;
    author: {
        name: string;
        avatar: string;
    }
    content: string; 
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

export function useRoom (roomId: string | undefined) {
    const { user} = useAuth();
    const [questions, setQuestions] = useState<Question[]>([])
    const [title, setTitle] = useState('');

        //useEffect, dispara um evento sempre que alguma informacao mudar
        useEffect(() => {
            const roomRef = database.ref(`rooms/${roomId}`);
            
            //Seguindo a documentacao do Firebase, digo ao Firebase que estou ouvindo um evento faz-se:
            //.val e uma API do Firebase para buscar os valores que estao dentro da room
            //roomRef.on -> toda vez que roomId mudar, ele vai executar o codigo abaixo novamente, e substituir as informacoes em tela
            roomRef.on('value', room => {
                const databaseRoom = room.val();
                const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
                
                //Implementando um "Hashmap". Object. entries em um objeto retorna um array com cada posicao contendo key e value de um objeto.
                const parsedQuestions= Object.entries(firebaseQuestions).map(([key, value]) => {
                    return {
                        id: key,
                        content: value.content,
                        author: value.author,
                        isHighlighted: value.isHighlighted,
                        isAnswered: value.isAnswered,
                        likeCount: Object.values(value.likes ?? {}).length, //Os likes podem vir vazios, caso nao tenha nada: ?? {}
                        //hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id) //some percorre o array atr encontrar uma condicao que satisfaca o que foi passado pra ele e retorna true ou false, enquanto find retorna o conteudo
                        likeId: Object.entries(value.likes ?? {}).find(([key,like]) => like.authorId === user?.id)?.[0], // A propriedade 0 e onde esta o id do like. ? verifica se nao retornou nada, gera nulo, ele nem tentara retornar a posicao 0, em caso positivo, ele acessa a posicao 0.
                    }
                })
    
                setTitle(databaseRoom.title);
                setQuestions(parsedQuestions)
                
            })
            //Sempre preciso dar off/unsubscribe ao fim do useEffect pra remover todos os event listeners, e no ficar dando erro.
            return () => {
                roomRef.off('value');
            }

        }, [roomId, user?.id]); //Array de dependencias do useEffect, preciso passar toda variavel externa ao useEffect que uso como condicao dentro do codigo.
    
    return {questions, title}
}
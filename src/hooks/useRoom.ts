//Crio hook quando desejo padronizar funcionalidades, e componentes para elementos visuais.
//Trago para este hook todas as funcionalidades que irao funcionar da mesma forma tanto para a sala do usuario quanto do admin.

import { useEffect, useState } from "react";
import { database } from "../services/firebase";

//Para declarar tipagem de objetos no TS uso Record<tipo da chave, tipo do valor - que nesse caso e outro objeto>
type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string; 
    isAnswered: boolean;
    isHighlighted: boolean;
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
}

export function useRoom (roomId: string | undefined) {
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
                
                //Implementando um "Hashmap". Object. entries em um objeto retorna um array com cada posicao contendo ckey e value de um onjeto.
                const parsedQuestions= Object.entries(firebaseQuestions).map(([key, value]) => {
                    return {
                        id: key,
                        content: value.content,
                        author: value.author,
                        isHighlighted: value.isHighlighted,
                        isAnswered: value.isAnswered,
                    }
                })
    
                setTitle(databaseRoom.title);
                setQuestions(parsedQuestions)
                
            })
        }, [roomId]);
    
    return {questions, title}
}
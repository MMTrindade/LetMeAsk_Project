import { useParams } from "react-router-dom";
import { Button } from "../components/Button";
import  logoImg  from "../assets/images/logo.svg";
import {RoomCode} from '../components/RoomCode'
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

import '../styles/room.scss'

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

type RoomParams = {
    id: string;
}

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

//Os parametros da minha pagina ficarao armazenados em params, quero manter o codigo da pagina.
export function Room(){ 
    const {user} = useAuth();
    const params = useParams<RoomParams>(); //Generics: Para que a funcao saiba quais os parametros que a rota params vai receber
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState('');
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


    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();
//preventDeafault garante que o site nao ira recarregar a tela desnecessariamente
        if (newQuestion.trim() === '') {
            return;
        }
    
        if (!user) {
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighLighted:false,
            isAnswered: false,
        };

//Na database tenho authorID e title contendo informacoes da sala. Com /questions, crio mais um elemento, e faco push da const question criada acima
        await database.ref(`rooms/${roomId}/questions`).push(question);
    
        setNewQuestion('');//Apos o envio da pergunta, modifico o estado do newQuestion na area de texto para vazio pois a pergunta ja foi enviada.
    }

    return(
        <div id='page-room'>
            <header>
                <div className='content'>
                    <img src={logoImg} alt='Letmeask'/>
                    {/*<RoomCode code={params.id}/> disponibiliza o codigo no header da sala, mas esta dando erro*/} 
                </div>
            </header>

            
            <main className='content'>
                <div className='room-title'>
                    <h1>{title}</h1> 
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>} {/*if condicao && signigfica then consequencia*/}
                </div>

                    {/*Pega o valor do input conforme ele e digitado*/}
                <form onSubmit={handleSendQuestion}>
                    <textarea 
                    placeholder='O que você quer perguntar?'
                    onChange={event => setNewQuestion(event.target.value)}
                    value={newQuestion}
                    />

                    <div className='form-footer'>
                        { user ? ( /* if ->? condicao else -> : consequencia*/
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        
                        <Button type='submit' disabled={!user}>Enviar pergunta </Button>
                    </div>
                </form>

                {/*JSON.stringify(questions)*/}
            </main>
        </div>

    );
}

//Improvement opportunity: Value updates the whole list whenever one single information is changed. If the page has 1000 questions, for example, it can make the platform slow. Check on /child added/child changed/ on firebase.
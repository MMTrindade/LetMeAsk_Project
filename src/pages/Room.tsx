import { useParams } from "react-router-dom";
import { Button } from "../components/Button";
import  logoImg  from "../assets/images/logo.svg";
import {RoomCode} from '../components/RoomCode'
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

import '../styles/room.scss'
import { Question } from "../components/Questions/Question";
import { useRoom } from "../hooks/useRoom";


type RoomParams = {
    id: string;
}


//Os parametros da minha pagina ficarao armazenados em params, quero manter o codigo da pagina.
export function Room(){ 
    const {user} = useAuth();
    const params = useParams<RoomParams>(); //Generics: Para que a funcao saiba quais os parametros que a rota params vai receber
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState('');
    
    const {title, questions} = useRoom(roomId)
    


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

                {/*Unica forma de percorrer um array e retornar cada item desse array como um componente-metodo map, funciona como um for each, que itera sobre o array, mas map permite retornar items do array tambem. O que e retornado e o conteudo de cada question*/}
                {/* Toda vez que se usa o map, precisa-se passar ao primeiro elemento do componente uma key, e atribuir uma info unica dentro dela, como question.id, para que o react consiga identificar a diferenca de um item pro outro>Algoritmo de reconciliacao. Em caso contrario, o react monta tudo de novo*/ }
                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}  
                                author={question.author}
                            />
                        )
                    })}
                </div>
                
            </main>
        </div>

    );
}

//Improvement opportunity: Value updates the whole list whenever one single information is changed. If the page has 1000 questions, for example, it can make the platform slow. Check on /child added/child changed/ on firebase.
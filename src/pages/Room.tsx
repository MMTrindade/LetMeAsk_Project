import { useParams } from "react-router-dom";
import { Button } from "../components/Button";
import  logoImg  from "../assets/images/logo.svg";
import {RoomCode} from '../components/RoomCode'
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

import '../styles/room.scss'
import { Question } from "../components/Questions/Question";
//useRoom hook para carregamento de dados na sala
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
    //Uso  o hook useRoom todas as funcionalidades que irao funcionar da mesma forma tanto para a sala do usuario quanto do admin.
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

    //Function for like functionality
    //questionId - which question is going to receive the like
    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
        if (likeId) { //neste caso se clicar novamente quero que remova o like
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
                
        } else {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user?.id, //so vai tentar acessar o id do usuario caso o usuario realmente exista
            })
        }
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
                            >

                                <button //Se hasLiked for true, entao add liked, senao mantem em branco
                                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                                    type="button"
                                    aria-label="Marcar como gostei"
                                    //Para passar uma funcao que precisa de um parametro, sempre usar arrow function, caso contrario e como se passasse uma funcao ja executada, nao exatamente uma funcao.
                                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                                >   
                                    {/*Somente quero mostrar os likes se o contador for maior que zero*/}
                                    {question.likeCount > 0 && <span>{question.likeCount}</span> }
                                    {/*svg e imagem do like, coloco o codigo para conseguir mudar a cor*/}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>

                                </button>

                            </Question>
                        )
                    })}
                </div>
                
            </main>
        </div>

    );
}

//Improvement opportunity: Value updates the whole list whenever one single information is changed. If the page has 1000 questions, for example, it can make the platform slow. Check on /child added/child changed/ on firebase.
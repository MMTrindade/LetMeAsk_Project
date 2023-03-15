
import { useState } from 'react';

import {FormEvent} from 'react';
//Hook para migrar entre páginas, No caso newRoom e uma ancora, entao uso link to, ao inves de navigate.

import { Link, useNavigate } from 'react-router-dom';

//Importing images through webpack
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/googleicon.svg';
//Importing files
import '../styles/auth.scss';
//Importing componentes(Remember: components always start with capital letter)
import { Button } from '../components/Button';
import { database } from '../services/firebase';
//Hook para usar um contexto criado (UseContext & AuthContext)
import { useAuth } from '../hooks/useAuth';

export function NewRoom () {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    //const { user } = useContext(AuthContext);
    const [newRoom, setNewRoom] = useState(" ");
//newRoom foi passado no input, caso a variavel mude isso vai refletir la tbm

    async function handleCreateRoom(event:FormEvent) {
        event.preventDefault();
//trim remove os espacos em ambos os lados
//return caso o valor seja vazio, nao quero deixar criar uma sala sem nome
        if (newRoom.trim() == '') {
            return;
        }
        //Estou me referindo a um dado da database aqui, e la dentro vou ter uma categoria que se chama rooms
        const roomRef = database.ref('rooms');
//procurei uma ref rooms, e dentro dela faco um push>Jogo uma info para dentro de rooms (uma nova sala)
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })
//key aqui se trata do id da sala, pra garantir que cda usuario caia na sua sala criada
        navigate(`/rooms/${firebaseRoom.key}`)

    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong> Crie salas de Q&amp;A ao-vivo</strong> 
                <p> Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main> 
                <div className="main-content"> 
                    <img src={logoImg} alt="Letmeask" />

                    <h2>Criar uma Nova Sala</h2>

                    <div className="separator" >ou entre em uma sala</div>

                    <form onSubmit={handleCreateRoom}>

                        <input type = "text" placeholder= "Nome da Sala" onChange={event => setNewRoom(event.target.value)} value={newRoom}/>

                        <Button type="submit">Criar Sala</Button>

                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}//event atualiza o valor do input toda vez que o usuario digita algo nele

// ? is called an optional chaining, used after an oject for the case the property name doesn't exist, it'll return undefined, instead of throwing a  big error.
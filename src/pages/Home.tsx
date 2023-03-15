//Hook para usar um contexto criado
import { FormEvent, useContext, useState } from 'react';
//Hook para migrar entre páginas, vinculo a uma função e adiciono um "on click " com a função
import { useNavigate } from 'react-router-dom';
//Importo firebase para implementar autenticação com google.
import { auth, database, firebase } from '../services/firebase'
//Importing images through webpack
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/googleicon.svg';
//Importing files
import '../styles/auth.scss';
//Importing componentes(Remember: components always start with capital letter)
import { Button } from '../components/Button';
//Importing Context functionalities created in App
import {useAuth} from '../hooks/useAuth'


export async function Home () {
    const navigate = useNavigate();
    const { user, signInWithGoogle } = useAuth()
    const [ roomCode, setRoomCode ] = useState('');

    //Autenticação do usuário com Firebase/Verifica se o usuario nao existe=se nao esta logado, dai direciona para a autenticacao
    async function handleCreateRoom () {
        if (!user) {
            await signInWithGoogle()
        }
        navigate('/rooms/new');
    }

    //Para todo formulario no React preciso dar um preventDefault
    //Confirguracao para acessar sala
    async function handleJoinRoom (event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }
    }
    
    //Verificando se a sala que o usuario quer existe. Get acessa todos os dados da room.
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    //Se o que estiver dentro dos parenteses for true, ele envia o alerta. A propriedade exists vai indicar false no caso de roomRef nao existir, e a ! tambem gera false automaticamente, logo o resultado e true.
    if (!roomRef.exists()) {
        alert ('Room does not exist.');
        return;
    }

    navigate(`/rooms/${roomCode}`);

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

                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src = {googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>

                    <div className="separator" >ou entre em uma sala</div>

                    <form>

                        <input type = "text" placeholder= "Digite o código da sala" onChange={event => setRoomCode(event.target.value)} value = {roomCode}/>

                        <Button type="submit">Entrar na Sala</Button>

                    </form>
                </div>
            </main>
        </div>
    )
}
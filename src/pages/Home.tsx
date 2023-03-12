//Hook para usar um contexto criado
import { useContext } from 'react';
//Hook para migrar entre páginas, vinculo a uma função e adiciono um "on click " com a função
import { useNavigate } from 'react-router-dom';
//Importo firebase para implementar autenticação com google.
import { auth, firebase } from '../services/firebase'
//Importing images through webpack
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/googleicon.svg';
//Importing files
import '../styles/auth.scss';
//Importing componentes(Remember: components always start with capital letter)
import { Button } from '../components/Button';
//Importing Context functionalities created in App
import { AuthContext } from '../contexts/AuthContext';


export function Home () {
    const navigate = useNavigate();
    const { user, signInWithGoogle } = useContext (AuthContext)

    //Autenticação do usuário com Firebase
    async function handleCreateRoom () {
        if (!user) {
            await signInWithGoogle()
        }
        navigate('/rooms/new');
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

                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src = {googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>

                    <div className="separator" >ou entre em uma sala</div>

                    <form>

                        <input type = "text" placeholder= "Digite o código da sala"/>

                        <Button type="submit">Entrar na Sala</Button>

                    </form>
                </div>
            </main>
        </div>
    )
}
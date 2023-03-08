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
import { TestContext } from '../App'

export function Home () {
    const navigate = useNavigate();
    const value = useContext(TestContext);

    //Autenticação do usuário com Firebase
    function handleCreateRoom () {
        const provider = new firebase.auth.GoogleAuthProvider();
        //signInwithPopup: Fazer autenticação direto com Poupup na tela, ao inves de redirecionar o cliente.
        auth.signInWithPopup(provider).then(result => {
            console.log(result);
        })
    }

    function navigateToNewRoom () {
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
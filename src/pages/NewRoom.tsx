//Hook para usar um contexto criado
import { useContext } from 'react';
//Importing Context functionalities created in App
import { TestContext } from '../App'
//Hook para migrar entre páginas, No caso newRoom e uma ancora, entao uso link to, ao inves de navigate.

import { Link } from 'react-router-dom';

//Importing images through webpack
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/googleicon.svg';
//Importing files
import '../styles/auth.scss';
//Importing componentes(Remember: components always start with capital letter)
import { Button } from '../components/Button';

export function NewRoom () {
    const value = useContext(TestContext);
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

                    <form>

                        <input type = "text" placeholder= "Nome da Sala"/>

                        <Button type="submit">Criar Sala</Button>

                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}
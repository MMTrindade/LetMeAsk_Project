import './question.scss';
//Importo ReactNode quando quero usar tipagem pra children para um conteudo JSX, ex: no caso de QuestionPropd, o conteudo de children e um HTML (no componente Question.tsx)
import { ReactNode} from'react';

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
    children?: ReactNode;
}

export function Question({
    content, 
    author,
    children
}: QuestionProps) {
    return (
        <div className="question">
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    );
}
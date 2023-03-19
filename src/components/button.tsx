import { ButtonHTMLAttributes } from 'react'

import '../styles/button.scss'

//Tipagem do elemento do botao e global, button HTMLAttributes vem de dentro do React.
//React exporta uma tipagem para butoes, checar definicoes para ver
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>  & {
    isOutlined?: boolean
};
// ...props = "Rest Operator", significa que tudo que nao for isOutlined e jogado dentro de ...props
//Como isOutlined e opcional(?), quando ele nao estiver definido coloco o valor como falso
export function Button ({isOutlined = false, ...props }: ButtonProps) {
    return (
        <button //Caso a classe isOutlined exista, vou colocar uma classe a mais chamada outlined, senao nao coloco classe nenhuma
        className={`button ${isOutlined ? 'outlined' : ''}`} 
        {...props} /> //tecnica "spread operator" -> distribui as props do parametro para o botao
    )
}


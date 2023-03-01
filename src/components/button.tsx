import { ButtonHTMLAttributes } from 'react'

import '../styles/button.scss'

//Tipagem do elemento do botao e global
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>; //React exporta uma tipagem para butoes, checar definicoes para ver

export function Button (props: ButtonProps) {
    return (
        <button className="button" {...props} /> //tecnica "spread operator" -> distribui as props do parametro para o botao
    )
}


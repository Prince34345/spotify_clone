import { forwardRef } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {

}

const Button = forwardRef<HTMLButtonElement, ButtonProps>

Button.displayName = 'Button'

export default Button
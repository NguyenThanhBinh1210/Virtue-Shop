import { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  children: React.ReactNode
}

const Button = ({ children }: Props) => {
  const navigate = useNavigate()
  const checkType = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (e.currentTarget.textContent === 'Trở về') {
      navigate('/')
    }
  }
  return (
    <button
      onClick={(e) => checkType(e)}
      className={`bg-primary text-4 font-[600]  text-white h-[52px] rounded-[10px]  w-[191px] hover:opacity-90`}
    >
      {children}
    </button>
  )
}

export default Button

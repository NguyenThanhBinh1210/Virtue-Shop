import type { UseFormRegister } from 'react-hook-form'

interface Props {
  errrorMessage?: string
  placeholder?: string
  name: string
  inputPassword: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
}
const Input = ({ errrorMessage, inputPassword, placeholder, name, register }: Props) => {
  return (
    <div className='mb-[10px] '>
      <label>
        <p className={`mb-[10px] mobile:text-[14px] dark:text-text-color`}>{name} *</p>
        <input
          type={inputPassword ? 'password' : 'text'}
          {...register(name)}
          className={` dark:bg-transparent dark:border-[#3A3A43] dark:text-text-color rounded-lg border  h-[52px] w-full pl-[25px] ${
            errrorMessage ? 'border-[#EB5757]' : 'border-[#F1F1F3]'
          }`}
          placeholder={placeholder}
        />
      </label>
    </div>
  )
}

export default Input

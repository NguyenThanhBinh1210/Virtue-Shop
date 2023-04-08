/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useMutation } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { userResetPassword } from 'src/apis/auth.api'

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const changePassFrom = location.state?.changePassFrom
  const [passwordState, setPasswordState] = useState<string>('')
  const registerMutation = useMutation({
    mutationFn: () => {
      const body = {
        email: changePassFrom.email,
        password: passwordState,
        otp: changePassFrom.otp
      }
      return userResetPassword(body)
    },
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!')
      navigate('/login')
    },
    onError: (e: any) => {
      toast.warn(e.response.data.message)
    }
  })
  const handleSubmit = (e: any) => {
    e.preventDefault()
    registerMutation.mutate()
  }
  return (
    <div className='mx-auto w-[455px] mobile:w-full dark:bg-[#1C1C24] shadow-lg rounded-lg px-[35px] py-[50px] '>
      <h1 className='font-[700] text-[25px] mb-[25px] dark:text-white'>Tạo mật khẩu mới</h1>
      <div>
        <span className='text-text-color leading-7'>Mật khẩu mới sẽ không trùng với mật khẩu trước đó.</span>
        <form onSubmit={handleSubmit} className='mt-[20px]'>
          <div className='mb-[10px]'>
            <label>
              <p className={`mb-[10px] mobile:text-[14px] dark:text-text-color `}>Nhập mật khẩu mới *</p>
              <input
                className={` dark:bg-transparent dark:text-text-color dark:border-[#3A3A43] rounded-lg border  h-[52px] w-full pl-[25px] 
                'border-[#F1F1F3]'
              `}
                placeholder={'•••••••••'}
                required
                type='text'
                value={passwordState}
                onChange={(e) => setPasswordState(e.target.value)}
              />
            </label>
          </div>
          <button
            className={`bg-primary text-4 font-[600] text-white h-[52px] rounded-[10px]  w-full hover:opacity-90`}
          >
            Tiếp theo
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword

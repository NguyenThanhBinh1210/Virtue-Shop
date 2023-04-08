/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import OtpInput from 'react18-input-otp'
import { registerAccount, verifyAccount } from 'src/apis/auth.api'
const VerifyEmailByLogin = () => {
  const location = useLocation()
  const [count, setCount] = useState(Number(localStorage.getItem('count')) || 60)
  const registerForm = location.state?.registerForm
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()
  const handleChange = (enteredOtp: any) => {
    setOtp(enteredOtp)
  }
  const registerMutation = useMutation({
    mutationFn: () => {
      return registerAccount({ ...registerForm, otp })
    },
    onSuccess: () => {
      toast.success('Đăng kí thành công!')
      localStorage.removeItem('temp')
      navigate('/login')
    },
    onError: () => {
      toast.warn('OTP Không chính xác hoặc đã quá hạn!')
    }
  })
  const resendOtpMutation = useMutation({
    mutationFn: () => {
      return verifyAccount(registerForm)
    },
    onSuccess: () => {
      toast.success('Đã gửi lại OTP!')
    }
  })
  const handleVerify = () => {
    registerMutation.mutate()
  }

  const handleReSendOtp = () => {
    localStorage.setItem('count', '60')
    setCount(Number(localStorage.getItem('count')))
    setOtp('')
    resendOtpMutation.mutate()
  }
  const handleBack = () => {
    localStorage.removeItem('temp')
    navigate('/register')
  }

  // Timeout
  const isDisable = Boolean(count)
  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined
    if (count > 0) {
      timer = setTimeout(() => {
        localStorage.setItem('count', String(count - 1))
        setCount(Number(localStorage.getItem('count')))
      }, 1000)
    } else {
      localStorage.removeItem('count')
      setCount(0)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [count])
  return (
    <div className='mx-auto w-[455px] dark:bg-[#1C1C24] mobile:w-full shadow-lg rounded-lg px-[35px] py-[50px] '>
      <h1 className='font-[700] text-[25px] mb-[25px] dark:text-white'>Email Verification</h1>
      <div>
        <span className='text-text-color leading-7'>Hãy nhập mã OTP được gửi về</span>
        <div className='dark:text-white'>{registerForm?.email || 'thanhbinh@gmail.com'} </div>
        <OtpInput
          inputStyle={{
            width: '51px',
            borderRadius: '5px',
            height: '72px',
            border: '1px solid #F1F1F3',
            padding: '10px 0',
            fontSize: '18px',
            fontWeight: '600',
            margin: '25px 0'
          }}
          isInputNum={true}
          className='w-full otp-form'
          containerStyle='w-full justify-between'
          value={otp}
          onChange={handleChange}
          numInputs={4}
        />
        <div className='flex gap-x-2 items-center mt-[20px]'>
          <button
            disabled={isDisable}
            onClick={handleReSendOtp}
            className='disabled:opacity-50 font-[600] text-[14px] flex gap-x-[10px] leading-6 text-secondary'
          >
            Resend OTP
          </button>
          {count !== 0 && (
            <div className='dark:text-white'>
              {count >= 60 ? '01' : '00'}:{count < 10 ? `0${count}` : count >= 60 ? '00' : count}
            </div>
          )}
        </div>
        <button
          onClick={handleVerify}
          className={`bg-primary text-4 mt-[20px] font-[600]  text-white h-[52px] rounded-[10px]  w-full hover:opacity-90`}
        >
          Xác nhận
        </button>
        <button className='font-[600] mt-[20px] text-[14px] flex gap-x-[10px] leading-6 text-secondary'>
          <svg width={22} height={22} viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#clip0_2833_7141)'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M15.7404 16.754L9.56141 11.3644C9.37065 11.198 9.3509 10.9085 9.51729 10.7177C9.53066 10.7024 9.54504 10.688 9.56034 10.6746L15.7393 5.25096C15.9296 5.08398 16.2191 5.10283 16.3861 5.29307C16.4595 5.37669 16.5 5.48416 16.5 5.59542V16.4086C16.5 16.6618 16.2948 16.867 16.0417 16.867C15.9309 16.867 15.8239 16.8269 15.7404 16.754Z'
                fill='#A2A2A8'
              />
              <path
                d='M7.33333 5.5H6.41667C5.91041 5.5 5.5 5.91041 5.5 6.41667V15.5833C5.5 16.0896 5.91041 16.5 6.41667 16.5H7.33333C7.83959 16.5 8.25 16.0896 8.25 15.5833V6.41667C8.25 5.91041 7.83959 5.5 7.33333 5.5Z'
                fill='#A2A2A8'
              />
            </g>
            <defs>
              <clipPath id='clip0_2833_7141'>
                <rect width={22} height={22} fill='white' />
              </clipPath>
            </defs>
          </svg>
          <button onClick={handleBack}>Trở lại Đăng ký</button>
        </button>
      </div>
    </div>
  )
}

export default VerifyEmailByLogin

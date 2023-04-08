/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useMutation } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import OtpInput from 'react18-input-otp'
import { verifyAccount } from 'src/apis/auth.api'
import Countdown from 'react-countdown'

interface TimeType {
  hours: any
  minutes: any
  seconds: any
  completed: any
}
const VerifyEmailByForgotPass = () => {
  const [showOTPField, setShowOTPField] = useState(false)

  const [emailState, setEmailState] = useState<string>('')
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')

  const handleChange = (enteredOtp: any) => {
    setOtp(enteredOtp)
  }
  const resendOtpMutation = useMutation({
    mutationFn: () => {
      const body = {
        email: emailState
      }
      return verifyAccount(body)
    },
    onSuccess: () => {
      setShowOTPField(true)
      toast.success('Đã gửi OTP, mời kiểm tra!')
    }
  })
  const handleVerify = () => {
    if (otp.length === 4) {
      const data = { email: emailState, otp: otp }
      navigate('/reset-password', {
        state: {
          changePassFrom: data
        }
      })
    }
  }

  const handleReSendOtp = () => {
    resendOtpMutation.mutate()
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    resendOtpMutation.mutate()
  }
  const Completionist = () => (
    <button
      onClick={handleReSendOtp}
      className='font-[600] mt-[20px] text-[14px] flex gap-x-[10px] leading-6 text-secondary'
    >
      Resend OTP
    </button>
  )
  const renderer = ({ hours, minutes, seconds, completed }: TimeType) => {
    if (completed) {
      // Render a completed state
      return <Completionist />
    } else {
      return (
        <div className='flex items-center mt-[20px] gap-x-3'>
          <button
            disabled
            className='disabled:opacity-75 font-[600] text-[14px] flex gap-x-[10px] leading-6 text-secondary'
          >
            Resend OTP
          </button>
          <span>
            {minutes}:{seconds}
          </span>
        </div>
      )
    }
  }
  return (
    <div className='mx-auto dark:bg-[#1C1C24] w-[455px] mobile:w-full shadow-lg rounded-lg px-[35px] py-[50px]'>
      <h1 className='font-[700] text-[25px] mb-[25px] dark:text-white'>Quên mật khẩu</h1>
      {showOTPField && (
        <div>
          <span className='text-text-color leading-7'>Hãy nhập mã OTP được gửi về</span>
          <div className='text-white'>{emailState || 'thanhbinh@gmail.com'} </div>
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
          <Countdown date={Date.now() + 10000 * 5.9} renderer={renderer} />

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
            <Link to='/login'>Trở lại Đăng nhập</Link>
          </button>
        </div>
      )}
      {!showOTPField && (
        <form onSubmit={handleSubmit} className='mt-[20px]'>
          <div className='mb-[10px]'>
            <label>
              <p className={`mb-[10px] mobile:text-[14px] dark:text-text-color `}>Nhập email *</p>
              <input
                className={` dark:bg-transparent dark:text-text-color dark:border-[#3A3A43] rounded-lg border  h-[52px] w-full pl-[25px] 
                'border-[#F1F1F3]'
              `}
                placeholder={'example@gmail.com'}
                required
                type='email'
                value={emailState}
                onChange={(e) => setEmailState(e.target.value)}
              />
            </label>
          </div>
          <button
            className={`bg-primary text-4 font-[600]  text-white h-[52px] rounded-[10px]  w-full hover:opacity-90`}
          >
            Tiếp tục
          </button>
        </form>
      )}
    </div>
  )
}

export default VerifyEmailByForgotPass

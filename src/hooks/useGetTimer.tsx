import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { getOtpTimer } from 'src/apis/auth.api'

const useGetTimer = (email: string) => {
  const [time, setTime] = useState<number>(0)
  const [emailState, setEmailState] = useState<string>(email)

  const getTimer = useMutation({
    mutationFn: () => {
      const body: any = { user_email: emailState }
      return getOtpTimer(body)
    },
    onSuccess: (data) => {
      const dataNumber = Math.floor(data.data.timer)
      setTime(dataNumber)
    }
  })
  useEffect(() => {
    if (emailState !== '') {
      const timer = setTimeout(() => {
        getTimer.mutate()
      }, 1000)
      if (time < 0) {
        setEmailState('')
        clearTimeout(timer)
      }
      return () => {
        clearTimeout(timer)
      }
    }
  })
  return [time]
}

export default useGetTimer

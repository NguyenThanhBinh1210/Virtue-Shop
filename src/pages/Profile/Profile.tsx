/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react'
import { getProfileFromLS, setProfileFromLS, clearLS } from 'src/utils/auth'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { changePassword, getUser, logout, updateUser } from 'src/apis/auth.api'
import { User } from 'src/types/user.type'
import { toast } from 'react-toastify'
import Frame from '../../assets/images/Frame.jpg'
import FileBase from 'react-file-base64'
import { AppContext } from 'src/contexts/app.context'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import useDebounce from 'src/hooks/useDebounce'

type FormStateType = Omit<User, '_id'>
const Profile = () => {
  const [formError, setFormError] = useState('')
  const { t } = useTranslation('profile')
  const { t: t2 } = useTranslation('cart')
  const profileAccessToken = getProfileFromLS()
  const queryClient = useQueryClient()
  const initialFromState: FormStateType = {
    name: '',
    email: '',
    phone: 0,
    address: '',
    avatar: '',
    city: ''
  }
  const initialPasswordState = {
    password: '',
    newPassword: ''
  }
  const [formState, setFormState] = useState<FormStateType>(initialFromState)
  const [formCity, setFormCity] = useState<any>()
  const [passwordState, setPasswordState] = useState(initialPasswordState)
  const [showCity, setShowCity] = useState(false)
  const { isLoading } = useQuery({
    queryKey: ['user', profileAccessToken._id],
    queryFn: () => getUser(profileAccessToken._id),
    enabled: profileAccessToken._id !== undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      setFormState(data.data.data)
    }
  })
  useQuery({
    queryKey: ['test'],
    queryFn: () => axios.get('https://provinces.open-api.vn/api/?depth=2'),
    onSuccess: (data) => {
      setFormCity(data.data)
    }
  })

  const [isDisabled, setDisable] = useState(true)
  const [isDisabledEmail, setDisableEmail] = useState(true)

  const { setProfile, reset } = useContext(AppContext)
  const updateProfileMutation = useMutation({
    mutationFn: () => {
      return updateUser(profileAccessToken._id, formState)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user', profileAccessToken._id], data)
    }
  })
  const logOutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      reset()
      clearLS()
    }
  })
  const changePasswordMutation = useMutation({
    mutationFn: () => {
      const body = {
        email: profileAccessToken?.email,
        password: passwordState.password,
        new_password: passwordState.newPassword
      }
      return changePassword(body)
    },
    onError: (data: any) => {
      setFormError(data.response.data.message)
      toast.warn(data.response.data.message)
    },
    onSuccess: () => {
      setDisableEmail(true)
      toast.success('Đã đổi mật khẩu thành công, mời đăng nhập lại!')
      logOutMutation.mutate()
    }
  })
  const handleChange = (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [name]: event.target.value }))
  }
  const handleChangePassword = (name: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordState((prev) => ({ ...prev, [name]: event.target.value }))
    setFormError('')
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (passwordState.password !== '' && passwordState.newPassword !== '') {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
      const isValid = regex.test(passwordState.newPassword)

      if (!isValid) {
        setFormError('Mật khẩu mới ít nhất 8 ký tự, 1 số và 1 ký tự đặc biệt!')
      } else {
        changePasswordMutation.mutate()
        setPasswordState(initialPasswordState)
      }
    }
    if (passwordState.password === '' && passwordState.newPassword === '') {
      updateProfileMutation.mutate(undefined, {
        onSuccess: () => {
          const newProfile = { ...profileAccessToken, avatar: formState?.avatar }
          setDisable(true)
          setProfileFromLS(newProfile)
          setProfile(newProfile)
          toast.success(' Đã sửa thành công!')
        }
      })
    }
  }

  return (
    <div className='mobile:px-5 dark:text-white'>
      <div>
        <h1 className='font-[700] text-[25px] mobile:text-[20px]'>{t('info')}</h1>
        <span className='text-text-color'>{t('edit info')}</span>
      </div>
      {isLoading && (
        <div className='text-center mt-20'>
          <div role='status'>
            <svg
              aria-hidden='true'
              className='inline w-[100px] h-[100px] mr-2 text-gray-200 animate-spin  fill-primary'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      )}
      {!isLoading && (
        <form onSubmit={handleSubmit} className='tablet:pr-10'>
          <div className='grid gap-6 mb-6 md:grid-cols-2 mt-[40px]'>
            <div className='font-[700] text-[18px] flex justify-between'>
              <h1>{t('personal')}</h1>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setDisable(!isDisabled)
                }}
                className='text-secondary font-[600] text-[18px]'
              >
                {isDisabled ? `${t('edit')}` : `${t('close')}`}
              </button>
            </div>
            <div className='grid grid-cols-2 gap-x-10 mobile:grid-cols-1'>
              <div className='relative'>
                <div className='h-[250px]  w-[250px] bg-primary mx-auto rounded-[100rem] overflow-hidden'>
                  {formState?.avatar ? <img src={formState?.avatar} alt='' /> : <img src={Frame} alt='' />}
                </div>
                <button className='opacity-0 hover:opacity-100 cursor-pointer rounded-full h-[250px] flex justify-center items-center w-[250px] absolute top-[50%] left-[55%] translate-x-[-50%] translate-y-[-50%]'>
                  <FileBase
                    type='file'
                    name='picture'
                    className='hidden'
                    onDone={(base64: any) => {
                      setFormState((prev) => {
                        return { ...prev, avatar: base64.base64 }
                      })
                      setDisable(false)
                    }}
                    accept='image/png, image/jpg, image/webp'
                  />
                </button>
              </div>
              <div className='grid gap-y-5'>
                <div>
                  <label htmlFor='name' className='block mb-2 dark:text-text-color text-sm font-medium text-gray-900 '>
                    {t2('fullname')}
                  </label>
                  <input
                    disabled={isDisabled}
                    type='text'
                    id='last_name'
                    className='dark:bg-[#1C1C24] dark:text-text-color dark:border-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-primary block w-full p-2.5 '
                    placeholder='Nguyễn Văn ...'
                    required
                    value={formState.name}
                    onChange={handleChange('name')}
                  />
                </div>
                <div className='grid grid-cols-5 gap-x-2 w-full'>
                  <div className='col-span-2 relative'>
                    <label
                      htmlFor='company'
                      className='dark:text-text-color block mb-2 text-sm font-medium text-gray-900 '
                    >
                      {t2('city')}
                    </label>
                    <input
                      disabled={isDisabled}
                      type='text'
                      autoComplete='false'
                      id='company-k'
                      className='dark:bg-[#1C1C24] dark:text-text-color dark:border-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-primary block w-full p-2.5 '
                      placeholder={t2('city') || ''}
                      required
                      onFocus={() => setShowCity(true)}
                      value={formState.city}
                    />
                    {showCity && (
                      <ul
                        className={` overflow-hidden overflow-y-scroll custom-scrollbar h-[200px] mobile:z-10 absolute dark:bg-[#24242c] dark:text-white flex flex-col top-[100%] bg-white rounded-lg w-full border`}
                      >
                        {formCity?.map((item: any) => {
                          return (
                            <button
                              type='button'
                              className='py-1.5 dark:hover:bg-text-color cursor-pointer hover:bg-slate-50'
                              key={item.code}
                              onClick={() => {
                                setFormState((prev) => ({ ...prev, city: item.name }))
                                setShowCity(false)
                              }}
                            >
                              {item.name}
                            </button>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                  <div className='col-span-3'>
                    <label
                      htmlFor='company'
                      className='dark:text-text-color block mb-2 text-sm font-medium text-gray-900 '
                    >
                      {t2('address')}
                    </label>
                    <input
                      disabled={isDisabled}
                      type='text'
                      id='company'
                      className='dark:bg-[#1C1C24] dark:text-text-color dark:border-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-primary block w-full p-2.5 '
                      placeholder='Flowbite'
                      required
                      value={formState.address}
                      onChange={handleChange('address')}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='phone'
                    className=' dark:text-text-color block mb-2 text-sm font-medium text-gray-900 '
                  >
                    {t2('phone number')}
                  </label>
                  <input
                    disabled={isDisabled}
                    type='number'
                    id='phone'
                    className='dark:bg-[#1C1C24] dark:text-text-color dark:border-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-primary block w-full p-2.5  '
                    placeholder='123-45-678'
                    pattern='[0-9]{3}-[0-9]{2}-[0-9]{3}'
                    required
                    value={formState.phone}
                    onChange={handleChange('phone')}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='font-[700] text-[18px] flex justify-between mt-[40px] mb-[20px]'>
            <h1> {t('account')}</h1>
            {formState.type !== 'google' && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setDisableEmail(!isDisabledEmail)
                }}
                className='text-secondary font-[600] text-[18px]'
              >
                {isDisabledEmail ? `${t('edit')}` : `${t('close')}`}
              </button>
            )}
          </div>

          <div className='mb-6'>
            <label htmlFor='email' className='dark:text-text-color block mb-2 text-sm font-medium text-gray-900 '>
              {t2('address')} email
            </label>
            <input
              disabled
              type='email'
              id='email'
              className=' dark:bg-[#1C1C24] dark:text-text-color dark:border-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-primary block w-full p-2.5'
              placeholder='john.doe@company.com'
              required
              value={formState.email?.replace('google', '')}
              onChange={handleChange('email')}
            />
          </div>
          {formState.type !== 'google' && (
            <div className='grid grid-cols-2 gap-x-10'>
              <div className='mb-6'>
                <label
                  htmlFor='password'
                  className='dark:text-text-color block mb-2 text-sm font-medium text-gray-900 '
                >
                  {t('old password')}
                </label>
                <input
                  disabled={isDisabledEmail}
                  type='password'
                  id='password'
                  className={` dark:bg-[#1C1C24] dark:text-text-color dark:border-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-primary ${
                    formError ? 'border-red-300 focus:border-red-300' : ''
                  } block w-full p-2.5 `}
                  placeholder='•••••••••'
                  required
                  value={passwordState.password}
                  onChange={handleChangePassword('password')}
                />
              </div>
              <div className='mb-6'>
                <label
                  htmlFor='confirm_password'
                  className='dark:text-text-color block mb-2 text-sm font-medium text-gray-900'
                >
                  {t('new password')}
                </label>
                <input
                  disabled={isDisabledEmail}
                  type='password'
                  id='confirm_password'
                  className={` dark:bg-[#1C1C24] dark:text-text-color dark:border-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-primary ${
                    formError ? 'border-red-300 focus:border-red-300' : ''
                  } block w-full p-2.5 `}
                  placeholder='•••••••••'
                  required
                  value={passwordState.newPassword}
                  onChange={(event) => setPasswordState((prev) => ({ ...prev, newPassword: event.target.value }))}
                />
              </div>
              <div className='text-red-300 mb-2'>{formError}</div>
            </div>
          )}
          {/* Button */}
          <div className='flex justify-between'>
            {!isDisabled && (
              <button
                type='submit'
                className='text-white  bg-primary hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center '
              >
                {t('confirm edit info')}
              </button>
            )}
            {!isDisabledEmail && (
              <button
                type='submit'
                className='text-white  bg-primary hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center '
              >
                {t('confirm edit password')}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

export default Profile

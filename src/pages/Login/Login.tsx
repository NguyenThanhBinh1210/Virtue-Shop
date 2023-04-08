/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Google from '../../assets/images/Google.png'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { loginAccount } from 'src/apis/auth.api'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import omit from 'lodash/omit'
import Cookies from 'js-cookie'
import { Helmet } from 'react-helmet'

const schema = yup
  .object({
    email: yup.string().email('Không đúng định dạng email!').required('Chưa nhập email'),
    password: yup
      .string()
      .required('Chưa nhập mật khẩu')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, 'Mật khẩu ít nhất 8 ký tự, 1 số và 1 ký tự đặc biệt!')
  })
  .required()
type FormData = yup.InferType<typeof schema>
const Login = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })
  const navigate = useNavigate()

  const mutation = useMutation((body: Omit<FormData, 'cmd'>) => {
    return loginAccount(body)
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data, {
      onSuccess: (dataUser) => {
        if (dataUser.data.status === 'ERR') {
          const formError = dataUser.data.message
          setError('email', {
            message: formError,
            type: 'Server'
          })
          setError('password', {
            message: formError,
            type: 'Server'
          })
        }
        if (dataUser.data.status === 'OK') {
          const newUser = omit(dataUser.data.data, ['password', 'isAdmin'])
          setProfile(newUser)
          toast.success('Đăng nhập thành công!')
          setIsAuthenticated(true)
          navigate('/')
          Cookies.set('refresh_token', dataUser.data.refresh_token as string)
        }
      }
    })
  }
  // const clientId = '564948588399-db0beu2kqorqf7rcuolf4u72jf48msek.apps.googleusercontent.com'
  // useEffect(() => {
  //   gapi.load('client:auth2', () => {
  //     gapi.auth2.init({ clientId: clientId })
  //   })
  // }, [])

  return (
    <div className=''>
      <Helmet>
        <title>Đăng nhập | Virtue Shop</title>
        <meta name='description' content='Đăng nhập vào trang Virtue Shop' />
      </Helmet>
      <div
        className={`dark:bg-[#1C1C24] dark:border-none bg-white border
         z-10  mx-auto w-[556px] mobile:w-[327px] rounded-lg flex flex-col px-[60px] py-[50px] mobile:px-[38px]`}
      >
        <div className='mb-[20px]'>
          <h1 className={`dark:text-white text-[20px] leading-[30px] font-[600px] text-center mb-[10px]`}>
            Welcome back!
          </h1>
          <div className='text-center'>
            <span className='text-text-color text-[14px] mobile:text-[12px]'>Chưa có tài khoản?</span>{' '}
            <span className='text-primary cursor-pointer mobile:text-[12px]'>
              <Link to='/register'>Đăng ký ngay!</Link>
            </span>
          </div>
        </div>
        <div className=''>
          <button
            // onClick={googleAuth}
            className={` dark:border-[#3A3A43] flex items-center gap-x-2 w-full justify-center border rounded-md p-2 mb-[10px]`}
          >
            <div className='w-6 h-6'>
              <img src={Google} alt='' />
            </div>
            <h1 className={`dark:text-white`}>Đăng nhập bằng Google</h1>
          </button>
          {/* <GoogleLogin
            clientId={clientId}
            onSuccess={onSuccess}
            render={(renderProp) => (
              <button
                disabled={renderProp.disabled}
                onClick={renderProp.onClick}
                className={`flex items-center gap-x-2 w-full justify-center border border-text-color rounded-md p-2 mb-[10px] dark:text-white `}
              >
                <div className='w-6 h-6'>
                  <img src={Google} alt='' />
                </div>
                <h1 className={`dark:text-white`}>Đăng nhập bằng Google</h1>{' '}
              </button>
            )}
            onFailure={onFailure}
            cookiePolicy='single_host_origin'
            responseType='code,token'
          /> */}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-[20px] '>
          <Input
            inputPassword={false}
            register={register}
            errrorMessage={errors.email?.message}
            placeholder={'example@gmail.com'}
            name='email'
          />
          <div className='text-red-300 pt-2 pb-2'>{errors.email?.message ? errors.email?.message : ''}</div>

          <Input
            inputPassword={true}
            register={register}
            errrorMessage={errors.password?.message}
            placeholder={'Password'}
            name='password'
          />
          <div className='text-red-300 pt-2'>{errors.password?.message ? errors.password?.message : ''}</div>
          <button
            type='button'
            onClick={(e) => {
              navigate('/forgot-password')
            }}
            className='text-[14px] text-primary float-right p-3 cursor-pointer'
          >
            Quên mật khẩu
          </button>
          <button
            type='submit'
            className={`bg-primary text-4 font-[600]  text-white h-[52px] rounded-[10px]  w-full hover:opacity-90`}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

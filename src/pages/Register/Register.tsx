/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react'
import Google from '../../assets/images/Google.png'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { loginWithGoogle, verifyAccount } from 'src/apis/auth.api'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet'
import GoogleLogin from 'react-google-login'
import omit from 'lodash/omit'
import { AppContext } from 'src/contexts/app.context'

const schema = yup
  .object({
    name: yup.string().required('Chưa điền tên'),
    email: yup.string().email('Chưa đúng định dạng email').required('Chưa nhập Email'),
    password: yup
      .string()
      .required('Chưa nhập mật khẩu')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        'Password must be at least 8 characters, 1 uppercase, 1 lowercase and 1 number!'
      ),
    confirmPassword: yup
      .string()
      .label('confirm password')
      .required('Chưa nhập lại mật khẩu')
      .oneOf([yup.ref('password'), null], 'Nhập lại chưa đúng ')
  })
  .required()
type FormData = yup.InferType<typeof schema>
const Register = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const [term, setTerm] = useState(false)
  const {
    register,
    handleSubmit,

    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const registerMutation = useMutation({
    mutationFn: (body: { email: string }) => {
      return verifyAccount(body)
    }
  })
  const navigate = useNavigate()
  const onSubmit = (data: FormData) => {
    if (term === true) {
      registerMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Xác thực nữa là thành công rồi!')
          localStorage.setItem('temp', JSON.stringify(data))
          navigate('/verify', {
            state: {
              registerForm: data
            }
          })
        }
      })
    }
  }
  const clientId = '564948588399-db0beu2kqorqf7rcuolf4u72jf48msek.apps.googleusercontent.com'

  const handleFailure = () => {
    console.log('Chịu')
  }
  const googleLoginMutation = useMutation((body: any) => loginWithGoogle(body))
  const loginGoogle = (response: any) => {
    const body = {
      tokenId: response.tokenId,
      clientId: clientId
    }
    googleLoginMutation.mutate(body, {
      onSuccess: (data: any) => {
        const newUser: any = omit(data.data.data, ['password', 'isAdmin'])
        setProfile(newUser)
        toast.success('Đăng nhập thành công!')
        setIsAuthenticated(true)
        navigate('/')
      }
    })
  }
  return (
    <div className=''>
      <Helmet>
        <title>Đăng ký | Virtue Shop</title>
        <meta name='description' content='Đăng ký tài khoản trang Virtue Shop' />
      </Helmet>
      <div
        className={`dark:bg-[#1C1C24] dark:border-none bg-white border z-10  mx-auto w-[556px] mobile:w-[327px] rounded-lg flex flex-col px-[60px] py-[50px] mobile:px-[38px]`}
      >
        <div className='mb-[20px]'>
          <h1 className={`dark:text-white text-[20px] leading-[30px] font-[600px] text-center mb-[10px]`}>Đăng ký</h1>
          <div className='text-center'>
            <span className='text-text-color text-[14px] mobile:text-[12px]'>Đã có tài khoản?</span>{' '}
            <span className='text-primary cursor-pointer mobile:text-[12px]'>
              <Link to='/login'>Đăng nhập ngay!</Link>
            </span>
          </div>
        </div>
        <div className=''>
          <GoogleLogin
            className='google-btn'
            clientId={clientId}
            buttonText='Log in with Google'
            onSuccess={loginGoogle}
            onFailure={handleFailure}
            render={(renderProp) => (
              <button
                disabled={renderProp.disabled}
                onClick={renderProp.onClick}
                className={`flex items-center gap-x-2 w-full justify-center border dark:border-text-color rounded-md p-2 mb-[10px] dark:text-white `}
              >
                <div className='w-6 h-6'>
                  <img src={Google} alt='' />
                </div>
                <h1 className={`dark:text-white`}>Đăng ký bằng Google</h1>{' '}
              </button>
            )}
            scope={'profile email'}
            cookiePolicy={'single_host_origin'}
          ></GoogleLogin>
          <p className='text-center text-text-color mt-4'>Hoặc đăng ký với email</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-[20px]'>
          <div className='mb-[10px]'>
            <label>
              <p className={`mb-[10px] mobile:text-[14px] dark:text-text-color `}>Tên đầy đủ *</p>
              <input
                {...register('name')}
                className={` dark:bg-transparent dark:text-text-color dark:border-[#3A3A43] rounded-lg border  h-[52px] w-full pl-[25px] ${
                  errors.name ? 'border-[#EB5757]' : 'border-[#F1F1F3]'
                }`}
                placeholder={'Nguyễn Văn A'}
              />
            </label>
            <div className='text-red-300 pt-2 pb-2'>{errors.name?.message ? errors.name?.message : ''}</div>
          </div>
          <div className='mb-[10px] '>
            <label>
              <p className={`mb-[10px] mobile:text-[14px] dark:text-text-color `}>Email *</p>
              <input
                {...register('email')}
                className={` dark:bg-transparent dark:text-text-color dark:border-[#3A3A43] rounded-lg border  h-[52px] w-full pl-[25px] ${
                  errors.email ? 'border-[#EB5757]' : 'border-[#F1F1F3]'
                }`}
                placeholder={'example@gmail.com'}
              />
            </label>
            <div className='text-red-300 pt-2 pb-2'>{errors.email?.message ? errors.email?.message : ''}</div>
          </div>
          <div className='mb-[10px]'>
            <label>
              <p className={`mb-[10px] mobile:text-[14px] dark:text-text-color `}>Mật khẩu *</p>

              <input
                {...register('password')}
                className={` dark:bg-transparent dark:text-text-color dark:border-[#3A3A43] rounded-lg border  h-[52px] w-full pl-[25px] ${
                  errors.password ? 'border-[#EB5757]' : 'border-[#F1F1F3]'
                }`}
                placeholder={'Abc123@'}
              />
            </label>
            <div className='text-red-300 pt-2 pb-2'>{errors.password?.message ? errors.password?.message : ''}</div>
          </div>
          <div className='mb-[10px]'>
            <label>
              <p className={`mb-[10px] mobile:text-[14px] dark:text-text-color `}>Nhập lại mật khẩu *</p>

              <input
                {...register('confirmPassword')}
                className={` dark:bg-transparent dark:text-text-color dark:border-[#3A3A43] rounded-lg border  h-[52px] w-full pl-[25px] ${
                  errors.confirmPassword ? 'border-[#EB5757]' : 'border-[#F1F1F3]'
                }`}
                placeholder={'Abc123@'}
              />
            </label>
            <div className='text-red-300 pt-2 pb-2'>
              {errors.confirmPassword?.message ? errors.confirmPassword?.message : ''}
            </div>
          </div>

          <div>
            <label className='container'>
              <p className={`dark:text-text-color pr-[35px] leading-5 mobile:text-[12px] mobile:pr-[0]`}>
                Tôi đã đồng ý với{' '}
                <Link to='' className='text-violet'>
                  điều khoản sử dụng
                </Link>{' '}
                và đã đọc và hiểu{' '}
                <Link to='' className='text-violet'>
                  chính sách bảo mật
                </Link>
                .
              </p>
              <input type='checkbox' onChange={(e) => setTerm(e.target.checked)} />
              <span className={term ? 'checkmark' : 'uncheckmark'}></span>
            </label>
          </div>
          <button
            disabled={registerMutation.isLoading}
            className={`bg-primary text-4 font-[600] disabled:bg-opacity-70 text-white h-[52px] rounded-[10px]  w-full hover:opacity-90`}
          >
            {registerMutation.isLoading ? (
              <div>
                <svg
                  aria-hidden='true'
                  role='status'
                  className='inline w-4 h-4 mr-3 text-white animate-spin'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='#E5E7EB'
                  />
                  <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentColor'
                  />
                </svg>
                Loading...
              </div>
            ) : (
              'Đăng ký'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register

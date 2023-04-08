import { useContext, useState } from 'react'
import Google from '../../assets/images/Google.png'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { registerAccount, verifyAccount } from 'src/apis/auth.api'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { Helmet } from 'react-helmet'

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
  const [term, setTerm] = useState(false)
  const {
    register,
    handleSubmit,

    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })
  const mutation = useMutation((body: { name: string; password: string; confirmPassword: string; email: string }) => {
    return verifyAccount(body)
  })
  const navigate = useNavigate()
  const onSubmit = (data: FormData) => {
    if (term === true) {
      mutation.mutate(data, {
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
          <button
            className={` dark:border-[#3A3A43] flex items-center gap-x-2 w-full justify-center border rounded-md p-2 mb-[10px]`}
          >
            <div className='w-6 h-6'>
              <img src={Google} alt='' />
            </div>
            <h1 className={`dark:text-white`}>Đăng nhập bằng Google</h1>
          </button>
          <div className={`dark:text-white text-text-color text-[14px] text-center mobile:text-[12px]`}>
            Hoặc đăng ký bằng email
          </div>
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
                placeholder={errors.name ? errors.name?.message : 'Nguyễn Văn A'}
              />
            </label>
          </div>
          <div className='mb-[10px] '>
            <label>
              <p className={`mb-[10px] mobile:text-[14px] dark:text-text-color `}>Email *</p>
              <input
                {...register('email')}
                className={` dark:bg-transparent dark:text-text-color dark:border-[#3A3A43] rounded-lg border  h-[52px] w-full pl-[25px] ${
                  errors.email ? 'border-[#EB5757]' : 'border-[#F1F1F3]'
                }`}
                placeholder={errors.email ? errors.email?.message : 'example@gmail.com'}
              />
            </label>
          </div>
          <div className='mb-[10px]'>
            <label>
              <p className={`mb-[10px] mobile:text-[14px] dark:text-text-color `}>Password *</p>

              <input
                {...register('password')}
                className={` dark:bg-transparent dark:text-text-color dark:border-[#3A3A43] rounded-lg border  h-[52px] w-full pl-[25px] ${
                  errors.password ? 'border-[#EB5757]' : 'border-[#F1F1F3]'
                }`}
                placeholder={errors.password ? errors.password?.message : 'Abc123@'}
              />
            </label>
          </div>
          <div className='mb-[10px]'>
            <label>
              <p className={`mb-[10px] mobile:text-[14px] dark:text-text-color `}>Nhập lại mật khẩu *</p>

              <input
                {...register('confirmPassword')}
                className={` dark:bg-transparent dark:text-text-color dark:border-[#3A3A43] rounded-lg border  h-[52px] w-full pl-[25px] ${
                  errors.confirmPassword ? 'border-[#EB5757]' : 'border-[#F1F1F3]'
                }`}
                placeholder={errors.confirmPassword ? errors.confirmPassword?.message : 'Abc123@'}
              />
            </label>
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
            className={`bg-primary text-4 font-[600]  text-white h-[52px] rounded-[10px]  w-full hover:opacity-90`}
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register

/* eslint-disable @typescript-eslint/no-explicit-any */
import Logo from '../../assets/images/Logo.png'
import Search from '../../assets/images/Search.png'
import Frame from '../../assets/images/Frame.jpg'
import Bar from '../../assets/images/Bar.png'
import Dashboard from '../../assets/images/Dashboard.png'
import Withdraw from '../../assets/images/Withdraw.png'
import Profile from '../../assets/images/Profile.png'
import Logout from '../../assets/images/Logout.png'
import Close from '../../assets/images/Close.png'
import { useContext, useState } from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { AppContext } from 'src/contexts/app.context'
import Button from '../Button'
import useQueryConfig from 'src/hooks/useQueryConfig'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import omit from 'lodash/omit'
import { useMutation } from 'react-query'
import { logout } from 'src/apis/auth.api'
import { toast } from 'react-toastify'
import useDarkMode from 'src/hooks/useDarkMode'
import { useTranslation } from 'react-i18next'
import Popover from '../Popover/Popover'

const schema = yup
  .object({
    name: yup.string().trim().required('Chưa điền tên')
  })
  .required()
type FormData = yup.InferType<typeof schema>
const DashboardHeader = () => {
  const { t } = useTranslation('header')
  const { t: t2 } = useTranslation('home')
  // const currentLanguage = locales[i18n.language as keyof typeof locales]
  const [isDarkMode, toggleDarkMode] = useDarkMode()
  const { reset } = useContext(AppContext)
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(schema)
  })
  const { profile } = useContext(AppContext)
  const [count, setCount] = useState(false)
  const [modal, setmModal] = useState(false)

  const { isAuthenticated } = useContext(AppContext)
  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name
        }
    navigate({
      pathname: '/product/',
      search: createSearchParams(config).toString()
    })
  })
  const logOutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      reset()
      toast.success('Đăng xuất thành công!')
    }
  })
  const handleLogout = () => {
    logOutMutation.mutate()
    setCount(!count)
  }
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language
  const changLanguage = () => {
    if (currentLanguage === 'vi') {
      i18n.changeLanguage('en')
    }
    if (currentLanguage === 'en') {
      i18n.changeLanguage('vi')
    }
  }
  return (
    <div className=''>
      <div className='dashboardHeader flex p-8 mobile:pb-1 mobile:flex mobile:justify-between'>
        <div className='dashboardHeader__left flex w-[50%] mobile:w-[auto] mobile:justify-between relative'>
          <div className='dashboardHeader__left--logo mr-8 mobile:mr-0 mobile:flex mobile:justify-center mobile:items-center'>
            <Link to='/'>
              <img className='mobile:hidden cursor-pointer ' src={Logo} alt='' />
            </Link>
            <button
              onClick={() => {
                setCount(!count)
              }}
              className='hidden mobile:w-[20px] mobile:h-[14px] mobile:block'
            >
              <img alt='' src={Bar} />
            </button>
          </div>
          <form
            onSubmit={onSubmitSearch}
            className={`cursor-pointer dark:bg-[#1C1C24] mobile:w-[217px] mobile:h-[40px] mobile:left-[50px] dashboardHeader__left--search flex items-center absolute z-10 bg-textColorwhite rounded-full w-[430px] h-[46px] p-1 pl-3 lr-2 left-[20%] top-1 mobile:top-0 shadow `}
          >
            <input
              type='text'
              className={`text-sm mobile:text-xs w-[85%] dark:text-white dark:bg-[#1C1C24] z-1`}
              placeholder={t('search name') || ''}
              {...register('name')}
            />
            <button
              type='submit'
              className='bg-bgPrimary w-[72px] h-[40px] rounded-full  flex mobile:w-[42px] mobile:h-[28px]'
            >
              <img
                alt=''
                src={Search}
                className=' w-[18px] h-[18px] mobile:w-[16px] mobile:h-[16px]'
                style={{ margin: 'auto' }}
              />
            </button>
          </form>
        </div>
        <div className='mobile:hidden dashboardHeader__right flex items-center w-[50%] justify-end mobile:justify-start'>
          <div className='cursor-pointer dashboardHeader__right--start mobile:hidden'>
            <div className='flex gap-x-6'>
              <Link to='/product'>
                <Button>{t('go shopping')}</Button>
              </Link>
              <Link to='/login' className={`${isAuthenticated ? 'hidden' : ''}`}>
                <Button>{t('login')}</Button>
              </Link>
            </div>
          </div>
          {isAuthenticated ? (
            <div className='dashboardHeader__right--avatar ml-4 mobile:ml-0 cursor-pointer'>
              <div className=' w-[52px] rounded-full overflow-hidden  h-[52px] mobile:w-[40px] mobile:h-[40px] flex items-center justify-center mobile:absolute mobile:right-4 mobile:top-[40px]'>
                {profile?.avatar ? <img src={profile.avatar} alt='' /> : <img alt='' className='' src={Frame} />}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className='gap-x-6 mobile:gap-x-0 hidden mobile:flex'>
          <Popover
            renderPopover={
              <div className='relative p-4 max-w-[400px] rounded-md border  bg-white text-sm shadow-md'>
                <Link to='/login' className={`${isAuthenticated ? 'hidden' : ''}`}>
                  <button className='bg-primary p-2 text-white rounded-md'>{t('login')}</button>
                </Link>
              </div>
            }
            placement='bottom'
          >
            <div className=' w-[52px] rounded-full overflow-hidden  h-[52px] mobile:w-[40px] mobile:h-[40px] mobile:ml-8 flex items-center justify-center '>
              <img alt='' className='' src={Frame} />
            </div>
          </Popover>
          {isAuthenticated ? (
            <div className=' ml-4 mobile:ml-[0px] cursor-pointer'>
              <Link to='/profile'>
                <div className=' w-[52px] rounded-full overflow-hidden  h-[52px] mobile:w-[40px] mobile:h-[40px] mobile:ml-8 flex items-center justify-center '>
                  {profile?.avatar ? <img src={profile?.avatar} alt='' /> : <img alt='' className='' src={Frame} />}
                </div>
              </Link>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>

      {/* modal */}
      <button
        onClick={() => {
          setmModal(false)
        }}
        style={{ backgroundColor: 'rgba(23, 23, 37, 0.4)' }}
        className={`${modal === false ? 'hidden' : ''} fixed w-[100vw] h-[100vh]  top-0 left-0 flex`}
      ></button>

      {/* mobile */}

      <div
        className={`${
          count ? 'translate-x-0' : 'translate-x-[-100%]'
        } transition-transform dark:bg-[#1C1C24] pt-10 w-[400px] h-[100vh] bg-white fixed z-[1000] top-0 hidden mobile:block `}
      >
        <div className='dasboardHeader__mobile  flex  items-center justify-between px-10'>
          <button
            onClick={() => {
              setCount(!count)
              navigate('/')
            }}
            className='dasboardHeader__mobile--logo w-[40px] h-[40px]'
          >
            <img src={Logo} className='w-10 h-10' alt='' />
          </button>

          <div className='dashboardHeader__left--logo mobile:flex mobile:justify-center mobile:items-center'>
            <button
              onClick={() => {
                setCount(!count)
              }}
              className='w-[20px] h-[20px]'
            >
              <img alt='' src={Close} />
            </button>
          </div>
        </div>
        <div className='dasboardHeader__mobile px-10 py-3 '>
          <button onClick={() => setCount(!count)}>
            <Link to='/product/' className='dasboardHeader__mobile--container w-[327px] h-[52px] flex items-center'>
              <div>
                <img alt='' className='w-[24px] h-[24px]' src={Dashboard} />
              </div>
              <p className='ml-5 text-iconColor lg-iconColor text-sm mr-1'>{t('go shopping')}</p>
            </Link>
          </button>
          <button onClick={() => setCount(!count)}>
            <Link to='/cart' className='dasboardHeader__mobile--container w-[327px] h-[52px] flex items-center'>
              <div>
                <img alt='' className='w-[24px] h-[24px]' src={Withdraw} />
              </div>
              <p className='ml-5 text-iconColor text-sm mr-1'>{t2('cart')}</p>
            </Link>
          </button>
          <button onClick={() => setCount(!count)}>
            <Link to='/order' className='dasboardHeader__mobile--container w-[327px] h-[52px] flex items-center'>
              <div className='stroke-[#A2A2A8]'>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M18.1111 8.14286V5.57143C18.1111 4.88944 17.8536 4.23539 17.3951 3.75315C16.9367 3.27092 16.315 3 15.6667 3H3.44444C2.79614 3 2.17438 3.27092 1.71596 3.75315C1.25754 4.23539 1 4.88944 1 5.57143V13.2857C1 13.9677 1.25754 14.6218 1.71596 15.104C2.17438 15.5862 2.79614 15.8571 3.44444 15.8571H5.88889M8.33333 21H20.5556C21.2039 21 21.8256 20.7291 22.284 20.2468C22.7425 19.7646 23 19.1106 23 18.4286V10.7143C23 10.0323 22.7425 9.37825 22.284 8.89601C21.8256 8.41377 21.2039 8.14286 20.5556 8.14286H8.33333C7.68503 8.14286 7.06327 8.41377 6.60485 8.89601C6.14643 9.37825 5.88889 10.0323 5.88889 10.7143V18.4286C5.88889 19.1106 6.14643 19.7646 6.60485 20.2468C7.06327 20.7291 7.68503 21 8.33333 21ZM16.8889 14.5714C16.8889 15.2534 16.6313 15.9075 16.1729 16.3897C15.7145 16.8719 15.0928 17.1429 14.4444 17.1429C13.7961 17.1429 13.1744 16.8719 12.716 16.3897C12.2575 15.9075 12 15.2534 12 14.5714C12 13.8894 12.2575 13.2354 12.716 12.7532C13.1744 12.2709 13.7961 12 14.4444 12C15.0928 12 15.7145 12.2709 16.1729 12.7532C16.6313 13.2354 16.8889 13.8894 16.8889 14.5714Z'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <p className='ml-5 text-iconColor text-sm mr-1'>{t2('order')}</p>
            </Link>
          </button>
          <button onClick={() => setCount(!count)}>
            <Link to='/profile' className='dasboardHeader__mobile--container w-[327px] h-[52px] flex items-center'>
              <div>
                <img alt='' className='w-[24px] h-[24px]' src={Profile} />
              </div>
              <p className='ml-5 text-iconColor text-sm  mr-1'>{t2('profile')}</p>
            </Link>
          </button>
          <button
            onClick={handleLogout}
            className='dasboardHeader__mobile--container w-[327px] h-[52px] flex items-center'
          >
            <div>
              <img alt='' className='w-[24px] h-[24px]' src={Logout} />
            </div>
            <p className='ml-5 text-iconColor text-sm  mr-1'>{t2('logout')}</p>
          </button>
          <button
            onClick={changLanguage}
            className='text-[#A2A2A8]  text-[20px] dasboardHeader__mobile--container w-[327px] h-[52px] flex items-center'
          >
            {currentLanguage.toLocaleUpperCase()}
            <p className='ml-5 text-iconColor text-sm  mr-1'>
              {currentLanguage === 'vi' ? 'Tiếng việt' : currentLanguage === 'en' ? 'English' : ''}
            </p>
          </button>
          <button
            className=' dasboardHeader__mobile--container w-[327px] gap-x-5 h-[52px] flex items-center '
            onClick={() => toggleDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M12 18.5455C10.264 18.5455 8.59918 17.8558 7.37166 16.6283C6.14415 15.4008 5.45455 13.736 5.45455 12C5.45455 10.264 6.14415 8.59918 7.37166 7.37166C8.59918 6.14415 10.264 5.45455 12 5.45455C13.736 5.45455 15.4008 6.14415 16.6283 7.37166C17.8558 8.59918 18.5455 10.264 18.5455 12C18.5455 13.736 17.8558 15.4008 16.6283 16.6283C15.4008 17.8558 13.736 18.5455 12 18.5455ZM12 16.3636C13.1573 16.3636 14.2672 15.9039 15.0856 15.0856C15.9039 14.2672 16.3636 13.1573 16.3636 12C16.3636 10.8427 15.9039 9.73278 15.0856 8.91444C14.2672 8.0961 13.1573 7.63636 12 7.63636C10.8427 7.63636 9.73278 8.0961 8.91444 8.91444C8.0961 9.73278 7.63636 10.8427 7.63636 12C7.63636 13.1573 8.0961 14.2672 8.91444 15.0856C9.73278 15.9039 10.8427 16.3636 12 16.3636ZM10.9091 1.09091C10.9091 0.488417 11.3975 0 12 0V0C12.6025 0 13.0909 0.488417 13.0909 1.09091V2.18182C13.0909 2.78431 12.6025 3.27273 12 3.27273V3.27273C11.3975 3.27273 10.9091 2.78431 10.9091 2.18182V1.09091ZM10.9091 21.8182C10.9091 21.2157 11.3975 20.7273 12 20.7273V20.7273C12.6025 20.7273 13.0909 21.2157 13.0909 21.8182V22.9091C13.0909 23.5116 12.6025 24 12 24V24C11.3975 24 10.9091 23.5116 10.9091 22.9091V21.8182ZM3.51491 5.05745C3.08895 4.63149 3.08895 3.94087 3.51491 3.51491V3.51491C3.94087 3.08895 4.63149 3.08895 5.05745 3.51491L5.82873 4.28618C6.25469 4.71214 6.25469 5.40277 5.82873 5.82873V5.82873C5.40277 6.25469 4.71214 6.25469 4.28618 5.82873L3.51491 5.05745ZM18.1713 19.7138C17.7453 19.2879 17.7453 18.5972 18.1713 18.1713V18.1713C18.5972 17.7453 19.2879 17.7453 19.7138 18.1713L20.4851 18.9425C20.9111 19.3685 20.9111 20.0591 20.4851 20.4851V20.4851C20.0591 20.9111 19.3685 20.9111 18.9425 20.4851L18.1713 19.7138ZM18.9421 3.51464C19.3682 3.0883 20.0594 3.08834 20.4855 3.51473V3.51473C20.9113 3.94083 20.9111 4.63141 20.4852 5.05736L19.7139 5.82864C19.2879 6.25465 18.5972 6.25465 18.1712 5.82864V5.82864C17.7452 5.4027 17.7452 4.71213 18.171 4.28609L18.9421 3.51464ZM4.28618 18.1713C4.71214 17.7453 5.40277 17.7453 5.82873 18.1713V18.1713C6.25469 18.5972 6.25469 19.2879 5.82873 19.7138L5.05746 20.4851C4.63149 20.9111 3.94087 20.9111 3.51491 20.4851V20.4851C3.08895 20.0591 3.08895 19.3685 3.51491 18.9425L4.28618 18.1713ZM22.9091 10.9091C23.5116 10.9091 24 11.3975 24 12V12C24 12.6025 23.5116 13.0909 22.9091 13.0909H21.8182C21.2157 13.0909 20.7273 12.6025 20.7273 12V12C20.7273 11.3975 21.2157 10.9091 21.8182 10.9091H22.9091ZM2.18182 10.9091C2.78431 10.9091 3.27273 11.3975 3.27273 12V12C3.27273 12.6025 2.78431 13.0909 2.18182 13.0909H1.09091C0.488417 13.0909 0 12.6025 0 12V12C0 11.3975 0.488417 10.9091 1.09091 10.9091H2.18182Z'
                  fill='#A2A2A8'
                />
              </svg>
            ) : (
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M9.6 6C9.59976 7.66877 10.0966 9.29979 11.0271 10.6851C11.9576 12.0703 13.2796 13.147 14.8245 13.7779C16.3695 14.4087 18.0673 14.5651 19.7015 14.2271C21.1161 13.9345 22.4275 13.3728 23.512 12.4539C23.698 12.2963 24 12.4229 24 12.6667C24 19.2943 18.6276 24 12 24C5.3724 24 0 18.6276 0 12C0 5.3724 4.70573 0 11.3333 0C11.6208 0 11.7699 0.35622 11.5841 0.575553C11.0336 1.22558 10.5844 1.95701 10.2534 2.74522C9.82058 3.77568 9.59843 4.88234 9.6 6ZM2.4 12C2.39913 14.142 3.11463 16.2227 4.43267 17.9112C5.75071 19.5996 7.59556 20.7987 9.67369 21.3178C11.7518 21.8368 13.9439 21.646 15.901 20.7756C17.8582 19.9052 19.468 18.4052 20.4744 16.5144C18.6833 16.9364 16.8141 16.8937 15.0442 16.3905C13.2742 15.8872 11.6622 14.9401 10.3611 13.6389C9.0599 12.3378 8.11278 10.7258 7.60954 8.95581C7.1063 7.18586 7.06364 5.31667 7.4856 3.5256C5.94909 4.34416 4.66414 5.5652 3.76831 7.05797C2.87247 8.55075 2.39949 10.2591 2.4 12Z'
                  fill='#A2A2A8'
                />
              </svg>
            )}
            <h1 className='text-iconColor dark:text-text-color ]'>{isDarkMode ? `${t2('dark')}` : `${t2('light')}`}</h1>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader

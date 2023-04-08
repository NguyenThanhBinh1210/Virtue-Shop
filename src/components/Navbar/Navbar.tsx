import { useMutation } from 'react-query'
import { logout } from 'src/apis/auth.api'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'
import { Link, useLocation } from 'react-router-dom'
import { clearLS } from 'src/utils/auth'
import useDarkMode from 'src/hooks/useDarkMode'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const { isAuthenticated, reset } = useContext(AppContext)
  const [isDarkMode, toggleDarkMode] = useDarkMode()
  const logOutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      reset()
      clearLS()
      toast.success('Đăng xuất thành công!')
    }
  })
  const handleLogout = () => {
    logOutMutation.mutate()
  }
  const location = useLocation()
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
    <div
      className={` mobile:hidden shadow-md flex flex-col justify-between dark:bg-[#1C1C24] rounded-lg ml-4 max-h-[600px] `}
    >
      <div>
        <div className='py-8 px-4'>
          <Link to='/'>
            <button
              className={`hover:stroke-primary hover:bg-[#F1FBF7] ${
                location.pathname === '/' || location.pathname === '/product'
                  ? `stroke-primary dark:bg-[#3A3A43] bg-[#F1FBF7] `
                  : 'stroke-[#A2A2A8]'
              } mb-5 dark:hover:bg-[#3A3A43] w-[48px] h-[48px] flex items-center  justify-center rounded-lg `}
            >
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M3 6.5C3 3.87479 3.02811 3 6.5 3C9.97189 3 10 3.87479 10 6.5C10 9.12521 10.0111 10 6.5 10C2.98893 10 3 9.12521 3 6.5Z'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M14 6.5C14 3.87479 14.0281 3 17.5 3C20.9719 3 21 3.87479 21 6.5C21 9.12521 21.0111 10 17.5 10C13.9889 10 14 9.12521 14 6.5Z'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M3 17.5C3 14.8748 3.02811 14 6.5 14C9.97189 14 10 14.8748 10 17.5C10 20.1252 10.0111 21 6.5 21C2.98893 21 3 20.1252 3 17.5Z'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M14 17.5C14 14.8748 14.0281 14 17.5 14C20.9719 14 21 14.8748 21 17.5C21 20.1252 21.0111 21 17.5 21C13.9889 21 14 20.1252 14 17.5Z'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </Link>
          <Link to='/cart'>
            <button
              className={`${
                location.pathname === '/cart' ? `stroke-primary dark:bg-[#3A3A43] bg-[#F1FBF7] ` : 'stroke-[#A2A2A8]'
              } hover:stroke-primary relative mb-5 dark:hover:bg-[#3A3A43] hover:bg-[#F1FBF7]
              w-[48px] h-[48px] flex items-center  justify-center rounded-lg `}
            >
              {/* {profileAccessToken && (
                <div className='absolute text-primary dark:border-2 dark:border-[#A2A2A8] dark:bg-[#3A3A43] dark:shadow-xl font-[600] top-0 right-0 shadow-md w-6 h-6 flex items-center justify-center z-1 bg-white rounded-full'>
                  {purchaseData ? purchaseData.data.data.length : null}
                </div>
              )} */}
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g clipPath='url(#clip0_2752_5418)'>
                  <path
                    d='M4.46098 11H2.1C1.49249 11 1 10.5026 1 9.88889V2.11111C1 1.49746 1.49249 1 2.1 1H21.9C22.5075 1 23 1.49746 23 2.11111V9.88889C23 10.5026 22.5075 11 21.9 11H19.8207'
                    strokeWidth='2'
                  />
                  <path
                    d='M19.4286 6H4.57143C4.25583 6 4 6.24551 4 6.54839V22.4516C4 22.7545 4.25583 23 4.57143 23H19.4286C19.7442 23 20 22.7545 20 22.4516V6.54839C20 6.24551 19.7442 6 19.4286 6Z'
                    strokeWidth='2'
                  />
                  <path
                    d='M15 16.3794C15 16.8153 14.8949 17.2259 14.6848 17.6114C14.4825 17.9886 14.179 18.3029 13.7744 18.5543C13.3775 18.7973 12.9066 18.9398 12.3619 18.9817V20H11.6148V18.9691C10.8366 18.8937 10.2101 18.6423 9.73537 18.2149C9.2607 17.779 9.0156 17.1924 9 16.4549H10.751C10.7977 17.0583 11.0856 17.4229 11.6148 17.5486V15.1474C11.0545 14.9966 10.6031 14.8457 10.2607 14.6949C9.9183 14.544 9.62258 14.301 9.37358 13.9657C9.1245 13.6304 9 13.1737 9 12.5954C9 11.8663 9.24128 11.2713 9.72375 10.8103C10.214 10.3493 10.8443 10.0853 11.6148 10.0183V9H12.3619V10.0183C13.109 10.0853 13.7043 10.3284 14.1479 10.7474C14.5992 11.1665 14.8522 11.7447 14.9066 12.4823H13.144C13.1206 12.2393 13.0389 12.0297 12.8988 11.8537C12.7665 11.6693 12.5876 11.5394 12.3619 11.464V13.84C12.9455 13.9993 13.4047 14.1543 13.7393 14.3051C14.0817 14.4476 14.3774 14.6864 14.6264 15.0217C14.8755 15.3486 15 15.8011 15 16.3794ZM10.7043 12.5074C10.7043 12.784 10.7821 13.0103 10.9378 13.1863C11.0934 13.3539 11.3191 13.4922 11.6148 13.6011V11.4263C11.3346 11.4682 11.1128 11.5813 10.9494 11.7657C10.786 11.9501 10.7043 12.1973 10.7043 12.5074ZM12.3619 17.5737C12.6576 17.515 12.8872 17.3851 13.0506 17.184C13.2218 16.9829 13.3074 16.7398 13.3074 16.4549C13.3074 16.1783 13.2256 15.9562 13.0622 15.7886C12.8988 15.621 12.6654 15.4827 12.3619 15.3737V17.5737Z'
                    fill='#A2A2A8'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_2752_5418'>
                    <rect width='24' height='24' fill='white' />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </Link>
          <Link to='/order'>
            <button
              className={`${
                location.pathname === '/order' ? `stroke-primary  dark:bg-[#3A3A43] bg-[#F1FBF7] ` : 'stroke-[#A2A2A8]'
              } hover:stroke-primary  mb-5 dark:hover:bg-[#3A3A43] hover:bg-[#F1FBF7]
              w-[48px] h-[48px] flex items-center  justify-center rounded-lg `}
            >
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M18.1111 8.14286V5.57143C18.1111 4.88944 17.8536 4.23539 17.3951 3.75315C16.9367 3.27092 16.315 3 15.6667 3H3.44444C2.79614 3 2.17438 3.27092 1.71596 3.75315C1.25754 4.23539 1 4.88944 1 5.57143V13.2857C1 13.9677 1.25754 14.6218 1.71596 15.104C2.17438 15.5862 2.79614 15.8571 3.44444 15.8571H5.88889M8.33333 21H20.5556C21.2039 21 21.8256 20.7291 22.284 20.2468C22.7425 19.7646 23 19.1106 23 18.4286V10.7143C23 10.0323 22.7425 9.37825 22.284 8.89601C21.8256 8.41377 21.2039 8.14286 20.5556 8.14286H8.33333C7.68503 8.14286 7.06327 8.41377 6.60485 8.89601C6.14643 9.37825 5.88889 10.0323 5.88889 10.7143V18.4286C5.88889 19.1106 6.14643 19.7646 6.60485 20.2468C7.06327 20.7291 7.68503 21 8.33333 21ZM16.8889 14.5714C16.8889 15.2534 16.6313 15.9075 16.1729 16.3897C15.7145 16.8719 15.0928 17.1429 14.4444 17.1429C13.7961 17.1429 13.1744 16.8719 12.716 16.3897C12.2575 15.9075 12 15.2534 12 14.5714C12 13.8894 12.2575 13.2354 12.716 12.7532C13.1744 12.2709 13.7961 12 14.4444 12C15.0928 12 15.7145 12.2709 16.1729 12.7532C16.6313 13.2354 16.8889 13.8894 16.8889 14.5714Z'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </Link>
          <Link to='/profile'>
            <button
              className={`${
                location.pathname === '/profile'
                  ? `stroke-primary  dark:bg-[#3A3A43] bg-[#F1FBF7] `
                  : 'stroke-[#A2A2A8]'
              } hover:stroke-primary mb-5  dark:hover:bg-[#3A3A43] hover:bg-[#F1FBF7]
              w-[48px] h-[48px] flex items-center  justify-center rounded-lg`}
            >
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <circle cx='12' cy='9' r='3' strokeWidth='2' strokeLinecap='round' />
                <circle cx='12' cy='12' r='11' strokeWidth='2' />
                <path
                  d='M19 20C18.5871 18.8525 17.6773 17.8384 16.4117 17.1152C15.146 16.392 13.5953 16 12 16C10.4047 16 8.85398 16.392 7.58835 17.1152C6.32271 17.8384 5.41289 18.8525 5 20'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </button>
          </Link>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className={`hover:stroke-primary mb-5 stroke-[#A2A2A8] dark:hover:bg-[#3A3A43] hover:bg-[#F1FBF7]
              w-[48px] h-[48px] flex items-center  justify-center rounded-lg `}
            >
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M5 6.64513V5.551C5 3.43076 5 2.37064 5.67965 1.77328C6.35931 1.17591 7.41066 1.31197 9.51337 1.58408L16.77 2.52318C19.2611 2.84556 20.5067 3.00675 21.2533 3.85626C22 4.70577 22 5.9617 22 8.47356V15.5264C22 18.0383 22 19.2942 21.2533 20.1437C20.5067 20.9933 19.2611 21.1544 16.77 21.4768L9.51337 22.4159C7.41066 22.688 6.35931 22.8241 5.67965 22.2267C5 21.6294 5 20.5692 5 18.449V17.5726'
                  strokeWidth='2'
                />
                <path
                  className='hover:fill-primary fill-[#A2A2A8]'
                  d='M15 12L15.8107 11.4145L16.2335 12L15.8107 12.5855L15 12ZM1 13C0.447715 13 0 12.5523 0 12C0 11.4477 0.447715 11 1 11V13ZM11.4773 5.41451L15.8107 11.4145L14.1893 12.5855L9.85599 6.58549L11.4773 5.41451ZM15.8107 12.5855L11.4773 18.5855L9.85599 17.4145L14.1893 11.4145L15.8107 12.5855ZM15 13H1V11H15V13Z'
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div>
        <button
          onClick={changLanguage}
          className='mb-5 text-[#A2A2A8] shadow-lg dark:shadow-md w-[48px] h-[48px] flex items-center justify-center rounded-lg mx-auto '
        >
          {currentLanguage.toLocaleUpperCase()}
        </button>
        <button
          className='mb-10 shadow-lg dark:shadow-md w-[48px] h-[48px] flex items-center justify-center rounded-lg mx-auto '
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
        </button>
      </div>
    </div>
  )
}

export default Navbar

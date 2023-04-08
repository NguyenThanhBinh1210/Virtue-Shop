import { useContext, useState } from 'react'
import { useMutation } from 'react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { logout } from 'src/apis/auth.api'
import { AppContext } from 'src/contexts/app.context'

const AdminHeader = () => {
  const [showCategory, setShowCategory] = useState(false)
  const [showProduct, setShowProduct] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const { reset } = useContext(AppContext)

  const logOutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      reset()
      toast.success('Đăng xuất thành công!')
    }
  })
  const handleLogout = () => {
    logOutMutation.mutate()
  }
  return (
    <div
      id='drawer-navigation'
      className={`${
        !showMenu ? 'p-4 w-80 ' : 'p-0 w-0'
      } dark:bg-gray-700 non-scroll top-0 relative left-0 z-40 h-screen p-4  transition-all  bg-white w-80 `}
      tabIndex={-1}
      aria-labelledby='drawer-navigation-label'
    >
      <h5
        id='drawer-navigation-label'
        className={` ${showMenu ? 'hidden' : ''} text-base font-semibold text-gray-500 uppercase dark:text-gray-400 `}
      >
        Menu
      </h5>
      <div className='py-4 overflow-y-auto'>
        <ul className='space-y-2'>
          <li>
            <Link
              to='/admin'
              className='flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <svg
                aria-hidden='true'
                className='w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z' />
                <path d='M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z' />
              </svg>
              <span className='ml-3'>Dashboard</span>
            </Link>
          </li>
          <li>
            <button
              type='button'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
              aria-controls='dropdown-example'
              data-collapse-toggle='dropdown-example'
              onClick={() => setShowCategory(!showCategory)}
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='flex-1 ml-3 text-left whitespace-nowrap'>Category</span>
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
            <ul id='dropdown-example' className={` py-2 space-y-2 ${showCategory ? 'hidden' : 'block'}`}>
              <li>
                <Link
                  to='/admin/category/add'
                  className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                >
                  Create category
                </Link>
              </li>
              <li>
                <Link
                  to='/admin/category/list'
                  className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                >
                  List Category
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <button
              type='button'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
              aria-controls='dropdown-example'
              data-collapse-toggle='dropdown-example'
              onClick={() => setShowProduct(!showProduct)}
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='flex-1 ml-3 text-left whitespace-nowrap'>Product</span>
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
            <ul id='dropdown-example' className={` py-2 space-y-2 ${showProduct ? 'hidden' : 'block'}`}>
              <li>
                <Link
                  to='/admin/product/add'
                  className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                >
                  Create Product
                </Link>
              </li>
              <li>
                <Link
                  to='/admin/product/list'
                  className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                >
                  List Product
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link
              to=''
              className='flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z' />
                <path d='M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z' />
              </svg>
              <span className='flex-1 ml-3 whitespace-nowrap'>Inbox</span>
              <span className='inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300'>
                3
              </span>
            </Link>
          </li>
          <li>
            <Link
              to='/admin/list-user'
              className='flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
              </svg>
              <span className='flex-1 ml-3 whitespace-nowrap'>Users</span>
            </Link>
          </li>
          <li>
            <Link
              to='/admin/order'
              className='flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='flex-1 ml-3 whitespace-nowrap'>Orders</span>
            </Link>
          </li>
          <li>
            <Link
              to=''
              onClick={() => handleLogout()}
              className='flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='flex-1 ml-3 whitespace-nowrap'>Sign out</span>
            </Link>
          </li>
        </ul>
      </div>
      <button
        type='button'
        onClick={() => setShowMenu(!showMenu)}
        className='absolute right-[-100px] bottom-[20px] text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
      >
        {showMenu ? 'Menu' : 'Đóng'}
      </button>
    </div>
  )
}

export default AdminHeader

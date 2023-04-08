import { useContext, lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from './contexts/app.context'
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout'
import RegisterLayout from './layouts/RegisterLayout'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import Evaluate from './pages/Evaluate/Evaluate'
// import Login from './pages/Login'
import NotFound from './pages/NotFound/NotFound'
import UserOrder from './pages/Order/UserOrder'
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess'
import ProductDetail from './pages/ProductDetail'
import ProductList from './pages/ProductList'
import Profile from './pages/Profile'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import VerifyEmailByForgotPass from './pages/VerifyEmail/VerifyEmailByForgotPass'
import VerifyEmailByLLogin from './pages/VerifyEmail/VerifyEmailByLogin'

const Login = lazy(() => import('./pages/Login'))
function ProtecedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='login' />
}
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
function IsRegisterTemp() {
  const tempAuth = localStorage.getItem('temp')
  return tempAuth ? <Outlet /> : <Navigate to='login' />
}

const useRouteElements = () => {
  const routeElements = useRoutes([
    {
      path: '/',
      index: true,
      element: (
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      )
    },
    {
      path: '',
      element: <ProtecedRoute />,
      children: [
        {
          path: '/profile',
          element: (
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          )
        },
        {
          path: '/cart',
          element: (
            <DashboardLayout>
              <Cart />
            </DashboardLayout>
          )
        },
        {
          path: '/order',
          element: (
            <DashboardLayout>
              <UserOrder />
            </DashboardLayout>
          )
        },
        {
          path: '/evaluate',
          element: (
            <DashboardLayout>
              <Evaluate />
            </DashboardLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: 'login',
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: 'register',
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        },
        {
          path: 'forgot-password',
          element: (
            <RegisterLayout>
              <VerifyEmailByForgotPass />
            </RegisterLayout>
          )
        },
        {
          path: 'reset-password',
          element: (
            <RegisterLayout>
              <ResetPassword />
            </RegisterLayout>
          )
        },
        {
          path: '',
          element: <IsRegisterTemp />,
          children: [
            {
              path: 'verify',
              element: (
                <RegisterLayout>
                  <VerifyEmailByLLogin />
                </RegisterLayout>
              )
            }
          ]
        }
      ]
    },
    {
      path: '/product',
      element: (
        <DashboardLayout>
          <ProductList />
        </DashboardLayout>
      )
    },
    {
      path: '/product/:id',
      element: (
        <DashboardLayout>
          <ProductDetail />
        </DashboardLayout>
      )
    },
    {
      path: '/payment-success',
      index: true,
      element: <PaymentSuccess></PaymentSuccess>
    },
    {
      path: '*',
      index: true,
      element: <NotFound></NotFound>
    }
  ])
  return routeElements
}

export default useRouteElements

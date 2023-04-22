import { useContext, lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from './contexts/app.context'
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout'
import RegisterLayout from './layouts/RegisterLayout'

const Login = lazy(() => import('./pages/Login'))
const Cart = lazy(() => import('./pages/Cart'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Evaluate = lazy(() => import('./pages/Evaluate/Evaluate'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound'))
const UserOrder = lazy(() => import('./pages/Order/UserOrder'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess/PaymentSuccess'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Profile = lazy(() => import('./pages/Profile'))
const Register = lazy(() => import('./pages/Register'))
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword'))
const VerifyEmailByForgotPass = lazy(() => import('./pages/VerifyEmail/VerifyEmailByForgotPass'))
const VerifyEmailByLLogin = lazy(() => import('./pages/VerifyEmail/VerifyEmailByLogin'))
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
          <Suspense>
            <Dashboard />
          </Suspense>
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
              <Suspense>
                <Profile />
              </Suspense>
            </DashboardLayout>
          )
        },
        {
          path: '/cart',
          element: (
            <DashboardLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </DashboardLayout>
          )
        },
        {
          path: '/order',
          element: (
            <DashboardLayout>
              <Suspense>
                <UserOrder />
              </Suspense>
            </DashboardLayout>
          )
        },
        {
          path: '/evaluate',
          element: (
            <DashboardLayout>
              <Suspense>
                <Evaluate />
              </Suspense>
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
              <Suspense>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: 'forgot-password',
          element: (
            <RegisterLayout>
              <Suspense>
                <VerifyEmailByForgotPass />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: 'reset-password',
          element: (
            <RegisterLayout>
              <Suspense>
                <ResetPassword />
              </Suspense>
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
                  <Suspense>
                    <VerifyEmailByLLogin />
                  </Suspense>
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
          <Suspense>
            <ProductList />
          </Suspense>
        </DashboardLayout>
      )
    },
    {
      path: '/product/:id',
      element: (
        <DashboardLayout>
          <Suspense>
            <ProductDetail />
          </Suspense>
        </DashboardLayout>
      )
    },
    {
      path: '/payment-success',
      index: true,
      element: (
        <Suspense>
          <PaymentSuccess />
        </Suspense>
      )
    },
    {
      path: '*',
      index: true,
      element: (
        <Suspense>
          <NotFound></NotFound>
        </Suspense>
      )
    }
  ])
  return routeElements
}

export default useRouteElements

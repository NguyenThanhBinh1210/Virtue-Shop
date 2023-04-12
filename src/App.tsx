import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ChatBoxAI from './components/Chat/ChatBoxAI'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { deleteOtp } from './apis/auth.api'
import { getProfileFromLS } from 'src/utils/auth'
function App() {
  const location = useLocation()
  const profile = getProfileFromLS()
  const backMutation = useMutation({
    mutationFn: () => {
      return deleteOtp(profile.email)
    }
  })
  useEffect(() => {
    if (location.pathname !== '/verify') {
      localStorage.removeItem('count')
      backMutation.mutate()
    }
    localStorage.setItem(
      'chat',
      JSON.stringify([
        {
          id: 1,
          userId: 'bot',
          text: 'Chào bạn đến với Virtue shop, bạn có câu hỏi gì không ?'
        }
      ])
    )
  }, [])
  const routeElements = useRouteElements()
  return (
    <div className='dark:bg-[#13131A] '>
      {routeElements}
      <ToastContainer />
      <ChatBoxAI></ChatBoxAI>
    </div>
  )
}

export default App

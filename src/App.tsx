import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ChatBoxAI from './components/Chat/ChatBoxAI'

function App() {
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

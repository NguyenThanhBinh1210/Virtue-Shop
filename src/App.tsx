import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const routeElements = useRouteElements()
  return (
    <div className='dark:bg-[#13131A] '>
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App

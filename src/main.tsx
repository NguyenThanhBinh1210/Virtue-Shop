import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter } from 'react-router-dom'
import App from 'src/App'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import { AppProvider } from './contexts/app.context'
import './index.css'
import 'src/i18n/i18n'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AppProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </BrowserRouter>
  </>
)

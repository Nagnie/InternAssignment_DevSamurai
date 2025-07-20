import { BrowserRouter as Router, useRoutes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'
import { routeConfig } from './config/routeConfig.tsx'
import { ThemeProvider } from "@/components/theme-provider.tsx"
import './App.css'

const queryClient = new QueryClient()

function AppRoutes() {
    const routes = useRoutes(routeConfig)
    return routes
}

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <AppRoutes />
                    </Router>
                </QueryClientProvider>
            </ThemeProvider>
        </Provider>
    )
}

export default App
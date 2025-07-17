import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from "@/components/Layout.tsx";
import './App.css'

const queryClient = new QueryClient()

function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Routes>
                        <Route path="/login" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Dashboard />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </Router>
            </QueryClientProvider>
        </Provider>
    )
}

export default App
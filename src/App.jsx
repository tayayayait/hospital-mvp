import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import ConsentPage from './pages/ConsentPage'
import DashboardPage from './pages/DashboardPage'
import CaseCreatePage from './pages/CaseCreatePage'
import CaseDetailPage from './pages/CaseDetailPage'
import ProcessingPage from './pages/ProcessingPage'
import AnalysisResultPage from './pages/AnalysisResultPage'
import SettingsPage from './pages/SettingsPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'

// 인증이 필요한 라우트를 보호하는 컴포넌트
function ProtectedRoute({ children }) {
    const { isAuthenticated, hasConsented } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!hasConsented) {
        return <Navigate to="/consent" replace />
    }

    return children
}

// 이미 로그인된 사용자를 리다이렉트
function PublicRoute({ children }) {
    const { isAuthenticated, hasConsented } = useAuth()

    if (isAuthenticated && hasConsented) {
        return <Navigate to="/" replace />
    }

    return children
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/consent"
                element={<ConsentPage />}
            />

            {/* Protected Routes with MainLayout */}
            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardPage />} />
                <Route path="cases/new" element={<CaseCreatePage />} />
                <Route path="cases/:id" element={<CaseDetailPage />} />
                <Route path="cases/:id/processing" element={<ProcessingPage />} />
                <Route path="cases/:id/result" element={<AnalysisResultPage />} />
                <Route path="settings/*" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <AppRoutes />
            </ToastProvider>
        </AuthProvider>
    )
}

export default App

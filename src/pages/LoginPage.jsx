import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import './LoginPage.css'

/**
 * 로그인 페이지
 * 상세서.md Section 7.1 기반
 */
function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { login } = useAuth()
    const { showError } = useToast()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await login(email, password)

            if (result.success) {
                navigate('/consent')
            } else {
                setError(result.error)
                showError(result.error)
            }
        } catch (err) {
            const errorMsg = '로그인 중 오류가 발생했습니다.'
            setError(errorMsg)
            showError(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <Card className="login-card">
                <div className="login-header">
                    <span className="login-logo">🏥</span>
                    <h1 className="login-title">의료 AI 서비스</h1>
                    <p className="login-subtitle">의료진 전용 로그인</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="login-error" role="alert">
                            {error}
                        </div>
                    )}

                    <Input
                        label="이메일"
                        type="email"
                        placeholder="example@hospital.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <Input
                        label="비밀번호"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={loading}
                    >
                        로그인
                    </Button>
                </form>

                <a href="#" className="login-forgot">비밀번호 재설정</a>
            </Card>
        </div>
    )
}

export default LoginPage

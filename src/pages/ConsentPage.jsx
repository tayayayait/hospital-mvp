import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import Card from '../components/Card'
import './ConsentPage.css'

/**
 * 동의/주의 고지 페이지
 * 상세서.md Section 7.2 기반
 */
function ConsentPage() {
    const [consent1, setConsent1] = useState(false)
    const [consent2, setConsent2] = useState(false)

    const { acceptConsent, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const allConsented = consent1 && consent2

    const handleSubmit = (e) => {
        e.preventDefault()
        if (allConsented) {
            acceptConsent()
            navigate('/')
        }
    }

    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
        navigate('/login')
        return null
    }

    return (
        <div className="consent-page">
            <Card className="consent-card">
                <div className="consent-header">
                    <span className="consent-icon">⚕️</span>
                    <h1 className="consent-title">서비스 이용 동의</h1>
                    <p className="consent-subtitle">
                        의료 AI 서비스를 이용하기 전에 아래 내용을 확인하고 동의해 주세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="consent-form">
                    <div className="consent-item">
                        <label className="consent-checkbox">
                            <input
                                type="checkbox"
                                checked={consent1}
                                onChange={(e) => setConsent1(e.target.checked)}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="consent-text">
                                <strong>[필수]</strong> 본 서비스는 의료진 판단을 보조하는
                                <strong> 참고정보</strong>입니다. 최종 판단은 의료 전문가의 진료를 통해
                                이루어져야 합니다.
                            </span>
                        </label>
                    </div>

                    <div className="consent-item">
                        <label className="consent-checkbox">
                            <input
                                type="checkbox"
                                checked={consent2}
                                onChange={(e) => setConsent2(e.target.checked)}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="consent-text">
                                <strong>[필수]</strong> 데이터 처리 및 보관 정책에 동의합니다.
                            </span>
                        </label>
                    </div>

                    <div className="consent-links">
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            개인정보처리방침
                        </a>
                        <span>|</span>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            이용약관
                        </a>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={!allConsented}
                    >
                        동의하고 계속
                    </Button>
                </form>
            </Card>
        </div>
    )
}

export default ConsentPage

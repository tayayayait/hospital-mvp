import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// 역할 정의 (상세서.md Section 7.8 기반)
export const ROLES = {
    ADMIN: 'admin',
    CLINICIAN: 'clinician', // 의료진
    STAFF: 'staff',         // 상담사
    VIEWER: 'viewer'        // 읽기 전용
}

// 역할별 권한
const PERMISSIONS = {
    [ROLES.ADMIN]: ['create_case', 'view_case', 'download', 'settings', 'manage_users', 'view_sensitive'],
    [ROLES.CLINICIAN]: ['create_case', 'view_case', 'download', 'view_sensitive'],
    [ROLES.STAFF]: ['create_case', 'view_case', 'download'],
    [ROLES.VIEWER]: ['view_case']
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [hasConsented, setHasConsented] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // 초기화 시 로컬 스토리지에서 상태 복원 또는 자동 로그인
    useEffect(() => {
        const storedUser = localStorage.getItem('medai_user')
        const storedConsent = localStorage.getItem('medai_consent')

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                localStorage.removeItem('medai_user')
            }
        } else {
            // 자동 로그인 (개발 편의성 / 사용자 요청)
            const defaultUser = {
                id: 'admin-auto',
                email: 'admin@hospital.com',
                name: '관리자',
                role: ROLES.ADMIN,
                createdAt: new Date().toISOString()
            }
            setUser(defaultUser)
            // localStorage.setItem('medai_user', JSON.stringify(defaultUser)) // 원하면 저장
        }

        // 동의 상태도 자동으로 true 처리
        if (storedConsent === 'true') {
            setHasConsented(true)
        } else {
            setHasConsented(true) // 자동 동의 처리
        }

        setIsLoading(false)
    }, [])

    // 로그인 함수 (MVP: 간단한 Mock 인증)
    const login = async (email, password) => {
        // MVP Mock 인증 - 실제 구현 시 API 호출로 대체
        if (email && password) {
            const mockUser = {
                id: 'user-001',
                email,
                name: email.split('@')[0],
                role: email.includes('admin') ? ROLES.ADMIN : ROLES.CLINICIAN,
                createdAt: new Date().toISOString()
            }

            setUser(mockUser)
            localStorage.setItem('medai_user', JSON.stringify(mockUser))
            return { success: true }
        }

        // 자동 로그인 모드에서도 명시적 로그인은 허용
        return { success: true }
    }

    // 로그아웃
    const logout = () => {
        setUser(null)
        setHasConsented(false)
        localStorage.removeItem('medai_user')
        localStorage.removeItem('medai_consent')
    }

    // 동의 처리
    const acceptConsent = () => {
        setHasConsented(true)
        localStorage.setItem('medai_consent', 'true')
        localStorage.setItem('medai_consent_date', new Date().toISOString())
    }

    // 권한 확인
    const hasPermission = (permission) => {
        if (!user) return false
        const userPermissions = PERMISSIONS[user.role] || []
        return userPermissions.includes(permission)
    }

    // 역할 확인
    const hasRole = (role) => {
        return user?.role === role
    }

    const value = {
        user,
        isAuthenticated: !!user,
        hasConsented,
        isLoading,
        login,
        logout,
        acceptConsent,
        hasPermission,
        hasRole,
        ROLES
    }

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                color: 'var(--color-text-muted)'
            }}>
                로딩 중...
            </div>
        )
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext

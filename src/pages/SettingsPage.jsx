import { useState } from 'react'
import { Users, FileText, Save, Plus, Edit, Trash2 } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import Select from '../components/Select'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'
import './SettingsPage.css'

// 탭 정의
// 탭 정의
const TABS = [
    { id: 'users', label: '사용자 관리', icon: Users },
    { id: 'audit', label: '감사 로그', icon: FileText },
]

// Mock 사용자 데이터
const MOCK_USERS = [
    { id: 1, email: 'admin@hospital.com', name: '관리자', role: 'Admin', status: 'active', lastLogin: '2026-01-16 09:00' },
    { id: 2, email: 'doctor1@hospital.com', name: '김의사', role: 'Clinician', status: 'active', lastLogin: '2026-01-16 10:30' },
    { id: 3, email: 'staff1@hospital.com', name: '이상담', role: 'Staff', status: 'active', lastLogin: '2026-01-15 14:00' },
    { id: 4, email: 'viewer@hospital.com', name: '박열람', role: 'Viewer', status: 'inactive', lastLogin: '2026-01-10 11:00' },
]

// Mock 감사 로그
const MOCK_AUDIT_LOGS = [
    { id: 1, timestamp: '2026-01-16 10:30:15', user: 'doctor1@hospital.com', action: 'CASE_CREATE', resource: 'CASE-003', details: '새 케이스 생성' },
    { id: 2, timestamp: '2026-01-16 10:15:32', user: 'doctor1@hospital.com', action: 'ANALYSIS_REQUEST', resource: 'CASE-001', details: 'AI 분석 요청' },
    { id: 3, timestamp: '2026-01-16 09:30:00', user: 'doctor1@hospital.com', action: 'CASE_CREATE', resource: 'CASE-001', details: '새 케이스 생성' },
    { id: 4, timestamp: '2026-01-16 09:00:00', user: 'admin@hospital.com', action: 'LOGIN', resource: '-', details: '로그인 성공' },
    { id: 5, timestamp: '2026-01-15 18:00:00', user: 'admin@hospital.com', action: 'SETTINGS_UPDATE', resource: 'AI_CONFIG', details: 'API URL 변경' },
]

const ROLE_OPTIONS = [
    { value: 'Admin', label: '관리자 (Admin)' },
    { value: 'Clinician', label: '의료진 (Clinician)' },
    { value: 'Staff', label: '상담사 (Staff)' },
    { value: 'Viewer', label: '열람 전용 (Viewer)' },
]

const ACTION_LABELS = {
    LOGIN: '로그인',
    LOGOUT: '로그아웃',
    CASE_CREATE: '케이스 생성',
    CASE_UPDATE: '케이스 수정',
    CASE_DELETE: '케이스 삭제',
    ANALYSIS_REQUEST: '분석 요청',
    SETTINGS_UPDATE: '설정 변경',
}

/**
 * 설정 페이지 (관리자)
 * 상세서.md Section 7.8 기반
 */
function SettingsPage() {
    const [activeTab, setActiveTab] = useState('users')
    const { showSuccess, showError } = useToast()
    const { hasPermission } = useAuth()

    // 사용자 관리 상태
    const [users, setUsers] = useState(MOCK_USERS)
    const [showUserModal, setShowUserModal] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)

    // 감사 로그 상태
    const [auditLogs] = useState(MOCK_AUDIT_LOGS)
    const [logFilter, setLogFilter] = useState('')

    // AI 연결 테스트 (실제 API 호출)
    const handleTestConnection = async () => {
        setTesting(true)
        try {
            const result = await testConnection()
            if (result.success) {
                showSuccess('AI API 연결 성공! ' + (result.message || ''))
            } else {
                showError('연결 실패: ' + result.message)
            }
        } catch (err) {
            showError('연결 실패: ' + (err.message || 'API 설정을 확인하세요.'))
        } finally {
            setTesting(false)
        }
    }

    // AI 설정 저장
    const handleSaveSettings = async () => {
        setSaving(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            showSuccess('설정이 저장되었습니다.')
        } catch (err) {
            showError('저장 실패')
        } finally {
            setSaving(false)
        }
    }

    // 사용자 추가/수정
    const handleSaveUser = (userData) => {
        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u))
            showSuccess('사용자 정보가 수정되었습니다.')
        } else {
            setUsers([...users, { id: Date.now(), ...userData, status: 'active', lastLogin: '-' }])
            showSuccess('사용자가 추가되었습니다.')
        }
        setShowUserModal(false)
        setEditingUser(null)
    }

    // 사용자 삭제
    const handleDeleteUser = () => {
        setUsers(users.filter(u => u.id !== userToDelete.id))
        showSuccess('사용자가 삭제되었습니다.')
        setShowDeleteModal(false)
        setUserToDelete(null)
    }

    // 사용자 테이블 컬럼
    const userColumns = [
        { key: 'name', label: '이름', sortable: true },
        { key: 'email', label: '이메일', sortable: true },
        {
            key: 'role',
            label: '역할',
            render: (value) => (
                <Badge variant={value === 'Admin' ? 'danger' : value === 'Clinician' ? 'info' : 'default'}>
                    {ROLE_OPTIONS.find(r => r.value === value)?.label.split(' ')[0] || value}
                </Badge>
            )
        },
        {
            key: 'status',
            label: '상태',
            render: (value) => (
                <Badge variant={value === 'active' ? 'success' : 'default'}>
                    {value === 'active' ? '활성' : '비활성'}
                </Badge>
            )
        },
        { key: 'lastLogin', label: '마지막 로그인', sortable: true },
        {
            key: 'actions',
            label: '',
            width: '100px',
            render: (_, row) => (
                <div className="table-actions">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            setEditingUser(row)
                            setShowUserModal(true)
                        }}
                    >
                        <Edit size={14} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            setUserToDelete(row)
                            setShowDeleteModal(true)
                        }}
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            )
        }
    ]

    // 감사 로그 테이블 컬럼
    const auditColumns = [
        { key: 'timestamp', label: '시간', sortable: true, width: '160px' },
        { key: 'user', label: '사용자', sortable: true },
        {
            key: 'action',
            label: '액션',
            render: (value) => ACTION_LABELS[value] || value
        },
        { key: 'resource', label: '리소스' },
        { key: 'details', label: '상세' },
    ]

    // 필터링된 감사 로그
    const filteredLogs = auditLogs.filter(log =>
        !logFilter ||
        log.user.includes(logFilter) ||
        log.action.includes(logFilter) ||
        log.resource.includes(logFilter)
    )

    return (
        <div className="settings-page">
            <header className="settings-header">
                <h1 className="settings-title">설정</h1>
            </header>

            {/* 탭 네비게이션 */}
            <div className="settings-tabs">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* 탭 콘텐츠 */}
            <div className="settings-content">
                {/* 사용자 관리 */}
                {activeTab === 'users' && (
                    <Card
                        title="사용자 관리"
                        action={
                            <Button variant="primary" size="sm" onClick={() => setShowUserModal(true)}>
                                <Plus size={16} />
                                사용자 추가
                            </Button>
                        }
                        className="settings-card"
                    >
                        <Table
                            columns={userColumns}
                            data={users}
                        />
                    </Card>
                )}

                {/* 감사 로그 */}
                {activeTab === 'audit' && (
                    <Card title="감사 로그" className="settings-card">
                        <div className="audit-filter">
                            <Input
                                placeholder="사용자, 액션, 리소스 검색..."
                                value={logFilter}
                                onChange={(e) => setLogFilter(e.target.value)}
                            />
                        </div>
                        <Table
                            columns={auditColumns}
                            data={filteredLogs}
                        />
                    </Card>
                )}
            </div>

            {/* 사용자 추가/수정 모달 */}
            <UserFormModal
                isOpen={showUserModal}
                onClose={() => {
                    setShowUserModal(false)
                    setEditingUser(null)
                }}
                onSave={handleSaveUser}
                user={editingUser}
            />

            {/* 삭제 확인 모달 */}
            <Modal.Confirm
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setUserToDelete(null)
                }}
                onConfirm={handleDeleteUser}
                title="사용자 삭제"
                message={`"${userToDelete?.name}" 사용자를 삭제하시겠습니까?`}
                confirmText="삭제"
                confirmVariant="danger"
            />
        </div>
    )
}

// 사용자 폼 모달 컴포넌트
function UserFormModal({ isOpen, onClose, onSave, user }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Clinician',
    })

    // user가 변경되면 폼 데이터 업데이트
    useState(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
            })
        } else {
            setFormData({ name: '', email: '', role: 'Clinician' })
        }
    }, [user])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
        setFormData({ name: '', email: '', role: 'Clinician' })
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={user ? '사용자 수정' : '사용자 추가'}
            size="sm"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>취소</Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {user ? '수정' : '추가'}
                    </Button>
                </>
            }
        >
            <form className="user-form" onSubmit={handleSubmit}>
                <Input
                    label="이름"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="홍길동"
                />
                <Input
                    label="이메일"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@hospital.com"
                />
                <Select
                    label="역할"
                    required
                    options={ROLE_OPTIONS}
                    value={formData.role}
                    onChange={(val) => setFormData({ ...formData, role: val })}
                />
            </form>
        </Modal>
    )
}

export default SettingsPage

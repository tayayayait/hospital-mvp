import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import './DashboardPage.css'

// Mock 데이터 (MVP용)
const MOCK_CASES = [
    {
        id: 'CASE-001',
        patientSummary: '남성 / 50대 / 흉통',
        status: 'COMPLETED',
        riskLevel: 'high',
        createdAt: '2026-01-16 09:30',
        updatedAt: '2026-01-16 10:15',
    },
    {
        id: 'CASE-002',
        patientSummary: '여성 / 30대 / 두통',
        status: 'ANALYZING',
        riskLevel: 'medium',
        createdAt: '2026-01-16 11:00',
        updatedAt: '2026-01-16 11:02',
    },
    {
        id: 'CASE-003',
        patientSummary: '남성 / 70대 / 어지러움',
        status: 'QUEUED',
        riskLevel: 'low',
        createdAt: '2026-01-16 11:30',
        updatedAt: '2026-01-16 11:30',
    },
]

/**
 * 대시보드/케이스 목록 페이지
 * 상세서.md Section 7.3 기반
 */
function DashboardPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [cases] = useState(MOCK_CASES)
    const navigate = useNavigate()

    const filteredCases = cases.filter(c =>
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.patientSummary.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Table 컬럼 정의
    const columns = [
        {
            key: 'id',
            label: '케이스ID',
            sortable: true,
            render: (value) => <span className="case-id">{value}</span>
        },
        { key: 'patientSummary', label: '환자 요약', sortable: true },
        {
            key: 'status',
            label: '상태',
            render: (value) => <Badge.Status status={value} />
        },
        {
            key: 'riskLevel',
            label: '위험도',
            render: (value) => <Badge.Risk level={value} />
        },
        {
            key: 'createdAt',
            label: '생성일시',
            sortable: true,
            render: (value) => <span className="case-date">{value}</span>
        },
        {
            key: 'action',
            label: '액션',
            width: '80px',
            render: (_, row) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/cases/${row.id}`)
                    }}
                >
                    보기
                </Button>
            )
        },
    ]

    return (
        <div className="dashboard">
            {/* Page Header */}
            <header className="page-header">
                <div className="page-header-left">
                    <h1 className="page-title">케이스</h1>
                    <span className="page-subtitle">{cases.length}건</span>
                </div>
                <div className="page-header-right">
                    <Button
                        variant="primary"
                        onClick={() => navigate('/cases/new')}
                    >
                        <Plus size={18} />
                        새 케이스
                    </Button>
                </div>
            </header>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-left">
                    <div className="search-input-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="케이스ID, 환자정보 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter size={16} />
                        필터
                    </Button>
                </div>
            </div>

            {/* Case List - Desktop Table (새 Table 컴포넌트 사용) */}
            <div className="case-table-container">
                <Table
                    columns={columns}
                    data={filteredCases}
                    onRowClick={(row) => navigate(`/cases/${row.id}`)}
                    emptyState={
                        <div className="empty-state">
                            <span className="empty-icon">📋</span>
                            <h2>케이스가 없습니다</h2>
                            <p>새 케이스를 생성하여 AI 분석을 시작하세요.</p>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/cases/new')}
                            >
                                새 케이스 만들기
                            </Button>
                        </div>
                    }
                />
            </div>

            {/* Case List - Mobile Cards */}
            <div className="case-cards">
                {filteredCases.map(c => (
                    <Card
                        key={c.id}
                        className="case-card"
                        clickable
                        onClick={() => navigate(`/cases/${c.id}`)}
                    >
                        <div className="case-card-header">
                            <span className="case-id">{c.id}</span>
                            <Badge.Risk level={c.riskLevel} />
                        </div>
                        <div className="case-card-body">
                            <p className="case-patient">{c.patientSummary}</p>
                            <div className="case-card-footer">
                                <Badge.Status status={c.status} />
                                <span className="case-date">{c.createdAt}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default DashboardPage


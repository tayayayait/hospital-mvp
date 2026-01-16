import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    FilePlus,
    Settings,
    Menu,
    X,
    ChevronLeft,
    LogOut,
    User
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './MainLayout.css'

const NAV_ITEMS = [
    { path: '/', icon: LayoutDashboard, label: '대시보드', exact: true },
    { path: '/cases/new', icon: FilePlus, label: '새 케이스' },
    { path: '/settings', icon: Settings, label: '설정', adminOnly: true }
]

function MainLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, logout, hasRole, ROLES } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    const filteredNavItems = NAV_ITEMS.filter(item => {
        if (item.adminOnly) {
            return hasRole(ROLES.ADMIN)
        }
        return true
    })

    return (
        <div className="layout">
            {/* Header */}
            <header className="header">
                <div className="header-left">
                    <button
                        className="menu-toggle mobile-only"
                        onClick={toggleMobileMenu}
                        aria-label="메뉴 열기"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="logo">
                        <span className="logo-icon">🏥</span>
                        <span className="logo-text">의료 AI 서비스</span>
                    </div>
                </div>
                <div className="header-right">
                    <div className="user-menu">
                        <User size={20} />
                        <span className="user-name">{user?.name || '사용자'}</span>
                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                            aria-label="로그아웃"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar - Desktop */}
            <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <button
                    className="sidebar-toggle"
                    onClick={toggleSidebar}
                    aria-label={sidebarCollapsed ? '사이드바 확장' : '사이드바 축소'}
                >
                    <ChevronLeft size={20} className={sidebarCollapsed ? 'rotated' : ''} />
                </button>
                <nav className="sidebar-nav">
                    {filteredNavItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            title={sidebarCollapsed ? item.label : undefined}
                        >
                            <item.icon size={20} />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-overlay" onClick={toggleMobileMenu}>
                    <nav className="mobile-nav" onClick={e => e.stopPropagation()}>
                        {filteredNavItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.exact}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                onClick={toggleMobileMenu}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <div className="content-container">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Tab Bar */}
            <nav className="bottom-tab-bar mobile-only">
                {filteredNavItems.slice(0, 4).map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    )
}

export default MainLayout

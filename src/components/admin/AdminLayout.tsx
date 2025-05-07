import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import logo64 from '../../assets/logo/logo-64x64.png';
import logo128 from '../../assets/logo/logo-128x128.png';
import logo520 from '../../assets/logo/logo-520x240.png';

const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  background: #f8fafc;
`;

const Sidebar = styled.div<{ $isOpen: boolean }>`
  width: 250px;
  background: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  position: fixed;
  height: 100vh;
  z-index: 1000;

  @media (max-width: 768px) {
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 250px;
  padding: 2rem;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Header = styled.header`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #3074db;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Logo = styled.img`
  width: 140px;
  margin: 2.5rem auto 2rem auto;
  display: block;
`;

const Nav = styled.nav`
  padding: 2rem 0;
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  color: ${props => props.$active ? '#3074db' : '#64748b'};
  text-decoration: none;
  font-weight: ${props => props.$active ? '500' : '400'};
  transition: all 0.2s;
  border-left: 3px solid ${props => props.$active ? '#3074db' : 'transparent'};

  &:hover {
    background: #f1f5f9;
    color: #3074db;
  }
`;

const UserSection = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const UserRole = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #f1f5f9;
  border: none;
  border-radius: 0.5rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Products', path: '/admin/products' },
    { label: 'Orders', path: '/admin/orders' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Analytics', path: '/admin/analytics' },
    { label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <Layout>
      <Overlay isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(false)} />
      <Sidebar $isOpen={isSidebarOpen}>
        <Logo src={logo520} alt="Gennessence Water" />
        <Nav>
          {navItems.map(item => (
            <NavItem
              key={item.path}
              to={item.path}
              $active={location.pathname === item.path}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.label}
            </NavItem>
          ))}
        </Nav>
        <UserSection>
          <UserInfo>
            <UserName>{user?.name}</UserName>
            <UserRole>{user?.role}</UserRole>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserSection>
      </Sidebar>
      <MainContent>
        <Header>
          <MenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            ☰
          </MenuButton>
        </Header>
        {children}
      </MainContent>
    </Layout>
  );
};

export default AdminLayout; 
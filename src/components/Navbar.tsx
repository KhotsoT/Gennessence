import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Our Waters', href: '/our-waters' },
  { name: 'Cart', href: '/cart' },
];

const NavBarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background: rgba(255,255,255,0.95);
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.04);
  z-index: 2000;
  padding: 0 0.5rem;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 0.5rem;
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  @media (max-width: 800px) {
    display: none;
  }
`;

const NavLink = styled.li`
  position: relative;
`;

const NavAnchor = styled.a`
  color: #3074db;
  background: transparent;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: background 0.2s, color 0.2s;
  margin: 0 0.1rem;
  display: inline-block;
  &:hover {
    background: #e0e7ef;
    color: #2056a8;
  }
`;

const HamburgerBox = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(37,99,235,0.08);
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  transition: background 0.2s;
  &:active {
    background: rgba(37,99,235,0.18);
  }
`;

const HamburgerLines = styled.div<{ open: boolean }>`
  width: 24px;
  height: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: #3074db;
    border-radius: 2px;
    transition: 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  span:nth-child(1) {
    top: ${({ open }) => (open ? '10px' : '5px')};
    transform: ${({ open }) => (open ? 'rotate(45deg)' : 'none')};
  }
  span:nth-child(2) {
    top: 11px;
    opacity: ${({ open }) => (open ? 0 : 1)};
  }
  span:nth-child(3) {
    top: ${({ open }) => (open ? '10px' : '17px')};
    transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'none')};
  }
`;

const MobileMenu = styled.ul<{ open: boolean }>`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  flex-direction: column;
  position: fixed;
  top: 64px;
  left: 0;
  width: 100vw;
  background: #fff;
  box-shadow: 0 8px 32px 0 rgba(0,60,255,0.08);
  z-index: 150;
  padding: 2rem 0 1rem 0;
  gap: 1.5rem;
  align-items: center;
  list-style: none;
  margin: 0;
  @media (min-width: 801px) {
    display: none;
  }
`;

const MobileMenuButton = styled(NavAnchor)`
  display: block;
  width: 80%;
  margin: 1.2rem auto 0 auto;
  text-align: center;
  font-size: 1.08rem;
  font-weight: 600;
  background: #3074db;
  color: #fff;
  border-radius: 0.5rem;
  padding: 0.6rem 0;
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #2056a8;
    color: #fff;
  }
`;

const MobileMenuTextButton = styled.button`
  background: none;
  border: none;
  color: #3074db;
  font-size: 1.08rem;
  font-weight: 600;
  padding: 0;
  margin: 0;
  cursor: pointer;
  transition: color 0.2s, text-decoration 0.2s;
  &:hover {
    color: #2056a8;
    text-decoration: underline;
  }
`;

const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  z-index: 2010;
  @media (max-width: 800px) {
    display: block;
    position: fixed;
    top: 18px;
    right: 18px;
    margin: 0;
    padding: 0;
  }
`;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
  }, [user]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, to?: string) => {
    setMobileOpen(false);
    if (to) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <NavBarContainer>
      <NavContent>
        <NavLinks>
          {navItems.map((item) => (
            <NavLink key={item.name}>
              <NavAnchor as={Link} to={item.href} onClick={(e) => handleLinkClick(e, item.href)}>{item.name}</NavAnchor>
            </NavLink>
          ))}
          {user ? (
            <NavLink>
              <NavAnchor as="button" style={{ background: '#e0e7ef', color: '#2563eb', border: 'none', padding: '0.32rem 0.7rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.98rem', fontWeight: 500 }} onClick={logout}>Logout</NavAnchor>
            </NavLink>
          ) : (
            <NavLink>
              <NavAnchor as="button" style={{ background: '#3074db', color: '#fff', border: 'none', padding: '0.5rem 1.1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }} onClick={() => setAuthOpen(true)}>Login</NavAnchor>
            </NavLink>
          )}
        </NavLinks>
      </NavContent>
      <Hamburger onClick={() => setMobileOpen((v) => !v)} aria-label="Open menu">
        <HamburgerBox>
          <HamburgerLines open={mobileOpen}>
            <span />
            <span />
            <span />
          </HamburgerLines>
        </HamburgerBox>
      </Hamburger>
      <MobileMenu open={mobileOpen}>
        {navItems.map((item, idx) => (
          <li key={item.name} style={{ marginBottom: idx === navItems.length - 1 ? 0 : '1.5rem' }}>
            <NavAnchor as={Link} to={item.href} onClick={(e) => handleLinkClick(e, item.href)}>{item.name}</NavAnchor>
          </li>
        ))}
        {user ? (
          <li>
            <MobileMenuTextButton onClick={logout}>Logout</MobileMenuTextButton>
          </li>
        ) : (
          <li>
            <MobileMenuButton as="button" onClick={() => setAuthOpen(true)}>Login</MobileMenuButton>
          </li>
        )}
      </MobileMenu>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </NavBarContainer>
  );
}
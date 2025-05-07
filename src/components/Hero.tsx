import styled from 'styled-components';
import logoLarge from '../assets/logo/logo-780x360.png';
import AuthModal from './AuthModal';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HeroContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6fbff 0%, #eaf3fa 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeroInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  width: 320px;
  max-width: 90vw;
  margin-bottom: 2rem;
  border-radius: 1.5rem;
  background: rgba(255,255,255,0.85);
  box-shadow: 0 8px 32px 0 rgba(0,60,255,0.10);
  padding: 2rem 2.5rem;
`;

const Tagline = styled.p`
  font-size: 2rem;
  color: #3074db;
  margin-bottom: 2.5rem;
  font-weight: 300;
  text-align: center;
`;

const CTA = styled.button`
  display: inline-block;
  background: #3074db;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  padding: 1.25rem 3rem;
  border-radius: 999px;
  box-shadow: 0 8px 32px 0 rgba(0,60,255,0.12);
  text-decoration: none;
  transition: background 0.2s, transform 0.2s, outline 0.2s;
  border: none;
  cursor: pointer;
  &:hover {
    background: #2056a8;
    transform: scale(1.05);
  }
  &:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

export default function Hero() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetHydrated = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <HeroContainer>
      <HeroInner>
        <Logo src={logoLarge} alt="Gennessence Water Logo" />
        <Tagline>
          Sip, Smile, Repeat.
        </Tagline>
        <CTA as="button" onClick={handleGetHydrated}>Get Hydrated</CTA>
      </HeroInner>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </HeroContainer>
  );
} 
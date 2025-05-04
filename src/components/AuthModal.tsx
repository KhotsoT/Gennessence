import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { updateProfile, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30, 41, 59, 0.25);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px 0 rgba(0,60,255,0.10);
  padding: 2.5rem 2rem 2rem 2rem;
  min-width: 320px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3074db;
  margin-bottom: 1.5rem;
`;

const NameRow = styled.div`
  display: flex;
  gap: 0.7rem;
  width: 100%;
  margin-bottom: 1.1rem;
`;

const NameInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.8rem 1rem;
  border-radius: 0.7rem;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  &:focus {
    outline: 2px solid #3074db;
    border-color: #3074db;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1.1rem;
  border-radius: 0.7rem;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  &:focus {
    outline: 2px solid #3074db;
    border-color: #3074db;
  }
`;

const Button = styled.button`
  width: 100%;
  background: #3074db;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.9rem 0;
  border-radius: 999px;
  border: none;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: #2056a8;
    transform: scale(1.03);
  }
`;

const Switch = styled.div`
  margin-top: 1.2rem;
  font-size: 0.98rem;
  color: #64748b;
  text-align: center;
  span {
    color: #3074db;
    cursor: pointer;
    font-weight: 600;
    margin-left: 0.3em;
  }
`;

const ErrorMsg = styled.div`
  color: #d81e43;
  font-size: 0.98rem;
  margin-bottom: 0.7rem;
  text-align: center;
`;

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login, signup, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await setPersistence(
          auth,
          remember ? browserLocalPersistence : browserSessionPersistence
        );
        await login(email, password);
      } else {
        const userCred = await signup(email, password);
        if (userCred && userCred.user) {
          await updateProfile(userCred.user, { displayName: `${name} ${surname}` });
        }
      }
      navigate('/dashboard');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Title>{mode === 'login' ? 'Login' : 'Sign Up'}</Title>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {mode === 'signup' && (
            <NameRow>
              <NameInput
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
              <NameInput
                type="text"
                placeholder="Surname"
                value={surname}
                onChange={e => setSurname(e.target.value)}
                required
              />
            </NameRow>
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus={mode === 'login'}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {mode === 'login' && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', marginTop: '-0.7rem' }}>
              <input
                type="checkbox"
                id="remember-me"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              <label htmlFor="remember-me" style={{ color: '#334155', fontSize: '0.98rem', cursor: 'pointer' }}>Remember Me</label>
            </div>
          )}
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Button type="submit" disabled={loading}>{loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Sign Up')}</Button>
        </form>
        <Switch>
          {mode === 'login' ? (
            <>Don&apos;t have an account?<span onClick={() => setMode('signup')}>Sign Up</span></>
          ) : (
            <>Already have an account?<span onClick={() => setMode('login')}>Login</span></>
          )}
        </Switch>
      </Modal>
    </Overlay>
  );
} 
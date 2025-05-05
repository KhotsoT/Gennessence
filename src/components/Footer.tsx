import styled from 'styled-components';
import { FaLock, FaUserShield, FaCookieBite, FaSyncAlt, FaEnvelope, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';

const FooterContainer = styled.footer`
  background: #f8fafc;
  color: #1e293b;
  padding: 2.5rem 1rem 1.5rem 1rem;
  text-align: center;
  border-top: 1px solid #e2e8f0;
  font-size: 1.05rem;
`;

const Copyright = styled.div`
  color: #64748b;
  font-size: 0.98rem;
  margin-top: 1.2rem;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 1.1rem;
  font-size: 0.98rem;
  color: #64748b;
`;

const FooterLink = styled.button`
  color: #3074db;
  text-decoration: none;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  &:hover { text-decoration: underline; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px 0 rgba(0,60,255,0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 95vw;
  min-width: 320px;
  color: #1e293b;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.5rem;
  cursor: pointer;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: #2563eb;
  font-weight: 600;
  margin-bottom: 0.7rem;
`;
const Text = styled.p`
  color: #334155;
  font-size: 1.08rem;
  margin-bottom: 1rem;
`;

const ModalTabs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;
const ModalTab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ active }) => (active ? '#3074db' : '#64748b')};
  border-bottom: 2.5px solid ${({ active }) => (active ? '#3074db' : 'transparent')};
  padding: 0.5rem 0.7rem 0.7rem 0.7rem;
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1.5rem 0 1.2rem 0;
`;
const ModalScroll = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 0.5rem;
  @media (max-width: 600px) {
    max-height: 70vh;
  }
`;

export default function Footer() {
  const [modal, setModal] = useState<'privacy' | 'contact' | null>(null);
  const [activeTab, setActiveTab] = useState<'privacy' | 'contact'>('privacy');

  const openModal = (tab: 'privacy' | 'contact') => {
    setModal(tab);
    setActiveTab(tab);
  };

  return (
    <FooterContainer>
      <Copyright>
        &copy;2025 Gennessence Water.<br />All rights reserved.
      </Copyright>
      <FooterLinks>
        <FooterLink onClick={() => openModal('privacy')}>Privacy</FooterLink>
        <FooterLink onClick={() => openModal('contact')}>Contact</FooterLink>
      </FooterLinks>
      {modal && (
        <ModalOverlay onClick={() => setModal(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setModal(null)}>×</CloseButton>
            <ModalTabs>
              <ModalTab active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')}>
                <FaLock style={{ marginRight: 8, verticalAlign: 'middle' }} /> Privacy Policy
              </ModalTab>
              <ModalTab active={activeTab === 'contact'} onClick={() => setActiveTab('contact')}>
                <FaEnvelope style={{ marginRight: 8, verticalAlign: 'middle' }} /> Contact
              </ModalTab>
            </ModalTabs>
            <Divider />
            <ModalScroll>
              {activeTab === 'privacy' && (
                <>
                  <h1 style={{ fontSize: '1.7rem', fontWeight: 700, color: '#3074db', marginBottom: '1.2rem', textAlign: 'center' }}>
                    <FaLock style={{ marginRight: 10, verticalAlign: 'middle' }} /> Privacy Policy
                  </h1>
                  <Text style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    Gennessence Water is committed to protecting your privacy and complying with the Protection of Personal Information Act (POPIA) and all applicable South African privacy laws. This policy explains how we collect, use, and protect your personal information.
                  </Text>
                  <SectionTitle><FaUserShield style={{ marginRight: 8, color: '#3074db' }} /> 1. What Information We Collect</SectionTitle>
                  <Text>We may collect your name, contact details (email, WhatsApp), address, and order information when you use our website, place an order, or contact us.</Text>
                  <Divider />
                  <SectionTitle><FaSyncAlt style={{ marginRight: 8, color: '#3074db' }} /> 2. How We Use Your Information</SectionTitle>
                  <Text>Your information is used to process orders, provide customer support, improve our services, and comply with legal obligations. We do not sell or share your personal information with third parties except as required by law or to fulfill your order (e.g., with payment processors or couriers).</Text>
                  <Divider />
                  <SectionTitle><FaLock style={{ marginRight: 8, color: '#3074db' }} /> 3. Data Security</SectionTitle>
                  <Text>We use industry-standard security measures to protect your data. Access to your information is restricted to authorized personnel only.</Text>
                  <Divider />
                  <SectionTitle><FaUserShield style={{ marginRight: 8, color: '#3074db' }} /> 4. Your Rights</SectionTitle>
                  <Text>
                    You have the right to access, correct, or delete your personal information. To make a request, please contact us at
                    <a
                      href="mailto:hi@gennessence.co.za"
                      style={{ fontFamily: 'Montserrat, Inter, Segoe UI, sans-serif', fontWeight: 600, color: '#3074db', marginLeft: 6, textDecoration: 'none', cursor: 'pointer' }}
                    >
                      hi@gennessence.co.za
                    </a>
                    {' '}or WhatsApp{' '}
                    <a
                      href="https://wa.me/27840885008"
                      style={{ color: '#25d366', fontWeight: 600, fontFamily: 'Montserrat, Inter, Segoe UI, sans-serif', textDecoration: 'none', cursor: 'pointer', marginLeft: 2 }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +27-84-088-5008
                    </a>.
                  </Text>
                  <Divider />
                  <SectionTitle><FaCookieBite style={{ marginRight: 8, color: '#3074db' }} /> 5. Cookies & Analytics</SectionTitle>
                  <Text>We may use cookies and analytics tools to improve your experience. You can disable cookies in your browser settings.</Text>
                  <Divider />
                  <SectionTitle><FaSyncAlt style={{ marginRight: 8, color: '#3074db' }} /> 6. Changes to This Policy</SectionTitle>
                  <Text>We may update this policy from time to time. The latest version will always be available on this page.</Text>
                  <Divider />
                  <SectionTitle><FaEnvelope style={{ marginRight: 8, color: '#3074db' }} /> 7. Contact Us</SectionTitle>
                  <Text>
                    If you have any questions about this policy or your privacy, please contact us at
                    <a
                      href="mailto:hi@gennessence.co.za"
                      style={{ fontFamily: 'Montserrat, Inter, Segoe UI, sans-serif', fontWeight: 600, color: '#3074db', marginLeft: 6, textDecoration: 'none', cursor: 'pointer' }}
                    >
                      hi@gennessence.co.za
                    </a>
                    {' '}or WhatsApp{' '}
                    <a
                      href="https://wa.me/27840885008"
                      style={{ color: '#25d366', fontWeight: 600, fontFamily: 'Montserrat, Inter, Segoe UI, sans-serif', textDecoration: 'none', cursor: 'pointer', marginLeft: 2 }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +27-84-088-5008
                    </a>.
                  </Text>
                  <Text style={{ color: '#64748b', fontSize: '0.98rem', marginTop: '2rem', textAlign: 'center' }}>
                    &copy;2025 Gennessence Water. All rights reserved.
                  </Text>
                </>
              )}
              {activeTab === 'contact' && (
                <>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#3074db', marginBottom: '1.2rem', textAlign: 'center' }}>
                    <FaEnvelope style={{ marginRight: 10, verticalAlign: 'middle' }} /> Contact
                  </h1>
                  <Text style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FaMapMarkerAlt style={{ color: '#3074db' }} />
                    <span style={{ fontWeight: 500, color: '#334155' }}>17467 Phokbye Link, Meadowlands Zone One, Soweto 1852</span>
                  </Text>
                  <Text style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FaWhatsapp style={{ color: '#25d366' }} />
                    <a
                      href="https://wa.me/27840885008"
                      style={{ color: '#25d366', fontWeight: 600, fontFamily: 'Montserrat, Inter, Segoe UI, sans-serif', textDecoration: 'none', cursor: 'pointer' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +27-84-088-5008
                    </a>
                  </Text>
                  <Text style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FaEnvelope style={{ color: '#3074db' }} />
                    <a
                      href="mailto:hi@gennessence.co.za"
                      style={{ color: '#3074db', fontWeight: 500, textDecoration: 'none', cursor: 'pointer' }}
                    >
                      hi@gennessence.co.za
                    </a>
                  </Text>
                </>
              )}
            </ModalScroll>
          </ModalContent>
        </ModalOverlay>
      )}
    </FooterContainer>
  );
} 
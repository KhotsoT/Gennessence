import styled from 'styled-components';

const Container = styled.div`
  max-width: 700px;
  margin: 3rem auto 2rem auto;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px 0 rgba(0,60,255,0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  color: #1e293b;
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #3074db;
  margin-bottom: 1.5rem;
`;
const Section = styled.section`
  margin-bottom: 1.5rem;
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

export default function Privacy() {
  return (
    <Container>
      <Title>Privacy Policy</Title>
      <Section>
        <Text>
          Gennessence Water is committed to protecting your privacy and complying with the Protection of Personal Information Act (POPIA) and all applicable South African privacy laws. This policy explains how we collect, use, and protect your personal information.
        </Text>
      </Section>
      <Section>
        <SectionTitle>1. What Information We Collect</SectionTitle>
        <Text>We may collect your name, contact details (email, WhatsApp), address, and order information when you use our website, place an order, or contact us.</Text>
      </Section>
      <Section>
        <SectionTitle>2. How We Use Your Information</SectionTitle>
        <Text>Your information is used to process orders, provide customer support, improve our services, and comply with legal obligations. We do not sell or share your personal information with third parties except as required by law or to fulfill your order (e.g., with payment processors or couriers).</Text>
      </Section>
      <Section>
        <SectionTitle>3. Data Security</SectionTitle>
        <Text>We use industry-standard security measures to protect your data. Access to your information is restricted to authorized personnel only.</Text>
      </Section>
      <Section>
        <SectionTitle>4. Your Rights</SectionTitle>
        <Text>You have the right to access, correct, or delete your personal information. To make a request, please contact us at <a href="mailto:hi@gennessence.co.za" style={{ color: '#3074db', textDecoration: 'underline' }}>hi@gennessence.co.za</a> or WhatsApp <a href="https://wa.me/27840885008" style={{ color: '#25d366', textDecoration: 'underline' }}>+27 84 088 5008</a>.</Text>
      </Section>
      <Section>
        <SectionTitle>5. Cookies & Analytics</SectionTitle>
        <Text>We may use cookies and analytics tools to improve your experience. You can disable cookies in your browser settings.</Text>
      </Section>
      <Section>
        <SectionTitle>6. Changes to This Policy</SectionTitle>
        <Text>We may update this policy from time to time. The latest version will always be available on this page.</Text>
      </Section>
      <Section>
        <SectionTitle>7. Contact Us</SectionTitle>
        <Text>If you have any questions about this policy or your privacy, please contact us at <a href="mailto:hi@gennessence.co.za" style={{ color: '#3074db', textDecoration: 'underline' }}>hi@gennessence.co.za</a> or WhatsApp <a href="https://wa.me/27840885008" style={{ color: '#25d366', textDecoration: 'underline' }}>+27 84 088 5008</a>.</Text>
      </Section>
      <Text style={{ color: '#64748b', fontSize: '0.98rem', marginTop: '2rem' }}>
        &copy;2025 Gennessence Water. All rights reserved.
      </Text>
    </Container>
  );
} 
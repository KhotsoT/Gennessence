import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import AuthModal from '../components/AuthModal';

const benefits = [
  {
    title: 'Pure Water',
    ph: '7.0',
    color: '#3074db',
    description: 'Perfect during or after meals. Safe for all ages, every day. Ideal for teas, cooking, and bedtime. Maintains hydration without altering digestion.',
  },
  {
    title: 'Gentle Boost',
    ph: '8.5',
    color: '#2581c4',
    description: 'Great between meals to neutralize acidity. Supports light detox and energy levels. Gentle enough for beginners to alkaline water.',
  },
  {
    title: 'Optimal Balance',
    ph: '9.0',
    color: '#1b8ec2',
    description: 'Helps prepare the body before meals. Supports internal pH balance. Avoid within 30 mins of eating to protect digestion.',
  },
  {
    title: 'Detox Water',
    ph: '9.5',
    color: '#1b8ec2',
    description: 'Ideal on an empty stomach for detox. Best used in the morning or evening. Not recommended during or directly after meals.',
  },
  {
    title: 'Beauty Water',
    ph: '6.0',
    color: '#e85a97',
    description: 'Restores natural skin pH after cleansing. Tightens pores, tones and refreshes. Excellent as a facial mist or rinse.',
  },
];

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6fbff 0%, #eaf3fa 100%);
  padding: 3rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(0,60,255,0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1<{ color: string }>`
  font-size: 2.2rem;
  font-weight: 800;
  color: ${({ color }) => color};
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Ph = styled.span<{ color: string }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ color }) => color};
  background: ${({ color }) => color}22;
  border-radius: 0.5rem;
  padding: 0.2rem 0.7rem;
  margin-left: 0.5rem;
`;

const Desc = styled.p`
  color: #334155;
  font-size: 1.08rem;
  margin: 1.5rem 0 2.5rem 0;
  text-align: center;
`;

const PurchaseBtn = styled.button<{ color: string }>`
  background: ${({ color }) => color};
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem 2.5rem;
  border-radius: 999px;
  border: none;
  box-shadow: 0 4px 16px 0 ${({ color }) => color}22;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: #2056a8;
    transform: scale(1.04);
  }
`;

const NotFound = styled.div`
  color: #d81e43;
  font-size: 1.3rem;
  margin-top: 3rem;
  text-align: center;
`;

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const product = benefits.find(b => b.title.toLowerCase().replace(/\s+/g, '-') === slug);

  if (!product) {
    return (
      <Page>
        <NotFound>Product not found.<br />
          <button style={{marginTop: '1.5rem', padding: '0.7em 2em', borderRadius: '999px', border: 'none', background: '#3074db', color: '#fff', fontWeight: 600, cursor: 'pointer'}} onClick={() => navigate(-1)}>Go Back</button>
        </NotFound>
      </Page>
    );
  }

  const handlePurchase = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    // Proceed with purchase logic here
    alert('Proceeding to purchase!');
  };

  return (
    <Page>
      <Container>
        <Title color={product.color}>{product.title} <Ph color={product.color}>pH {product.ph}</Ph></Title>
        <Desc>{product.description}</Desc>
        <PurchaseBtn color={product.color} onClick={handlePurchase}>Purchase</PurchaseBtn>
      </Container>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </Page>
  );
} 
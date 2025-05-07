import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import AuthModal from '../components/AuthModal';
import logo from '../assets/gennessence-logo.png'; // Placeholder logo path
import pureWaterImg from '../assets/pure-water.jpg';
import gentleBoostImg from '../assets/gentle-boost.jpg';
import optimalBalanceImg from '../assets/optimal-balance.jpg';
import detoxWaterImg from '../assets/detox-water.jpg';
import comboImg from '../assets/combo.jpg';
import { useCartStore } from '../store/cartStore';

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6fbff 0%, #eaf3fa 100%);
  padding: 3rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailCard = styled.div`
  display: flex;
  flex-direction: row;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(14px) saturate(1.2);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(48,116,219,0.10), 0 1.5px 8px 0 rgba(48,116,219,0.07);
  overflow: hidden;
  margin-bottom: 2.5rem;
  min-height: 320px;
  align-items: stretch;
  max-width: 900px;
  width: 100%;
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: unset;
    max-width: 98vw;
  }
`;
const DetailImageWrap = styled.div`
  flex: 0 0 320px;
  background: rgba(240,247,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 2rem 2.5rem 2.5rem;
  @media (max-width: 900px) {
    flex: none;
    padding: 1.5rem 1.5rem 0.5rem 1.5rem;
    justify-content: center;
  }
`;
const DetailImage = styled.img`
  width: 320px;
  height: 320px;
  object-fit: contain;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px 0 rgba(48,116,219,0.10);
  background: #f6fbff;
`;
const DetailInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem 2.5rem 2.5rem 1.5rem;
  position: relative;
  @media (max-width: 900px) {
    padding: 1.2rem 1.2rem 1.5rem 1.2rem;
  }
`;
const DetailTagline = styled.div`
  font-size: 1.18rem;
  font-weight: 600;
  color: #2056a8;
  margin-bottom: 0.7rem;
  font-style: italic;
`;
const DetailBenefits = styled.ul`
  margin: 0 0 1.1rem 0;
  padding: 0 0 0 1.2em;
  color: #1e293b;
  font-size: 1.08rem;
  font-weight: 400;
  line-height: 1.7;
  list-style: disc;
`;
const DetailBestTime = styled.div`
  color: #2563eb;
  font-size: 1.04rem;
  font-style: italic;
  margin-bottom: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;
const DetailMain = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1.2rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;
const DetailSize = styled.div`
  font-size: 2.1rem;
  font-weight: 700;
  color: #1e293b;
`;
const DetailPh = styled.div<{ color: string }>`
  font-size: 2.1rem;
  font-weight: 700;
  color: ${({ color }) => color};
`;
const DetailName = styled.div`
  font-size: 2.1rem;
  font-weight: 500;
  color: #1e293b;
`;
const DetailPrice = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2056a8;
  margin: 0.7rem 0 0.2rem 0;
`;
const DetailBadge = styled.div<{ badge: string }>`
  display: inline-block;
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ badge }) => badge === 'NEUTRAL' ? '#3074db' : '#1b8ec2'};
  border: 2.5px solid ${({ badge }) => badge === 'NEUTRAL' ? '#3074db' : '#1b8ec2'};
  border-radius: 1.2em;
  padding: 0.18em 1.1em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  background: rgba(255,255,255,0.7);
  box-shadow: 0 2px 8px 0 ${({ badge }) => badge === 'NEUTRAL' ? '#3074db22' : '#1b8ec222'};
  letter-spacing: 0.08em;
`;
const DetailBrandLogo = styled.img`
  position: absolute;
  right: 1.2rem;
  bottom: 1.2rem;
  width: 70px;
  opacity: 0.18;
  pointer-events: none;
  @media (max-width: 900px) {
    position: static;
    display: block;
    margin: 1.2rem auto 0 auto;
  }
`;
const OrangeWavyLine = () => (
  <svg width="120" height="8" viewBox="0 0 120 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{margin: '12px 0'}}>
    <path d="M2 6C18 2 32 6 48 4C64 2 80 6 96 4C108 2 118 6 118 6" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" fill="none"/>
  </svg>
);
const BuyButton = styled.button<{ color: string }>`
  background: ${({ color }) => color};
  color: white;
  border: none;
  border-radius: 0.8rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 2rem;
  width: 100%;
  max-width: 300px;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ color }) => color}33;
  }
  &:active {
    transform: translateY(0);
  }
`;

const NotFound = styled.div`
  color: #d81e43;
  font-size: 1.3rem;
  margin-top: 3rem;
  text-align: center;
`;

const PackInfo = styled.div`
  font-size: 1.08rem;
  font-weight: 600;
  color: #2056a8;
  margin-bottom: 1.1rem;
`;

const ComboSection = styled.div`
  margin-top: 2.5rem;
  background: rgba(255,255,255,0.85);
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px 0 #3074db11;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ComboTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1b8ec2;
  margin-bottom: 0.7rem;
`;
const ComboBestSeller = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  background: #f2994a;
  border-radius: 999px;
  padding: 0.18em 1.1em;
  margin-bottom: 0.7em;
  letter-spacing: 0.08em;
  box-shadow: 0 2px 8px 0 #f2994a22;
`;
const ComboDesc = styled.div`
  font-size: 1.08rem;
  color: #334155;
  margin-bottom: 1.1rem;
  text-align: center;
`;
const ComboButton = styled.button`
  background: #3074db;
  color: #fff;
  font-size: 1.08rem;
  font-weight: 600;
  border: none;
  border-radius: 0.7rem;
  padding: 0.7rem 2.2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 #3074db22;
  transition: background 0.18s, transform 0.18s;
  &:hover {
    background: #2056a8;
    transform: translateY(-2px);
  }
`;

const SelectorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
  width: 100%;
  @media (max-width: 600px) {
    gap: 0.7rem;
    flex-direction: column;
    align-items: flex-start;
  }
`;
const SizeRadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  @media (max-width: 600px) {
    gap: 0.5rem;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`;

// Recommended product image size: 220px x 160px (300ppi)
// Place product images in: src/assets/
// Example: src/assets/pure-water-500ml.jpg

// Add Size type
interface Size {
  label: string;
  value: string;
  price: number;
  unit: string;
}

export default function ProductDetail() {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<'5L' | '500ml'>('5L');
  const addToCart = useCartStore((s) => s.addToCart);

  // Get water data from location state or find it in benefits array
  const waterData = location.state?.water || (Array.isArray(location.state) ? location.state[0]?.water : null) || null;
  // Fallback for direct URL access
  const fallbackBenefits = [
    {
      name: 'Pure Water',
      title: 'Pure Water',
      ph: '7.0',
      color: '#3074db',
      image: pureWaterImg,
      price: 50,
      badge: 'NEUTRAL',
      tagline: 'Clean Hydration for Anytime Use',
      sizes: [
        { label: '5L', value: '5L', price: 50, unit: 'unit' },
        { label: '6 x 500ml', value: '500ml', price: 60, unit: 'pack' },
      ] as Size[],
      points: [
        'Perfect during or after meals',
        'Safe for all ages, every day',
        'Ideal for teas, cooking, and bedtime',
        'Maintains hydration without altering digestion',
        'Best times: with meals, between meals, before bed',
      ],
    },
    {
      name: 'Gentle Boost',
      title: 'Gentle Boost',
      ph: '8.5',
      color: '#2581c4',
      image: gentleBoostImg,
      price: 52,
      badge: 'ALKALINE',
      tagline: 'Mild Alkalinity for Daily Balance',
      sizes: [
        { label: '5L', value: '5L', price: 52, unit: 'unit' },
        { label: '6 x 500ml', value: '500ml', price: 62, unit: 'pack' },
      ] as Size[],
      points: [
        'Great between meals to neutralize acidity',
        'Supports light detox and energy levels',
        'Gentle enough for beginners to alkaline water',
        'Best times: mid-morning, mid-afternoon, 1–2 hrs after meals',
        'Promotes daily balance and wellness',
      ],
    },
    {
      name: 'Optimal Balance',
      title: 'Optimal Balance',
      ph: '9.0',
      color: '#1b8ec2',
      image: optimalBalanceImg,
      price: 54,
      badge: 'ALKALINE',
      tagline: 'Balanced Alkalinity for Daily Reset',
      sizes: [
        { label: '5L', value: '5L', price: 54, unit: 'unit' },
        { label: '6 x 500ml', value: '500ml', price: 64, unit: 'pack' },
      ] as Size[],
      points: [
        'Helps prepare the body before meals',
        'Supports internal pH balance',
        'Avoid within 30 mins of eating to protect digestion',
        'Best times: 30 mins before meals, early morning, late afternoon',
        'Promotes overall hydration',
      ],
    },
    {
      name: 'Detox Water',
      title: 'Detox Water',
      ph: '9.5',
      color: '#1b8ec2',
      image: detoxWaterImg,
      price: 54,
      badge: 'ALKALINE',
      tagline: 'Deep Alkalinity for Cleansing & Recovery',
      sizes: [
        { label: '5L', value: '5L', price: 54, unit: 'unit' },
        { label: '6 x 500ml', value: '500ml', price: 64, unit: 'pack' },
      ] as Size[],
      points: [
        'Ideal on an empty stomach for detox',
        'Best used in the morning or evening',
        'Not recommended during or directly after meals',
        'Best times: first thing in the morning, 1–2 hrs after meals, before bed',
        'Supports cleansing and recovery',
      ],
    },
  ];
  const fallback = fallbackBenefits.find(b => b.name.toLowerCase().replace(/\s+/g, '-') === name);
  const product = (waterData || fallback) as typeof fallback & { sizes?: Size[] };

  if (!product) {
    return (
      <Page>
        <NotFound>Product not found.<br />
          <BuyButton color="#3074db" onClick={() => navigate(-1)}>Go Back</BuyButton>
        </NotFound>
      </Page>
    );
  }

  const bestIdx = product.points.findIndex((pt: string) => pt.toLowerCase().startsWith('best times:'));
  const points = bestIdx !== -1 ? product.points.slice(0, bestIdx).concat(product.points.slice(bestIdx + 1)) : product.points;
  const bestTime = bestIdx !== -1 ? product.points[bestIdx] : null;

  const handleBuy = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    // Add to cart
    addToCart({
      id: `${product.name}-${selectedSize}`,
      name: product.name,
      size: selectedSize,
      price: selectedSize === '5L' ? product.price : (product.sizes?.find(s => s.value === '500ml')?.price ?? product.price),
      image: product.image,
      color: product.color,
    }, qty);
    navigate('/cart');
  };

  return (
    <Page>
      <DetailCard>
        <DetailImageWrap>
          <DetailImage src={product.image} alt={product.name} />
        </DetailImageWrap>
        <DetailInfo>
          <div>
            <DetailTagline>“{product.tagline}”</DetailTagline>
            <DetailBenefits>
              {points.map((pt: string, i: number) => <li key={i}>{pt}</li>)}
            </DetailBenefits>
            {bestTime && (
              <DetailBestTime>
                <span style={{ fontStyle: 'normal' }} role="img" aria-label="clock">🕒</span>
                <span dangerouslySetInnerHTML={{__html: bestTime.replace(/^Best times:/i, '<b>Best times:</b>')}} />
              </DetailBestTime>
            )}
            {/* Quantity Selector */}
            <SelectorRow>
              <span style={{ fontWeight: 600, color: '#334155', fontSize: '1.1rem' }}>Qty:</span>
              <button
                onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                style={{
                  width: '2.2rem', height: '2.2rem', borderRadius: '50%', border: 'none', background: '#e0e7ef', color: '#2056a8', fontSize: '1.5rem', fontWeight: 700, cursor: 'pointer',
                }}
                aria-label="Decrease quantity"
              >-</button>
              <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: 700, fontSize: '1.2rem' }}>{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                style={{
                  width: '2.2rem', height: '2.2rem', borderRadius: '50%', border: 'none', background: product.color, color: '#fff', fontSize: '1.5rem', fontWeight: 700, cursor: 'pointer',
                }}
                aria-label="Increase quantity"
              >+</button>
              <SizeRadioGroup>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 600, color: selectedSize === '5L' ? product.color : '#334155', fontSize: '1.08rem' }}>
                  <input
                    type="radio"
                    name="size"
                    value="5L"
                    checked={selectedSize === '5L'}
                    onChange={() => setSelectedSize('5L')}
                    style={{ marginRight: '0.4em', accentColor: product.color }}
                  />
                  5L
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 600, color: selectedSize === '500ml' ? product.color : '#334155', fontSize: '1.08rem' }}>
                  <input
                    type="radio"
                    name="size"
                    value="500ml"
                    checked={selectedSize === '500ml'}
                    onChange={() => setSelectedSize('500ml')}
                    style={{ marginRight: '0.4em', accentColor: product.color }}
                  />
                  500ml (pack of 6)
                </label>
              </SizeRadioGroup>
            </SelectorRow>
            {selectedSize === '5L' && (
              <div>
                <DetailMain>
                  <DetailSize>{selectedSize}</DetailSize>
                  <DetailPh color={product.color}>PH {product.ph}</DetailPh>
                  <DetailName>{product.name}</DetailName>
                </DetailMain>
                <OrangeWavyLine />
                <DetailPrice>R{product.price.toFixed(2)}</DetailPrice>
                <DetailBadge badge={product.badge}>{product.badge}</DetailBadge>
                <PackInfo>Single 5L bottle</PackInfo>
              </div>
            )}
            {selectedSize === '500ml' && (
              <div style={{marginTop:'1.2rem',textAlign:'center'}}>
                <DetailMain>
                  <DetailSize>{selectedSize}</DetailSize>
                  <DetailPh color={product.color}>PH {product.ph}</DetailPh>
                  <DetailName>{product.name}</DetailName>
                </DetailMain>
                <OrangeWavyLine />
                <DetailPrice>--</DetailPrice>
                <DetailBadge badge={product.badge}>{product.badge}</DetailBadge>
                <PackInfo>Pack of 6 x 500ml bottles</PackInfo>
              </div>
            )}
          </div>
          <DetailBrandLogo src={logo} alt="Gennessence Health Water" />
          <BuyButton color={product.color} onClick={handleBuy}>
            Add to Cart
          </BuyButton>
        </DetailInfo>
      </DetailCard>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <ComboSection>
        <ComboBestSeller>Best Seller</ComboBestSeller>
        <ComboTitle>Daily Balance Pack</ComboTitle>
        <ComboDesc>
          4 x 500ml bottles<br />
          <span style={{ display: 'inline-flex', gap: '0.3em', verticalAlign: 'middle', margin: '0.3em 0' }}>
            <span style={{ background: '#3074db', color: '#fff', borderRadius: '999px', padding: '0.12em 0.9em', fontWeight: 700, fontSize: '1em' }}>pH 7.0</span>
            <span style={{ background: '#2581c4', color: '#fff', borderRadius: '999px', padding: '0.12em 0.9em', fontWeight: 700, fontSize: '1em' }}>pH 8.5</span>
            <span style={{ background: '#1b8ec2', color: '#fff', borderRadius: '999px', padding: '0.12em 0.9em', fontWeight: 700, fontSize: '1em' }}>pH 9.0</span>
            <span style={{ background: '#1b8ec2', color: '#fff', borderRadius: '999px', padding: '0.12em 0.9em', fontWeight: 700, fontSize: '1em' }}>pH 9.5</span>
          </span>
          <br />
          Your 2L daily supply for optimal hydration and balance.
        </ComboDesc>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.1rem' }}>
          <img src={comboImg} alt="Daily Balance Pack Combo" style={{ width: '180px', height: 'auto', borderRadius: '1.2rem', boxShadow: '0 2px 8px 0 #3074db11', background: '#f6fbff' }} />
        </div>
        <ComboButton>Shop Daily Balance Pack</ComboButton>
      </ComboSection>
    </Page>
  );
} 
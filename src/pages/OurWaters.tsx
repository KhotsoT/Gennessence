import styled from 'styled-components';
import { FaTint, FaSpa, FaWater } from 'react-icons/fa';
import '@fontsource/montserrat/600.css';
import { useNavigate } from 'react-router-dom';
import pureWaterImg from '../assets/pure-water.jpg';
import gentleBoostImg from '../assets/gentle-boost.jpg';
import optimalBalanceImg from '../assets/optimal-balance.jpg';
import detoxWaterImg from '../assets/detox-water.jpg';

const healthGradient = 'linear-gradient(90deg, #3074db 0%, #2581c4 50%, #1b8ec2 100%)';
const beautyGradient = 'linear-gradient(90deg, #e85a97 0%, #e0aaff 100%)';
const utilityGradient = 'linear-gradient(90deg, #d81e43 0%, #e89b37 100%)';

const Page = styled.div`
  max-width: 1200px;
  margin: 3rem auto 2rem auto;
  padding: 2rem 1rem;
  font-family: 'Montserrat', 'Inter', 'Segoe UI', Arial, sans-serif;
`;
const Section = styled.section`
  margin-bottom: 3.5rem;
`;
const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.7rem;
`;
const SectionIcon = styled.div<{ $gradient: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  svg {
    font-size: 2.7rem;
    background: ${({ $gradient }) => $gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    filter: drop-shadow(0 2px 12px rgba(48,116,219,0.10));
  }
`;
const SectionTitle = styled.h2<{ $gradient: string }>`
  font-size: 2.1rem;
  font-weight: 800;
  background: ${({ $gradient }) => $gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin: 0;
  letter-spacing: 0.01em;
  text-align: center;
`;
const SectionDesc = styled.p`
  color: #334155;
  font-size: 1.18rem;
  margin-bottom: 2.2rem;
  text-align: center;
`;
const CardGridContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const CardGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns ? `repeat(${$columns}, 1fr)` : 'repeat(auto-fit, minmax(270px, 1fr))'};
  gap: 2.2rem;
  place-items: center;
  max-width: 740px;
  width: 100%;
  @media (max-width: 600px) {
    grid-template-columns: 1fr !important;
    max-width: 98vw;
  }
`;
const Card = styled.div<{ color: string }>`
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(12px) saturate(1.2);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(48,116,219,0.10), 0 1.5px 8px 0 rgba(48,116,219,0.07);
  padding: 1.3rem 1rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  min-height: 180px;
  max-width: 290px;
  width: 100%;
  position: relative;
  transition: box-shadow 0.18s, transform 0.18s;
  will-change: box-shadow, transform;
  cursor: pointer;
  &:hover, &:focus {
    box-shadow: 0 12px 40px 0 ${({ color }) => color}33, 0 2px 12px 0 ${({ color }) => color}22;
    transform: translateY(-2px) scale(1.025);
  }
`;
const CardTitle = styled.h3<{ color: string }>`
  font-size: 1.22rem;
  font-weight: 700;
  color: ${({ color }) => color};
  margin-bottom: 0.4rem;
  position: relative;
  padding-bottom: 0.5rem;
  text-align: center;
  width: 100%;
  letter-spacing: 0.01em;
  &::after {
    content: '';
    display: block;
    margin: 0.3rem auto 0 auto;
    width: 32px;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(90deg, ${({ color }) => color} 0%, ${({ color }) => color}55 100%);
  }
`;
const Ph = styled.span<{ color: string }>`
  font-size: 0.93rem;
  font-weight: 600;
  color: ${({ color }) => color};
  background: ${({ color }) => color}18;
  border-radius: 999px;
  padding: 0.13rem 0.9rem;
  margin-left: 0.5rem;
  margin-top: 0.1rem;
  display: inline-block;
`;
const Points = styled.div`
  margin: 0.9rem 0 0 0;
  color: #1e293b;
  font-size: 1.01rem;
  font-weight: 400;
  line-height: 1.7;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
`;
const Point = styled.div`
  padding-left: 0;
`;
const CardIcon = styled.div<{ color: string }>`
  position: absolute;
  bottom: 1.1rem;
  right: 1.2rem;
  font-size: 1.7rem;
  color: ${({ color }) => color}CC;
  opacity: 0.22;
  font-style: normal;
  @media (max-width: 600px) {
    font-size: 2.1rem;
    right: 1.1rem;
    bottom: 0.7rem;
  }
`;

// Map products to categories
const healthWaters = [
  {
    name: 'Pure Water',
    ph: '7.0',
    color: '#3074db',
    image: pureWaterImg,
    price: 50,
    badge: 'NEUTRAL',
    points: [
      'Perfect during or after meals',
      'Safe for all ages, every day',
      'Ideal for teas, cooking, and bedtime',
      'Maintains hydration without altering digestion',
      'Best times: with meals, between meals, before bed',
    ],
    tagline: 'Clean Hydration for Anytime Use',
  },
  {
    name: 'Gentle Boost',
    ph: '8.5',
    color: '#2581c4',
    image: gentleBoostImg,
    price: 52,
    badge: 'ALKALINE',
    points: [
      'Great between meals to neutralize acidity',
      'Supports light detox and energy levels',
      'Gentle enough for beginners to alkaline water',
      'Best times: mid-morning, mid-afternoon, 1–2 hrs after meals',
      'Promotes daily balance and wellness',
    ],
    tagline: 'Mild Alkalinity for Daily Balance',
  },
  {
    name: 'Optimal Balance',
    ph: '9.0',
    color: '#1b8ec2',
    image: optimalBalanceImg,
    price: 54,
    badge: 'ALKALINE',
    points: [
      'Helps prepare the body before meals',
      'Supports internal pH balance',
      'Avoid within 30 mins of eating to protect digestion',
      'Best times: 30 mins before meals, early morning, late afternoon',
      'Promotes overall hydration',
    ],
    tagline: 'Balanced Alkalinity for Daily Reset',
  },
  {
    name: 'Detox Water',
    ph: '9.5',
    color: '#1b8ec2',
    image: detoxWaterImg,
    price: 54,
    badge: 'ALKALINE',
    points: [
      'Ideal on an empty stomach for detox',
      'Best used in the morning or evening',
      'Not recommended during or directly after meals',
      'Best times: first thing in the morning, 1–2 hrs after meals, before bed',
      'Supports cleansing and recovery',
    ],
    tagline: 'Deep Alkalinity for Cleansing & Recovery',
  },
];
const beautyWaters = [
  {
    name: 'Beauty Water',
    ph: '6.0',
    color: '#e85a97',
    points: [
      'Restores natural skin pH after cleansing',
      'Tightens pores, tones and refreshes',
      'Excellent as a facial mist or rinse',
      'Adds shine and softness to hair when used after washing',
      'Gentle, non-drying, and ideal for daily skin routines',
    ],
  },
];
const utilityWaters = [
  {
    name: 'Shield',
    ph: '2.5',
    color: '#d81e43',
    points: [
      'Powerful natural disinfectant',
      'Ideal for cleaning and sanitizing surfaces',
      'Can be used for hand and skin hygiene',
      'Odor removal and stain treatment',
      'Not for drinking—external use only',
    ],
  },
  {
    name: 'PureKlean',
    ph: '11.5',
    color: '#e89b37',
    points: [
      'Strong degreasing and cleaning power',
      'Removes pesticides from fruits and vegetables',
      'Great for washing dishes and kitchen tools',
      'Can be used for stain removal in laundry',
      'Not for drinking—external use only',
    ],
  },
];

function getCardIcon(category: 'health' | 'beauty' | 'utility', color: string) {
  if (category === 'health') return <FaTint color={color} style={{fontSize:'2.1rem',opacity:0.18}} />;
  if (category === 'beauty') return <FaSpa color={color} style={{fontSize:'2.1rem',opacity:0.18}} />;
  return <FaWater color={color} style={{fontSize:'2.1rem',opacity:0.18}} />;
}

export default function OurWaters() {
  const navigate = useNavigate();

  const handleCardClick = (water: any) => {
    navigate(`/product/${water.name.toLowerCase().replace(/\s+/g, '-')}`, {
      state: { water }
    });
  };

  return (
    <Page>
      <Section>
        <SectionHeader>
          <SectionIcon $gradient={healthGradient}>{getCardIcon('health', '#3074db')}</SectionIcon>
          <SectionTitle $gradient={healthGradient}>Health Water</SectionTitle>
        </SectionHeader>
        <SectionDesc>Premium drinking water for daily hydration and wellness.</SectionDesc>
        <CardGridContainer>
          <CardGrid $columns={2}>
            {healthWaters.map(w => {
              const bestIdx = w.points.findIndex(pt => pt.toLowerCase().startsWith('best times:'));
              const points = bestIdx !== -1 ? w.points.slice(0, bestIdx).concat(w.points.slice(bestIdx + 1)) : w.points;
              const bestTime = bestIdx !== -1 ? w.points[bestIdx] : null;
              return (
                <Card 
                  key={w.ph} 
                  color={w.color}
                  onClick={() => handleCardClick(w)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCardClick(w);
                    }
                  }}
                >
                  <CardTitle color={w.color}>{w.name} <Ph color={w.color}>pH {w.ph}</Ph></CardTitle>
                  <Points>
                    {points.map((pt, i) => pt ? <Point key={i}>{pt}</Point> : null)}
                    {bestTime && (
                      <Point style={{marginTop:'1.1em',display:'flex',alignItems:'center',fontStyle:'normal',color:w.color,fontWeight:500}}>
                        <span style={{fontSize:'1.1em',marginRight:'0.5em'}} role="img" aria-label="clock">🕒</span>
                        <span style={{fontStyle:'italic'}}>{bestTime.replace(/^Best times:/i, 'Best times:')}</span>
                      </Point>
                    )}
                  </Points>
                  <CardIcon color={w.color}>{getCardIcon('health', w.color)}</CardIcon>
                </Card>
              );
            })}
          </CardGrid>
        </CardGridContainer>
      </Section>
      <Section>
        <SectionHeader>
          <SectionIcon $gradient={beautyGradient}>{getCardIcon('beauty', '#e85a97')}</SectionIcon>
          <SectionTitle $gradient={beautyGradient}>Beauty Water</SectionTitle>
        </SectionHeader>
        <SectionDesc>For cosmetic use only—luxury for your skin and hair.</SectionDesc>
        <CardGridContainer>
          <CardGrid>
            {beautyWaters.map(w => {
              const bestIdx = w.points.findIndex(pt => pt.toLowerCase().startsWith('best times:'));
              const points = bestIdx !== -1 ? w.points.slice(0, bestIdx).concat(w.points.slice(bestIdx + 1)) : w.points;
              const bestTime = bestIdx !== -1 ? w.points[bestIdx] : null;
              return (
                <Card key={w.ph} color={w.color}>
                  <CardTitle color={w.color}>{w.name} <Ph color={w.color}>pH {w.ph}</Ph></CardTitle>
                  <Points>
                    {points.map((pt, i) => pt ? <Point key={i}>{pt}</Point> : null)}
                    {bestTime && (
                      <Point style={{marginTop:'1.1em',display:'flex',alignItems:'center',fontStyle:'normal',color:w.color,fontWeight:500}}>
                        <span style={{fontSize:'1.1em',marginRight:'0.5em'}} role="img" aria-label="clock">🕒</span>
                        <span style={{fontStyle:'italic'}}>{bestTime.replace(/^Best times:/i, 'Best times:')}</span>
                      </Point>
                    )}
                  </Points>
                  <CardIcon color={w.color}>{getCardIcon('beauty', w.color)}</CardIcon>
                </Card>
              );
            })}
          </CardGrid>
        </CardGridContainer>
      </Section>
      <Section>
        <SectionHeader>
          <SectionIcon $gradient={utilityGradient}>{getCardIcon('utility', '#d81e43')}</SectionIcon>
          <SectionTitle $gradient={utilityGradient}>Utility Water</SectionTitle>
        </SectionHeader>
        <SectionDesc>Specialty waters for cleaning, plants, and more.</SectionDesc>
        <CardGridContainer>
          <CardGrid>
            {utilityWaters.map(w => {
              const bestIdx = w.points.findIndex(pt => pt.toLowerCase().startsWith('best times:'));
              const points = bestIdx !== -1 ? w.points.slice(0, bestIdx).concat(w.points.slice(bestIdx + 1)) : w.points;
              const bestTime = bestIdx !== -1 ? w.points[bestIdx] : null;
              return (
                <Card key={w.ph} color={w.color}>
                  <CardTitle color={w.color}>{w.name} <Ph color={w.color}>pH {w.ph}</Ph></CardTitle>
                  <Points>
                    {points.map((pt, i) => pt ? <Point key={i}>{pt}</Point> : null)}
                    {bestTime && (
                      <Point style={{marginTop:'1.1em',display:'flex',alignItems:'center',fontStyle:'normal',color:w.color,fontWeight:500}}>
                        <span style={{fontSize:'1.1em',marginRight:'0.5em'}} role="img" aria-label="clock">🕒</span>
                        <span style={{fontStyle:'italic'}}>{bestTime.replace(/^Best times:/i, 'Best times:')}</span>
                      </Point>
                    )}
                  </Points>
                  <CardIcon color={w.color}>{getCardIcon('utility', w.color)}</CardIcon>
                </Card>
              );
            })}
          </CardGrid>
        </CardGridContainer>
      </Section>
    </Page>
  );
} 
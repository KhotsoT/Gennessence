import styled from 'styled-components';
import { Link } from 'react-router-dom';

const benefits = [
  {
    title: 'Pure Water',
    ph: '7.0',
    color: '#3074db',
    points: [
      'Perfect during or after meals',
      'Safe for all ages, every day',
      'Ideal for teas, cooking, and bedtime',
      'Maintains hydration without altering digestion',
      'Best times: with meals, between meals, before bed',
    ],
  },
  {
    title: 'Gentle Boost',
    ph: '8.5',
    color: '#2581c4',
    points: [
      'Great between meals to neutralize acidity',
      'Supports light detox and energy levels',
      'Gentle enough for beginners to alkaline water',
      'Best times: mid-morning, mid-afternoon, 1–2 hrs after meals',
      'Promotes daily balance and wellness',
    ],
  },
  {
    title: 'Optimal Balance',
    ph: '9.0',
    color: '#1b8ec2',
    points: [
      'Helps prepare the body before meals',
      'Supports internal pH balance',
      'Avoid within 30 mins of eating to protect digestion',
      'Best times: 30 mins before meals, early morning, late afternoon',
      'Promotes overall hydration',
    ],
  },
  {
    title: 'Detox Water',
    ph: '9.5',
    color: '#1b8ec2',
    points: [
      'Ideal on an empty stomach for detox',
      'Best used in the morning or evening',
      'Not recommended during or directly after meals',
      'Best times: first thing in the morning, 1–2 hrs after meals, before bed',
      'Supports cleansing and recovery',
    ],
  },
  {
    title: 'Beauty Water',
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
  {
    title: 'Shield',
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
    title: 'PureKlean',
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

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6fbff 0%, #eaf3fa 100%);
  padding: 3rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #3074db;
  margin-bottom: 2.5rem;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  width: 100%;
  max-width: 1200px;
`;

const Card = styled.div<{ color: string }>`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(0,60,255,0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-top: 6px solid ${({ color }) => color};
`;

const CardTitle = styled.h2<{ color: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ color }) => color};
  margin-bottom: 0.5rem;
  position: relative;
  padding-bottom: 0.7rem;
  &::after {
    content: '';
    display: block;
    margin: 0.5rem auto 0 auto;
    width: 48px;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(90deg, ${({ color }) => color} 0%, ${({ color }) => color}55 100%);
  }
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

const List = styled.div`
  margin: 1.6rem 0 0 0;
  padding: 0;
  color: #1e293b;
  font-size: 1.08rem;
  font-weight: 400;
  line-height: 1.7;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const ListItem = styled.div`
  padding-left: 0;
`;

const CardLink = styled(Link)<{ color: string }>`
  text-decoration: none;
  display: block;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(0,60,255,0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  border-top: 6px solid ${({ color }) => color};
  margin: 0;
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 8px 32px 0 ${({ color }) => color}33;
    transform: translateY(-2px) scale(1.02);
  }
`;

export default function Benefits() {
  return (
    <Page>
      <Title>Our Water Benefits</Title>
      <Grid>
        {benefits.map((b) => {
          const isProduct = b.title !== 'Shield' && b.title !== 'PureKlean';
          const to = `/product/${b.title.toLowerCase().replace(/\s+/g, '-')}`;

          // Separate 'Best times:' line from other points
          const bestTimesIdx = b.points.findIndex(pt => pt.toLowerCase().startsWith('best times:'));
          let points = [...b.points];
          let bestTimes = null;
          if (bestTimesIdx !== -1) {
            bestTimes = points.splice(bestTimesIdx, 1)[0];
          }

          const ListContent = (
            <List>
              {points.map((pt, i) => (
                <ListItem key={i}>{pt}</ListItem>
              ))}
              {bestTimes && (
                <ListItem
                  style={{
                    marginTop: '1.1em',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '1.1em', marginRight: '0.5em' }} role="img" aria-label="clock">🕒</span>
                  <span style={{ color: b.color, fontWeight: 500, fontSize: '0.98em', fontStyle: 'italic' }}>{bestTimes.replace(/^Best times:/i, 'Best times:')}</span>
                </ListItem>
              )}
            </List>
          );

          return isProduct ? (
            <CardLink key={b.title} color={b.color} to={to}>
              <CardTitle color={b.color}>{b.title} <Ph color={b.color}>pH {b.ph}</Ph></CardTitle>
              {ListContent}
            </CardLink>
          ) : (
            <Card key={b.title} color={b.color}>
              <CardTitle color={b.color}>{b.title} <Ph color={b.color}>pH {b.ph}</Ph></CardTitle>
              {ListContent}
            </Card>
          );
        })}
      </Grid>
    </Page>
  );
} 
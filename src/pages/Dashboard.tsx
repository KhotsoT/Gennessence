import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import React from 'react';

const waterTypes = [
  { name: 'Pure Water', ph: '7.0', color: '#3074db', tip: 'Start your day gently.' },
  { name: 'Gentle Boost', ph: '8.5', color: '#2581c4', tip: 'Great between meals.' },
  { name: 'Optimal Balance', ph: '9.0', color: '#1b8ec2', tip: 'Balance before meals.' },
  { name: 'Detox Water', ph: '9.5', color: '#1b8ec2', tip: 'Perfect before bed.' },
];

// Define dynamic slots for the day
const dynamicSlots = [
  { start: 5, end: 9, label: '5:00 AM – 9:00 AM', type: 0 }, // Early Morning
  { start: 9, end: 12, label: '9:00 AM – 12:00 PM', type: 1 }, // Late Morning
  { start: 12, end: 15, label: '12:00 PM – 3:00 PM', type: 2 }, // Early Afternoon
  { start: 15, end: 18, label: '3:00 PM – 6:00 PM', type: 1 }, // Mid Afternoon
  { start: 18, end: 20, label: '6:00 PM – 8:00 PM', type: 2 }, // Early Evening
  { start: 20, end: 23, label: '8:00 PM – 11:00 PM', type: 3 }, // Night
];

function getTodayPlan() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  // Try to load from localStorage for today
  const planKey = `hydrationPlan-${today}`;
  const saved = localStorage.getItem(planKey);
  if (saved) return JSON.parse(saved);
  // Generate plan: only include slots that are still relevant for today
  const currentHour = now.getHours();
  const plan = dynamicSlots.filter(slot => slot.end > currentHour).map(slot => ({
    range: slot.label,
    type: slot.type,
    startHour: slot.start,
    endHour: slot.end,
  }));
  // If all slots have passed, show the last slot (so user can see their last chance)
  if (plan.length === 0) {
    const lastSlot = dynamicSlots[dynamicSlots.length - 1];
    plan.push({
      range: lastSlot.label,
      type: lastSlot.type,
      startHour: lastSlot.start,
      endHour: lastSlot.end,
    });
  }
  localStorage.setItem(planKey, JSON.stringify(plan));
  return plan;
}

const glassSchedule = getTodayPlan();

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6fbff 0%, #eaf3fa 100%);
  padding: 3rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 420px;
  background: #e0e7ef;
  border-radius: 999px;
  height: 22px;
  margin: 1.2rem 0 2.2rem 0;
  overflow: hidden;
`;
const Progress = styled.div<{ $percent: number; color: string }>`
  width: ${({ $percent }) => $percent}%;
  background: ${({ color }) => color};
  height: 100%;
  transition: width 0.4s;
`;

const GuideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
  margin-bottom: 2.5rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const GlassCard = styled.div<{ color: string; checked: boolean }>`
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px 0 rgba(0,60,255,0.08);
  padding: 1.2rem 1rem 1.2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-left: 7px solid ${({ color }) => color};
  opacity: ${({ checked }) => (checked ? 0.6 : 1)};
  position: relative;
`;
const GlassTime = styled.div`
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 0.3rem;
`;
const GlassType = styled.div<{ color: string }>`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ color }) => color};
  margin-bottom: 0.2rem;
`;
const GlassTip = styled.div`
  font-size: 0.98rem;
  color: #334155;
  margin-bottom: 0.7rem;
`;
const GlassCheck = styled.button<{ checked: boolean; color: string }>`
  background: ${({ checked, color }) => (checked ? color : '#e0e7ef')};
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.2rem;
  &:hover {
    background: ${({ color }) => color};
  }
`;

const FaqSection = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 2.5rem 0 2rem 0;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px 0 rgba(0,60,255,0.08);
  padding: 2rem 2rem 1.5rem 2rem;
`;
const FaqTitle = styled.h2`
  color: #3074db;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.1rem;
`;
const FaqQ = styled.div`
  font-weight: 600;
  color: #2563eb;
  margin-top: 1.1rem;
`;
const FaqA = styled.div`
  color: #334155;
  margin-bottom: 0.7rem;
`;

const BuyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
  margin-top: 2.5rem;
`;
const BuyCard = styled.div<{ color: string }>`
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px 0 rgba(0,60,255,0.08);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 6px solid ${({ color }) => color};
`;
const BuyTitle = styled.div<{ color: string }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ color }) => color};
  margin-bottom: 0.5rem;
`;
const BuyPh = styled.div<{ color: string }>`
  font-size: 1rem;
  color: ${({ color }) => color};
  background: ${({ color }) => color}22;
  border-radius: 0.5rem;
  padding: 0.2rem 0.7rem;
  margin-bottom: 1.1rem;
`;
const BuyBtn = styled.button<{ color: string }>`
  background: ${({ color }) => color};
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.9rem 2.2rem;
  border-radius: 999px;
  border: none;
  margin-top: 0.7rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: #2056a8;
    transform: scale(1.03);
  }
`;

const WelcomeBanner = styled.div`
  background: #3074db;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1.1rem 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 24px 0 rgba(0,60,255,0.10);
  text-align: center;
  animation: fadeInOut 4s forwards;
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-20px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
  }
`;

const GuideLabel = styled.div`
  font-size: 1.25rem;
  color: #2563eb;
  font-weight: 700;
  margin-bottom: 2.2rem;
  text-align: center;
  letter-spacing: 0.01em;
`;

const MissedCard = styled(GlassCard)`
  border-left: 7px solid #d81e43;
  box-shadow: 0 4px 24px 0 #d81e4333;
`;
const Celebration = styled.div`
  color: #22c55e;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 2.5rem 0 2rem 0;
  text-align: center;
`;
const Quote = styled.div`
  color: #2563eb;
  font-size: 1.08rem;
  font-style: italic;
  margin: 1.5rem 0 0.5rem 0;
  text-align: center;
`;
const dailyTips = [
  'Sip, Smile, Repeat.',
  'Hydration is the foundation of luxury living.',
  'A glass of water is a glass of wellness.',
  'Start your day with Pure Water for gentle hydration.',
  'Balance your body, balance your mind.',
  'Every sip is a step toward your best self.',
  'Alkaline water, elevated life.',
  'Hydrate for clarity, energy, and beauty.',
  'Your body is 70% water—make it premium.',
  'Luxury is feeling your best, every day.'
];

// Add helper to get full plan for any day (no date param needed)
function getFullPlanForDay() {
  return [
    { range: '5:00 AM – 9:00 AM', type: 0 },
    { range: '9:00 AM – 12:00 PM', type: 1 },
    { range: '12:00 PM – 3:00 PM', type: 2 },
    { range: '3:00 PM – 6:00 PM', type: 1 },
    { range: '6:00 PM – 8:00 PM', type: 2 },
    { range: '8:00 PM – 11:00 PM', type: 3 },
  ];
}

export default function Dashboard() {
  const { user } = useAuth();
  // Daily key for localStorage
  const todayKey = `glasses-${new Date().toISOString().slice(0, 10)}`;
  const [glasses, setGlasses] = useState<(false | Date)[]>(() => {
    const saved = localStorage.getItem(todayKey);
    if (saved) {
      return JSON.parse(saved).map((v: string | false) => (v ? new Date(v) : false));
    }
    return Array(8).fill(false);
  });
  const [showBanner, setShowBanner] = useState(() => {
    return !sessionStorage.getItem('welcomeBannerShown');
  });
  const completed = glasses.filter(Boolean).length;
  const percent = (completed / 8) * 100;
  const guideRef = React.useRef<HTMLDivElement>(null);
  const [streak, setStreak] = useState(() => {
    return Number(localStorage.getItem('hydrationStreak') || 0);
  });
  // Dynamic daily tip/quote
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const tipIdx = dayOfYear % dailyTips.length;
  const quote = streak > 1 ? `Hydration streak: ${streak} days! Keep it up!` : dailyTips[tipIdx];
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    if (showBanner) {
      sessionStorage.setItem('welcomeBannerShown', '1');
      const timer = setTimeout(() => setShowBanner(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showBanner]);

  useEffect(() => {
    // Save to localStorage on change
    localStorage.setItem(todayKey, JSON.stringify(glasses.map(g => (g ? (g as Date).toISOString() : false))));
  }, [glasses, todayKey]);

  const handleCheck = (idx: number) => {
    setGlasses(g => g.map((v, i) => (i === idx ? (v ? false : new Date()) : v)));
  };

  // Find missed and next glass
  const now = new Date();
  let missedIdxs: number[] = [];
  let nextIdx = -1;
  // Find end time of last slot
  const lastSlot = glassSchedule[glassSchedule.length - 1];
  const [, lastEnd] = lastSlot.range.split('–').map((s: string) => s.trim());
  const lastEndMatch = lastEnd.match(/(\d+):(\d+) (AM|PM)/);
  let lastEndTime = new Date(now);
  if (lastEndMatch) {
    const [__, eh, em, eap] = lastEndMatch;
    lastEndTime.setHours((eap === 'PM' && eh !== '12' ? +eh + 12 : +eh) % 24, +em, 0, 0);
  }
  if (now > lastEndTime) {
    // Day is over, all unchecked are missed
    missedIdxs = glasses.map((g, i) => (!g ? i : -1)).filter(i => i !== -1);
  } else {
    for (let i = 0; i < glassSchedule.length; i++) {
      const [start, end] = glassSchedule[i].range.split('–').map((s: string) => s.trim());
      const startMatch = start.match(/(\d+):(\d+) (AM|PM)/);
      const endMatch = end.match(/(\d+):(\d+) (AM|PM)/);
      if (!startMatch || !endMatch) continue;
      const [_, sh, sm, ap] = startMatch;
      const [__, eh, em, eap] = endMatch;
      const startTime = new Date(now);
      startTime.setHours((ap === 'PM' && sh !== '12' ? +sh + 12 : +sh) % 24, +sm, 0, 0);
      const endTime = new Date(now);
      endTime.setHours((eap === 'PM' && eh !== '12' ? +eh + 12 : +eh) % 24, +em, 0, 0);
      if (!glasses[i] && endTime < now) {
        missedIdxs.push(i);
      }
      if (nextIdx === -1 && !glasses[i] && startTime <= now && now <= endTime) {
        nextIdx = i;
      }
      if (nextIdx === -1 && !glasses[i] && startTime > now) {
        nextIdx = i;
      }
    }
  }
  // If all done
  const allDone = glasses.every(Boolean);
  useEffect(() => {
    if (allDone) {
      const lastStreak = Number(localStorage.getItem('hydrationStreak') || 0);
      localStorage.setItem('hydrationStreak', String(lastStreak + 1));
      setStreak(lastStreak + 1);
    }
  }, [allDone]);

  // Countdown for next glass
  function getCountdown(idx: number) {
    if (idx < 0) return '';
    const [start] = glassSchedule[idx].range.split('–').map((s: string) => s.trim());
    const startMatch = start.match(/(\d+):(\d+) (AM|PM)/);
    if (!startMatch) return '';
    const [_, sh, sm, ap] = startMatch;
    const startTime = new Date(now);
    startTime.setHours((ap === 'PM' && sh !== '12' ? +sh + 12 : +sh) % 24, +sm, 0, 0);
    const diff = startTime.getTime() - now.getTime();
    if (diff <= 0) return 'now!';
    const min = Math.floor(diff / 60000);
    return min < 60 ? `in ${min} min` : `in ${Math.floor(min/60)}h ${min%60}m`;
  }

  return (
    <Page>
      {showBanner && (
        <WelcomeBanner>
          Welcome, {user?.displayName || user?.email || 'User'}! You are now logged in.
        </WelcomeBanner>
      )}
      <GuideLabel style={{ marginTop: '1.5rem' }}>Your 8-Step Sip</GuideLabel>
      <ProgressBar>
        <Progress $percent={percent} color={completed === 8 ? '#22c55e' : '#3074db'} />
      </ProgressBar>
      <div style={{ marginBottom: '2.2rem', color: '#2563eb', fontWeight: 500, fontSize: '1.1rem' }}>{completed}/8 glasses today</div>
      {/* Missed Section */}
      {missedIdxs.length > 0 && (
        <div style={{ width: '100%', maxWidth: 420, margin: '0 auto 1.2rem auto' }}>
          <MissedCard color="#d81e43" checked={false} style={{ padding: '0.7rem 0.7rem 0.7rem 0.7rem', minWidth: 0, boxShadow: '0 2px 8px 0 #d81e4322' }}>
            <div style={{ color: '#d81e43', fontWeight: 700, fontSize: '1.01rem', marginBottom: 7, lineHeight: 1.1 }}>Missed Drinks</div>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', width: '100%' }}>
              {missedIdxs.map(idx => {
                const slot = glassSchedule[idx];
                if (!slot) return null;
                return (
                  <li key={idx} style={{ marginBottom: 5, borderBottom: '1px solid #f3c2cb', paddingBottom: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ fontWeight: 600, color: waterTypes[slot.type].color, fontSize: '0.97rem', lineHeight: 1.1 }}>{slot.range} — {waterTypes[slot.type].name} <span style={{ fontWeight: 400, fontSize: '0.93em' }}>pH {waterTypes[slot.type].ph}</span></span>
                    <span style={{ color: '#334155', fontSize: '0.91rem', lineHeight: 1.1 }}>{waterTypes[slot.type].tip}</span>
                  </li>
                );
              })}
            </ul>
            <div style={{ fontSize: '0.93em', color: '#d81e43', marginTop: 4, fontWeight: 600, lineHeight: 1.1 }}>Missed {missedIdxs.length} {missedIdxs.length === 1 ? 'drink' : 'drinks'} today</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 8 }}>
              <GlassCheck
                checked={false}
                color={waterTypes[glassSchedule[missedIdxs[0]].type].color}
                onClick={e => { e.stopPropagation(); missedIdxs.forEach(idx => handleCheck(idx)); }}
                aria-label="Mark all missed as Drank"
                style={{ width: 24, height: 24, fontSize: '1.1rem' }}
              >
                ○
              </GlassCheck>
            </div>
          </MissedCard>
        </div>
      )}
      {/* Next Drink */}
      {allDone ? (
        <Celebration>
          🎉 All done for today!<br />
          {streak > 1 && <span>Hydration streak: {streak} days!</span>}
        </Celebration>
      ) : nextIdx !== -1 ? (
        <GlassCard color={waterTypes[glassSchedule[nextIdx].type].color} checked={false}>
          <GlassTime>{glassSchedule[nextIdx].range}</GlassTime>
          <GlassType color={waterTypes[glassSchedule[nextIdx].type].color}>{waterTypes[glassSchedule[nextIdx].type].name} <span style={{ fontSize: '0.98em', fontWeight: 400 }}>pH {waterTypes[glassSchedule[nextIdx].type].ph}</span></GlassType>
          <GlassTip>{waterTypes[glassSchedule[nextIdx].type].tip}</GlassTip>
          <div style={{ fontSize: '0.97em', color: '#2563eb', marginTop: 4, fontWeight: 600 }}>Next Up {getCountdown(nextIdx)}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 16 }}>
            <GlassCheck
              checked={false}
              color={waterTypes[glassSchedule[nextIdx].type].color}
              onClick={e => { e.stopPropagation(); handleCheck(nextIdx); }}
              aria-label="Mark as Drank"
            >
              ○
            </GlassCheck>
          </div>
        </GlassCard>
      ) : null}
      {/* Show/Hide Full Plan Button */}
      <div style={{ margin: '1.5rem 0 0.5rem 0', textAlign: 'center' }}>
        <button
          onClick={() => setShowPlan(v => !v)}
          style={{
            background: '#3074db',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.08rem',
            border: 'none',
            borderRadius: '999px',
            padding: '0.7rem 2.2rem',
            cursor: 'pointer',
            boxShadow: '0 2px 12px 0 rgba(0,60,255,0.08)',
            transition: 'background 0.2s, transform 0.2s',
          }}
        >
          {showPlan ? 'Hide Full Plan' : (now > lastEndTime ? "Show Tomorrow's Plan" : 'Show Full Plan')}
        </button>
      </div>
      {/* Full Plan Grid (toggle) */}
      {showPlan && (
        <div>
          {now > lastEndTime && (
            <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.15rem', margin: '1.2rem 0 0.7rem 0', textAlign: 'center' }}>Tomorrow's Plan</div>
          )}
          <GuideGrid ref={guideRef}>
            {(now > lastEndTime ? getFullPlanForDay() : getFullPlanForDay()).map((g: any, i: number) => {
              if (!g) return null;
              return (
                <GlassCard
                  key={i}
                  color={waterTypes[g.type].color}
                  checked={false}
                  style={{ cursor: 'pointer' }}
                  tabIndex={0}
                  aria-label={`Glass for ${g.range}`}
                >
                  <GlassTime>{g.range}</GlassTime>
                  <GlassType color={waterTypes[g.type].color}>{waterTypes[g.type].name} <span style={{ fontSize: '0.98em', fontWeight: 400 }}>pH {waterTypes[g.type].ph}</span></GlassType>
                  <GlassTip>{waterTypes[g.type].tip}</GlassTip>
                  <div style={{ fontSize: '0.97em', color: '#64748b', marginTop: 4, fontWeight: 500 }}>Pending</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 16 }}>
                    <GlassCheck
                      checked={false}
                      color={waterTypes[g.type].color}
                      aria-label={'Check glass'}
                    >
                      ○
                    </GlassCheck>
                  </div>
                </GlassCard>
              );
            })}
          </GuideGrid>
        </div>
      )}
      <Quote>{quote}</Quote>
      <FaqSection>
        <FaqTitle>Drinking Guide & FAQ</FaqTitle>
        <FaqQ>Why 8 glasses a day?</FaqQ>
        <FaqA>8 glasses is a simple, effective rule to help you stay hydrated and healthy. Adjust for your activity, weather, and needs.</FaqA>
        <FaqQ>How do I align with meals?</FaqQ>
        <FaqA>Drink Pure Water (7.0) with meals. Use Gentle Boost (8.5) or Optimal Balance (9.0) between meals. Avoid alkaline water 30 min before/after eating.</FaqA>
        <FaqQ>On medication?</FaqQ>
        <FaqA>If you take medication, drink Pure Water (7.0) with your meds. Avoid alkaline water 30 min before/after medication unless your doctor says otherwise.</FaqA>
        <FaqQ>What if I miss a glass?</FaqQ>
        <FaqA>Don't worry! Just continue with your next scheduled glass. Consistency is more important than perfection.</FaqA>
      </FaqSection>
      <BuyGrid>
        {waterTypes.map((w, i) => (
          <BuyCard key={i} color={w.color}>
            <BuyTitle color={w.color}>{w.name}</BuyTitle>
            <BuyPh color={w.color}>pH {w.ph}</BuyPh>
            <BuyBtn color={w.color}>Buy Now</BuyBtn>
          </BuyCard>
        ))}
      </BuyGrid>
    </Page>
  );
} 
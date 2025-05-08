import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6fbff 0%, #eaf3fa 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Box = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(0,60,255,0.08);
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
`;
const Title = styled.h1`
  color: #3074db;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
`;
const Message = styled.div`
  color: #1b8ec2;
  font-size: 1.18rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;
const HomeBtn = styled.button`
  background: #3074db;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.9rem 2.2rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: #2056a8;
    transform: scale(1.03);
  }
`;

export default function PaymentSuccess() {
  const navigate = useNavigate();
  return (
    <Page>
      <Box>
        <Title>Payment Successful!</Title>
        <Message>Thank you for your payment.<br />Your order is being processed.</Message>
        <HomeBtn onClick={() => navigate('/')}>Back to Home</HomeBtn>
      </Box>
    </Page>
  );
} 
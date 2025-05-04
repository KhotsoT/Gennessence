import styled from 'styled-components';

const FooterBar = styled.footer`
  width: 100%;
  background: #f7fbff;
  border-top: 1px solid #e0e7ef;
  padding: 1.2rem 0 1.2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  color: #3074db;
  margin-top: 2.5rem;
`;
const Brand = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.02em;
  margin-bottom: 0.5rem;
`;
const Links = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
  a {
    color: #3074db;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    transition: color 0.2s;
    &:hover {
      color: #2056a8;
      text-decoration: underline;
    }
  }
`;
const Copyright = styled.div`
  font-size: 0.98rem;
  color: #64748b;
`;

export default function Footer() {
  return (
    <FooterBar>
      <Brand>Gennessence Water</Brand>
      <Links>
        <a href="#" aria-label="Privacy Policy">Privacy</a>
        <a href="#" aria-label="Contact">Contact</a>
      </Links>
      <Copyright>&copy; {new Date().getFullYear()} Gennessence. All rights reserved.</Copyright>
    </FooterBar>
  );
} 
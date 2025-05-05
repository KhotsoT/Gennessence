import React from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero';

const HomeContainer = styled.div`
  min-height: 100vh;
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Hero />
    </HomeContainer>
  );
};

export default Home; 
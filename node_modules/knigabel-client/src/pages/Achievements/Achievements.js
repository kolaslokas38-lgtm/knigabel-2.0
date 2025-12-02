import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 4rem 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.textLight};
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const Achievements = () => {
  return (
    <Container>
      <Title>🏆 Достижения</Title>
      <Subtitle>
        Система достижений, уровней и наград за чтение книг.
      </Subtitle>
    </Container>
  );
};

export default Achievements;
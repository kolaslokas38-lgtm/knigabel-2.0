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

const Events = () => {
  return (
    <Container>
      <Title>📅 Литературные события</Title>
      <Subtitle>
        Мероприятия, лекции и литературные вечера в вашей библиотеке.
      </Subtitle>
    </Container>
  );
};

export default Events;
import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;

  ${props => props.fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: ${props.theme.background};
    z-index: 9999;
  `}
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.border};
  border-top: 3px solid ${props => props.theme.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  ${props => props.size === 'small' && `
    width: 20px;
    height: 20px;
    border-width: 2px;
  `}

  ${props => props.size === 'large' && `
    width: 60px;
    height: 60px;
    border-width: 4px;
  `}
`;

const LoadingText = styled.p`
  color: ${props => props.theme.textLight};
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
  margin: 0;
`;

const Dots = styled.div`
  display: inline-block;

  &::after {
    content: '';
    animation: dots 1.5s steps(5, end) infinite;
  }
`;

const dotsAnimation = keyframes`
  0%, 20% { color: rgba(0,0,0,0); text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0); }
  40% { color: ${props => props.theme.textLight}; text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0); }
  60% { text-shadow: .25em 0 0 ${props => props.theme.textLight}, .5em 0 0 rgba(0,0,0,0); }
  80%, 100% { text-shadow: .25em 0 0 ${props => props.theme.textLight}, .5em 0 0 ${props => props.theme.textLight}; }
`;

const LoadingSpinner = ({
  size = 'medium',
  text = 'Загрузка...',
  fullScreen = false
}) => {
  return (
    <LoadingContainer fullScreen={fullScreen}>
      <Spinner size={size} />
      <LoadingText>
        {text}
        <Dots>...</Dots>
      </LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner;
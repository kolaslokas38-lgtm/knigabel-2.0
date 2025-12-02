import React from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.theme.error};
  margin-bottom: 1rem;
  opacity: 0.8;
`;

const ErrorTitle = styled.h2`
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.textLight};
  font-size: 1rem;
  margin-bottom: 2rem;
  max-width: 500px;
  line-height: 1.6;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ErrorButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorDetails = styled.details`
  margin-top: 2rem;
  max-width: 600px;
  width: 100%;

  summary {
    cursor: pointer;
    color: ${props => props.theme.textLight};
    font-size: 0.9rem;
    margin-bottom: 1rem;

    &:hover {
      color: ${props => props.theme.text};
    }
  }

  pre {
    background: ${props => props.theme.backgroundSecondary};
    border: 1px solid ${props => props.theme.border};
    border-radius: 0.5rem;
    padding: 1rem;
    font-size: 0.8rem;
    color: ${props => props.theme.textLight};
    overflow-x: auto;
    text-align: left;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Here you could send the error to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon>
            <FiAlertTriangle />
          </ErrorIcon>

          <ErrorTitle>Что-то пошло не так</ErrorTitle>

          <ErrorMessage>
            Произошла неожиданная ошибка. Пожалуйста, попробуйте перезагрузить страницу
            или обратитесь в службу поддержки, если проблема persists.
          </ErrorMessage>

          <ErrorActions>
            <ErrorButton onClick={this.handleRetry}>
              <FiRefreshCw />
              Попробовать снова
            </ErrorButton>

            <ErrorButton onClick={this.handleReload}>
              Перезагрузить страницу
            </ErrorButton>
          </ErrorActions>

          {process.env.NODE_ENV === 'development' && (
            <ErrorDetails>
              <summary>Показать детали ошибки (для разработчиков)</summary>
              <pre>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
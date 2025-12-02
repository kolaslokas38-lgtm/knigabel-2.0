import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
`;

const SearchInput = styled(motion.input)`
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 1rem;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: ${props => props.theme.textLight};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textLight};
  font-size: 1.25rem;
  pointer-events: none;
`;

const ClearButton = styled(motion.button)`
  position: absolute;
  right: 3rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.textLight};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.text};
    background: ${props => props.theme.borderLight};
  }
`;

const SearchBar = ({ value, onChange, placeholder = "Поиск..." }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onChange(localValue);
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        value={localValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      />
      <SearchIcon>
        <FiSearch />
      </SearchIcon>
      <ClearButton
        show={localValue.length > 0}
        onClick={handleClear}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: localValue.length > 0 ? 1 : 0, scale: localValue.length > 0 ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiX />
      </ClearButton>
    </SearchContainer>
  );
};

export default SearchBar;
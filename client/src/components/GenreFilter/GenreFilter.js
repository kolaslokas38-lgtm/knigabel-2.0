import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiFilter } from 'react-icons/fi';

const FilterContainer = styled.div`
  position: relative;
  min-width: 200px;
`;

const FilterSelect = styled(motion.select)`
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 1rem;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  appearance: none;

  &:focus {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    transform: translateY(-2px);
  }

  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const FilterIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textLight};
  font-size: 1.25rem;
  pointer-events: none;
`;

const FilterLabel = styled.label`
  position: absolute;
  left: 1rem;
  top: -0.5rem;
  background: ${props => props.theme.background};
  padding: 0 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.theme.textLight};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const GenreFilter = ({ value, onChange, genres = [] }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <FilterContainer>
      <FilterLabel>Жанр</FilterLabel>
      <FilterSelect
        value={value}
        onChange={handleChange}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <option value="">Все жанры</option>
        {genres.map((genre, index) => (
          <option key={index} value={genre}>
            {genre}
          </option>
        ))}
      </FilterSelect>
      <FilterIcon>
        <FiFilter />
      </FilterIcon>
    </FilterContainer>
  );
};

export default GenreFilter;
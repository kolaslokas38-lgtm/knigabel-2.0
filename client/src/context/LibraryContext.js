import { createContext } from 'react';

export const LibraryContext = createContext({
  libraryData: null,
  setLibraryData: () => {},
});
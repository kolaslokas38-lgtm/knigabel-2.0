// Storage utilities for managing app data

// Debounce utility for real-time saving
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Real-time save queue
let saveQueue = new Map();
let saveTimeout = null;

const processSaveQueue = () => {
  saveQueue.forEach((value, key) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error);
    }
  });
  saveQueue.clear();
  saveTimeout = null;
};

const queueSave = (key, value) => {
  saveQueue.set(key, value);
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(processSaveQueue, 500); // Save after 500ms of inactivity
};

export const getStoredTheme = () => {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch (error) {
    console.warn('Failed to get theme from localStorage:', error);
    return 'light';
  }
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.warn('Failed to get user from localStorage:', error);
    return null;
  }
};

export const setStoredTheme = (theme) => {
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};


// Force save all queued data immediately
export const forceSaveAll = () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    processSaveQueue();
  }
};

// Cross-tab synchronization
let storageChannel = null;

export const initializeStorageSync = () => {
  if (typeof window !== 'undefined' && window.BroadcastChannel) {
    storageChannel = new BroadcastChannel('knigabel-storage-sync');

    storageChannel.onmessage = (event) => {
      const { key, value } = event.data;
      try {
        localStorage.setItem(key, JSON.stringify(value));
        // Trigger custom event for components to update
        window.dispatchEvent(new CustomEvent('storage-sync', {
          detail: { key, value }
        }));
      } catch (error) {
        console.warn('Failed to sync storage:', error);
      }
    };
  }
};

export const syncDataAcrossTabs = (key, value) => {
  if (storageChannel) {
    storageChannel.postMessage({ key, value });
  }
};

// Enhanced save function with cross-tab sync
const enhancedQueueSave = (key, value) => {
  queueSave(key, value);
  syncDataAcrossTabs(key, value);
};

export const setStoredUser = (user) => {
  enhancedQueueSave('user', user);
};

export const setStoredBooks = (books) => {
  enhancedQueueSave('books', books);
};

export const setStoredFavorites = (favorites) => {
  enhancedQueueSave('favorites', favorites);
};

export const setStoredReadingProgress = (progress) => {
  enhancedQueueSave('readingProgress', progress);
};

export const clearAllData = () => {
  try {
    const keysToKeep = ['theme']; // Keep theme preference
    const allKeys = Object.keys(localStorage);

    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Clear save queue
    saveQueue.clear();
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      saveTimeout = null;
    }

    return true;
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
    return false;
  }
};
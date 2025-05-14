import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextProps {
  isAdminPanelOpen: boolean;
  openAdminPanel: () => void;
  closeAdminPanel: () => void;
  
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const openAdminPanel = () => {
    setIsAdminPanelOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAdminPanel = () => {
    setIsAdminPanelOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <UIContext.Provider
      value={{
        isAdminPanelOpen,
        openAdminPanel,
        closeAdminPanel,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        activeFilter,
        setActiveFilter
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  
  return context;
}

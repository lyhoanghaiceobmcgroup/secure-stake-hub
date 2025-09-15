import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletBalance {
  available: number;
  held: number;
  reconciling: number;
  lastUpdated: string;
}

interface WalletContextType {
  walletBalance: WalletBalance;
  balance: number;
  updateAvailableBalance: (amount: number) => void;
  updateHeldBalance: (amount: number) => void;
  updateReconcilingBalance: (amount: number) => void;
  refreshBalance: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    available: 4000000000,
    held: 12000000,
    reconciling: 0,
    lastUpdated: new Date().toLocaleString('vi-VN')
  });

  const updateAvailableBalance = (amount: number) => {
    setWalletBalance(prev => ({
      ...prev,
      available: prev.available + amount,
      lastUpdated: new Date().toLocaleString('vi-VN')
    }));
  };

  const updateHeldBalance = (amount: number) => {
    setWalletBalance(prev => ({
      ...prev,
      held: prev.held + amount,
      lastUpdated: new Date().toLocaleString('vi-VN')
    }));
  };

  const updateReconcilingBalance = (amount: number) => {
    setWalletBalance(prev => ({
      ...prev,
      reconciling: prev.reconciling + amount,
      lastUpdated: new Date().toLocaleString('vi-VN')
    }));
  };

  const refreshBalance = () => {
    setWalletBalance(prev => ({
      ...prev,
      lastUpdated: new Date().toLocaleString('vi-VN')
    }));
  };

  const value: WalletContextType = {
    walletBalance,
    balance: walletBalance.available,
    updateAvailableBalance,
    updateHeldBalance,
    updateReconcilingBalance,
    refreshBalance
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
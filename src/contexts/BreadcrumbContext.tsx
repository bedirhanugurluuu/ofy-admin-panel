// src/contexts/BreadcrumbContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface BreadcrumbPath {
  name: string;
  to?: string;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbPath[];
  setBreadcrumbs: (paths: BreadcrumbPath[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
  const [breadcrumbs, setBreadcrumbsState] = useState<BreadcrumbPath[]>([]);
  const [isLoading, setIsLoadingState] = useState(false);

  const setBreadcrumbs = useCallback((paths: BreadcrumbPath[]) => {
    setBreadcrumbsState(paths);
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setIsLoadingState(loading);
  }, []);

  return (
    <BreadcrumbContext.Provider value={{
      breadcrumbs,
      setBreadcrumbs,
      isLoading,
      setIsLoading
    }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

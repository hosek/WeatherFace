import React, { createContext, useContext, useState, ReactNode } from 'react';
import { fetchDataFromAPI } from '@/services/dataService';

type DataContextType = {
  data: any;
  fetchData: (url: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDataFromAPI(url);
      setData(result);
    } catch (err) {
      setError(`Failed to load data (${err})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider value={{ data, fetchData, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

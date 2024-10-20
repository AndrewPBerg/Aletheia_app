import React, { createContext, useContext, useState, ReactNode } from 'react';

type Connection = { id: number; name: string; source: any };

type GlobalStateContextType = {
  likedVideos: string[];
  addLikedVideo: (videoName: string) => void;
  connections: Connection[];
  addConnection: (connection: Connection) => void;
};

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  const addLikedVideo = (videoName: string) => {
    setLikedVideos((prev) => [...new Set([...prev, videoName])]);
  };

  const addConnection = (connection: Connection) => {
    setConnections((prev) => {
      if (!prev.some((c) => c.id === connection.id)) {
        return [...prev, connection];
      }
      return prev;
    });
  };

  return (
    <GlobalStateContext.Provider value={{ likedVideos, addLikedVideo, connections, addConnection }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

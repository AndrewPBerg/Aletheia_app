import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalStateContextType {
  likedVideos: string[];
  addLikedVideo: (videoName: string) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedVideos, setLikedVideos] = useState<string[]>([]);

  const addLikedVideo = (videoName: string) => {
    setLikedVideos((prev) => {
      if (!prev.includes(videoName)) {
        return [...prev, videoName];
      }
      return prev;
    });
  };

  return (
    <GlobalStateContext.Provider value={{ likedVideos, addLikedVideo }}>
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

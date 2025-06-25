import React, {createContext, useRef, ReactNode, useContext} from 'react';
import {ScrollView} from 'react-native';

interface ScrollViewContextProps {
  scrollViewRef: React.RefObject<ScrollView> | null;
  scrollToEnd: () => void;
}

const ScrollViewContext = createContext<ScrollViewContextProps | undefined>(
  undefined,
);

export const ScrollViewProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  };

  const value: ScrollViewContextProps = {
    scrollViewRef,
    scrollToEnd,
  };

  return (
    <ScrollViewContext.Provider value={value}>
      {children}
    </ScrollViewContext.Provider>
  );
};

export const useScrollView = () => {
  const context = useContext(ScrollViewContext);
  if (!context) {
    throw new Error('useScrollView must be used within a ScrollViewProvider');
  }
  return context;
};

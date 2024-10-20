import { useState, useEffect } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

export function useReducedMotion() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      AccessibilityInfo.isReduceMotionEnabled().then(setIsReducedMotion);
    }
  }, []);

  return isReducedMotion;

  
}

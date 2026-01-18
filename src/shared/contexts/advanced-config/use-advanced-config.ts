import { useContext } from 'react';
import { SettingsContext } from '../settings/context';

export const useAdvancedConfig = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useAdvancedConfig must be used within SettingsProvider');
  }
  return {
    customMinWage: context.customMinWage,
    setCustomMinWage: context.setCustomMinWage,
    customCasThreshold1: context.customCasThreshold1,
    setCustomCasThreshold1: context.setCustomCasThreshold1,
    customCasThreshold2: context.customCasThreshold2,
    setCustomCasThreshold2: context.setCustomCasThreshold2,
    customCassMinThreshold: context.customCassMinThreshold,
    setCustomCassMinThreshold: context.setCustomCassMinThreshold,
    customCassMaxCap: context.customCassMaxCap,
    setCustomCassMaxCap: context.setCustomCassMaxCap,
    resetToDefaults: context.resetToDefaults,
  };
};

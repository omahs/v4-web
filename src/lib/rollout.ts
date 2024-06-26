import { LocalStorageKey } from '@/constants/localStorage';
import { DEFAULT_APP_ENVIRONMENT } from '@/constants/networks';

import { getLocalStorage } from './localStorage';
import { validateAgainstAvailableEnvironments } from './network';

export const shouldUseSkip = () => {
  const env = getLocalStorage({
    key: LocalStorageKey.SelectedNetwork,
    defaultValue: DEFAULT_APP_ENVIRONMENT,
    validateFn: validateAgainstAvailableEnvironments,
  });
  return !env.includes('mainnet');
};

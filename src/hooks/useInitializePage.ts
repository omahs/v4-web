import { useEffect } from 'react';

import { LocalStorageKey } from '@/constants/localStorage';
import { DEFAULT_APP_ENVIRONMENT, type DydxNetwork } from '@/constants/networks';

import { initializeLocalization } from '@/state/app';
import { useAppDispatch } from '@/state/appTypes';

import { useAbacus } from '@/lib/abacus/useAbacus';
import { validateAgainstAvailableEnvironments } from '@/lib/network';

import { useLocalStorage } from './useLocalStorage';

export const useInitializePage = () => {
  const dispatch = useAppDispatch();
  const { abacusStateManager } = useAbacus();

  // Sync localStorage value with Redux
  const [localStorageNetwork] = useLocalStorage<DydxNetwork>({
    key: LocalStorageKey.SelectedNetwork,
    defaultValue: DEFAULT_APP_ENVIRONMENT,
    validateFn: validateAgainstAvailableEnvironments,
  });

  useEffect(() => {
    if (abacusStateManager) {
      dispatch(initializeLocalization());
      abacusStateManager?.start({ network: localStorageNetwork });
    }
  }, [abacusStateManager]);
};

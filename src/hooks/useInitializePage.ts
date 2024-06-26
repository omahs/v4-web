import { useEffect } from 'react';

import { LocalStorageKey } from '@/constants/localStorage';
import { DEFAULT_APP_ENVIRONMENT, type DydxNetwork } from '@/constants/networks';
import { DydxAddress } from '@/constants/wallets';

import { initializeLocalization } from '@/state/app';
import { useAppDispatch } from '@/state/appTypes';

import abacusStateManager from '@/lib/abacus';
import { validateAgainstAvailableEnvironments } from '@/lib/network';

import { useLocalStorage } from './useLocalStorage';

export const useInitializePage = () => {
  const dispatch = useAppDispatch();
  // Cosmos wallet connection
  const [dydxAddress, saveDydxAddress] = useLocalStorage<DydxAddress | undefined>({
    key: LocalStorageKey.DydxAddress,
    defaultValue: undefined,
  });

  // Sync localStorage value with Redux
  const [localStorageNetwork] = useLocalStorage<DydxNetwork>({
    key: LocalStorageKey.SelectedNetwork,
    defaultValue: DEFAULT_APP_ENVIRONMENT,
    validateFn: validateAgainstAvailableEnvironments,
  });

  useEffect(() => {
    dispatch(initializeLocalization());
    abacusStateManager.start({ network: localStorageNetwork });
  }, [dydxAddress]);
};

import { createContext, useContext, useEffect, useState } from 'react';

import { StatSigFlags, useStatSigGateValue } from '@/hooks/useStatsig';

import { store } from '@/state/_store';

import { AbacusStateManager } from '.';

const AbacusContext = createContext<ReturnType<typeof useAbacusContext>>({
  abacusStateManager: null,
});
AbacusContext.displayName = 'Abacus';

export const AbacusProvider = ({ ...props }) => (
  <AbacusContext.Provider value={useAbacusContext()} {...props} />
);

const useAbacusContext = () => {
  const [abacus, setAbacus] = useState<AbacusStateManager | null>(null);
  const useSkip = useStatSigGateValue(StatSigFlags.ffSkipMigration);
  useEffect(() => {
    const _abacus = new AbacusStateManager(useSkip);
    _abacus.setStore(store);
    setAbacus(_abacus);
  }, [useSkip]);
  return {
    abacusStateManager: abacus ?? new AbacusStateManager(false),
  };
};

export const useAbacus = () => useContext(AbacusContext);

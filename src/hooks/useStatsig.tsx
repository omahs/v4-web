import { useEffect, useState } from 'react';

import { StatsigClient } from '@statsig/js-client';
import { StatsigProvider, useStatsigClient } from '@statsig/react-bindings';

export enum StatSigFlags {
  // When adding a flag here, make sure to add an analytics tracker in useAnalytics.ts
  ffSkipMigration = 'ff_skip_migration',
}

const fetchIpAddress = async () => {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
};

export const StatSigProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<StatsigClient>();
  useEffect(() => {
    const initStatsig = async () => {
      const client = new StatsigClient(`${import.meta.env.VITE_STATSIG_CLIENT_KEY}`, {
        // TODO: fill in with ip address
        ip: await fetchIpAddress(),
      });
      client.initializeSync();
      setClient(client);
    };

    initStatsig();
  }, []);
  if (!client) return <></>;

  return <StatsigProvider client={client}> {children} </StatsigProvider>;
};

export const useStatSigGateValue = (gate: StatSigFlags) => {
  const { checkGate } = useStatsigClient();
  return checkGate(gate);
};

import { useSelector } from 'react-redux';
import { useSignTypedData } from 'wagmi';

import { getSignTypedData } from '@/constants/wallets';

import { getSelectedDydxChainId, getSelectedNetwork } from '@/state/appSelectors';

export default function useSignForWalletDerivation() {
  const selectedDydxChainId = useSelector(getSelectedDydxChainId);
  const selectedNetwork = useSelector(getSelectedNetwork);
  const chainId = 1;

  const signTypedData = getSignTypedData();
  const { signTypedDataAsync } = useSignTypedData({
    ...signTypedData,
    domain: {
      ...signTypedData.domain,
      chainId,
    },
  });
  return signTypedDataAsync;
}

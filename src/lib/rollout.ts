import { OnboardingConfig } from '@/constants/abacus';

export const shouldUseSkip = () => {
  // const env = getLocalStorage({
  //   key: LocalStorageKey.SelectedNetwork,
  //   defaultValue: DEFAULT_APP_ENVIRONMENT,
  //   validateFn: validateAgainstAvailableEnvironments,
  // });
  // return !env.includes('mainnet') || ;
  return true;
};

export const getRouterVendor = () => {
  return shouldUseSkip() ? OnboardingConfig.RouterVendor.Skip : OnboardingConfig.RouterVendor.Squid;
};

import { lazy, Suspense, useMemo } from 'react';

import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GrazProvider } from 'graz';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { WagmiConfig } from 'wagmi';

import { AppRoute, MarketsRoute } from '@/constants/routes';

import { AccountsProvider } from '@/hooks/useAccounts';
import { AppThemeAndColorModeProvider } from '@/hooks/useAppThemeAndColorMode';
import { DialogAreaProvider, useDialogArea } from '@/hooks/useDialogArea';
import { DydxProvider } from '@/hooks/useDydxClient';
import { LocalNotificationsProvider } from '@/hooks/useLocalNotifications';
import { LocaleProvider } from '@/hooks/useLocaleSeparators';
import { NotificationsProvider } from '@/hooks/useNotifications';
import { PotentialMarketsProvider } from '@/hooks/usePotentialMarkets';
import { RestrictionProvider } from '@/hooks/useRestrictions';
import { StatsigProvider } from '@/hooks/useStatsig';
import { SubaccountProvider } from '@/hooks/useSubaccount';

import '@/styles/constants.css';
import '@/styles/fonts.css';
import { GlobalStyle } from '@/styles/globalStyle';
import { layoutMixins } from '@/styles/layoutMixins';
import '@/styles/web3modal.css';

import { GuardedMobileRoute } from '@/components/GuardedMobileRoute';
import { LoadingSpace } from '@/components/Loading/LoadingSpinner';
import { DialogManager } from '@/layout/DialogManager';
import { FooterDesktop } from '@/layout/Footer/FooterDesktop';
import { FooterMobile } from '@/layout/Footer/FooterMobile';
import { HeaderDesktop } from '@/layout/Header/HeaderDesktop';
import { NotificationsToastArea } from '@/layout/NotificationsToastArea';
import { GlobalCommandDialog } from '@/views/dialogs/GlobalCommandDialog';

import { parseLocationHash } from '@/lib/urlUtils';
import { config, configureChainsConfig, privyConfig } from '@/lib/wagmi';

import { ComplianceStates } from './constants/compliance';
import { useAnalytics } from './hooks/useAnalytics';
import { useBreakpoints } from './hooks/useBreakpoints';
import { useComplianceState } from './hooks/useComplianceState';
import { useEnvFeatures } from './hooks/useEnvFeatures';
import { useInitializePage } from './hooks/useInitializePage';
import { useShouldShowFooter } from './hooks/useShouldShowFooter';
import { useTokenConfigs } from './hooks/useTokenConfigs';
import breakpoints from './styles/breakpoints';

const NewMarket = lazy(() => import('@/pages/markets/NewMarket'));
const MarketsPage = lazy(() => import('@/pages/markets/Markets'));
const PortfolioPage = lazy(() => import('@/pages/portfolio/Portfolio'));
const AlertsPage = lazy(() => import('@/pages/AlertsPage'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
const SettingsPage = lazy(() => import('@/pages/settings/Settings'));
const TradePage = lazy(() => import('@/pages/trade/Trade'));
const TermsOfUsePage = lazy(() => import('@/pages/TermsOfUsePage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TokenPage = lazy(() => import('@/pages/token/Token'));
const VaultsPage = lazy(() => import('@/pages/vaults/Vaults'));

const queryClient = new QueryClient();

const Content = () => {
  useInitializePage();
  useAnalytics();

  const { isTablet, isNotTablet } = useBreakpoints();
  const { complianceState } = useComplianceState();
  const { isStakingEnabled } = useEnvFeatures();
  const { chainTokenLabel } = useTokenConfigs();

  const location = useLocation();
  const isShowingHeader = isNotTablet;
  const isShowingFooter = useShouldShowFooter();

  const pathFromHash = useMemo(() => {
    if (location.hash === '') {
      return '';
    }
    return parseLocationHash(location.hash);
  }, [location.hash]);

  const { dialogAreaRef } = useDialogArea() ?? {};

  const showChainTokenPage = complianceState === ComplianceStates.FULL_ACCESS || isStakingEnabled;

  return (
    <>
      <GlobalStyle />
      <$Content isShowingHeader={isShowingHeader} isShowingFooter={isShowingFooter}>
        {isNotTablet && <HeaderDesktop />}

        <$Main>
          <Suspense fallback={<LoadingSpace id="main" />}>
            <Routes>
              <Route path={AppRoute.Trade}>
                <Route path=":market" element={<TradePage />} />
                <Route path={AppRoute.Trade} element={<TradePage />} />
              </Route>

              <Route path={AppRoute.Markets}>
                <Route path={MarketsRoute.New} element={<NewMarket />} />
                <Route path={AppRoute.Markets} element={<MarketsPage />} />
              </Route>

              <Route
                path={`/${chainTokenLabel}/*`}
                element={showChainTokenPage ? <TokenPage /> : <Navigate to={AppRoute.Markets} />}
              />

              {isTablet && (
                <>
                  <Route path={AppRoute.Alerts} element={<AlertsPage />} />
                  <Route path={AppRoute.Profile} element={<ProfilePage />} />
                  <Route path={`${AppRoute.Settings}/*`} element={<SettingsPage />} />
                </>
              )}

              <Route element={<GuardedMobileRoute />}>
                <Route path={`${AppRoute.Portfolio}/*`} element={<PortfolioPage />} />
              </Route>

              <Route path={AppRoute.Vaults}>
                <Route path={AppRoute.Vaults} element={<VaultsPage />} />
              </Route>

              <Route path={AppRoute.Terms} element={<TermsOfUsePage />} />
              <Route path={AppRoute.Privacy} element={<PrivacyPolicyPage />} />
              <Route
                path="*"
                element={<Navigate to={pathFromHash || AppRoute.Markets} replace />}
              />
            </Routes>
          </Suspense>
        </$Main>

        {isTablet ? <FooterMobile /> : <FooterDesktop />}

        <$NotificationsToastArea />

        <$DialogArea ref={dialogAreaRef}>
          <DialogManager />
        </$DialogArea>

        <GlobalCommandDialog />
      </$Content>
    </>
  );
};

const wrapProvider = (Component: React.ComponentType<any>, props?: any) => {
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <Component {...props}>{children}</Component>
  );
};

const providers = [
  wrapProvider(PrivyProvider, {
    appId: import.meta.env.VITE_PRIVY_APP_ID ?? 'dummyappiddummyappiddummy',
    clientId: import.meta.env.VITE_PRIVY_APP_CLIENT_ID,
    config: privyConfig,
  }),
  wrapProvider(StatsigProvider),
  wrapProvider(QueryClientProvider, { client: queryClient }),
  wrapProvider(GrazProvider),
  wrapProvider(PrivyWagmiConnector, { wagmiChainsConfig: configureChainsConfig }),
  wrapProvider(WagmiConfig, { config }),
  wrapProvider(LocaleProvider),
  wrapProvider(RestrictionProvider),
  wrapProvider(DydxProvider),
  wrapProvider(AccountsProvider),
  wrapProvider(SubaccountProvider),
  wrapProvider(LocalNotificationsProvider),
  wrapProvider(NotificationsProvider),
  wrapProvider(DialogAreaProvider),
  wrapProvider(PotentialMarketsProvider),
  wrapProvider(AppThemeAndColorModeProvider),
];

const App = () => {
  return [...providers].reverse().reduce(
    (children, Provider) => {
      return <Provider>{children}</Provider>;
    },
    <Content />
  );
};

const $Content = styled.div<{ isShowingHeader: boolean; isShowingFooter: boolean }>`
  /* Computed */
  --page-currentHeaderHeight: 0px;
  --page-currentFooterHeight: 0px;

  ${({ isShowingHeader }) =>
    isShowingHeader &&
    css`
      --page-currentHeaderHeight: var(--page-header-height);

      @media ${breakpoints.tablet} {
        --page-currentHeaderHeight: var(--page-header-height-mobile);
      }
    `}

  ${({ isShowingFooter }) =>
    isShowingFooter &&
    css`
      --page-currentFooterHeight: var(--page-footer-height);

      @media ${breakpoints.tablet} {
        --page-currentFooterHeight: var(--page-footer-height-mobile);
      }
    `}
  
    /* Rules */
    ${layoutMixins.contentContainer}
  
    ${layoutMixins.scrollArea}
    --scrollArea-height: 100vh;

  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }

  ${layoutMixins.stickyArea0}
  --stickyArea0-topHeight: var(--page-currentHeaderHeight);
  --stickyArea0-topGap: var(--border-width);
  --stickyArea0-bottomGap: var(--border-width);
  --stickyArea0-bottomHeight: var(--page-currentFooterHeight);

  ${layoutMixins.withOuterAndInnerBorders}
  display: grid;
  grid-template:
    'Header' var(--page-currentHeaderHeight)
    'Main' minmax(min-content, 1fr)
    'Footer' var(--page-currentFooterHeight)
    / 100%;

  transition: 0.3s var(--ease-out-expo);
`;

const $Main = styled.main`
  ${layoutMixins.contentSectionAttached}
  box-shadow: none;

  grid-area: Main;

  isolation: isolate;

  position: relative;
`;

const $NotificationsToastArea = styled(NotificationsToastArea)`
  grid-area: Main;
  z-index: 2;
`;

const $DialogArea = styled.aside`
  position: fixed;
  height: 100%;
  z-index: 1;
  inset: 0;
  overflow: clip;
  ${layoutMixins.noPointerEvents}
`;

export default App;

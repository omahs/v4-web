import styled from 'styled-components';

import { SubaccountPendingPosition } from '@/constants/abacus';
import { STRING_KEYS } from '@/constants/localization';

import { useStringGetter } from '@/hooks';

import { layoutMixins } from '@/styles/layoutMixins';

import { AssetIcon } from './AssetIcon';
import { Icon, IconName } from './Icon';
import { Link } from './Link';
import { Output, OutputType } from './Output';

type PotentialPositionCardProps = {
  marketName: string;
  onViewOrders: (marketId: string) => void;
  pendingPosition: SubaccountPendingPosition;
};

export const PotentialPositionCard = ({
  marketName,
  onViewOrders,
  pendingPosition,
}: PotentialPositionCardProps) => {
  const stringGetter = useStringGetter();
  const { assetId, freeCollateral, marketId, orderCount } = pendingPosition;

  return (
    <$PotentialPositionCard>
      <$MarketRow>
        <AssetIcon symbol={assetId} />
        {marketName}
      </$MarketRow>
      <$MarginRow>
        <$MarginLabel>{stringGetter({ key: STRING_KEYS.MARGIN })}</$MarginLabel>{' '}
        <$Output type={OutputType.Fiat} value={freeCollateral?.current} />
      </$MarginRow>
      <$ActionRow>
        <$Link onClick={() => onViewOrders(marketId)}>
          {stringGetter({ key: orderCount > 1 ? STRING_KEYS.VIEW_ORDERS : STRING_KEYS.VIEW })}{' '}
          <Icon iconName={IconName.Arrow} />
        </$Link>
      </$ActionRow>
    </$PotentialPositionCard>
  );
};

const $PotentialPositionCard = styled.div`
  ${layoutMixins.flexColumn}
  width: 14rem;
  min-width: 14rem;
  height: 6.5rem;
  background-color: var(--color-layer-3);
  overflow: hidden;
  padding: 0.75rem 0;
  border-radius: 0.625rem;
`;

const $MarketRow = styled.div`
  ${layoutMixins.row}
  gap: 0.5rem;
  padding: 0 0.625rem;
  font: var(--font-small-book);

  img {
    font-size: 1.25rem; // 20px x 20px
  }
`;

const $MarginRow = styled.div`
  ${layoutMixins.spacedRow}
  padding: 0 0.625rem;
  margin-top: 0.625rem;
`;

const $MarginLabel = styled.span`
  color: var(--color-text-0);
  font: var(--font-mini-book);
`;

const $Output = styled(Output)`
  font: var(--font-small-book);
`;

const $ActionRow = styled.div`
  ${layoutMixins.spacedRow}
  border-top: var(--border);
  margin-top: 0.5rem;
  padding: 0 0.625rem;
  padding-top: 0.5rem;
`;

const $Link = styled(Link)`
  --link-color: var(--color-accent);
  font: var(--font-small-book);
`;

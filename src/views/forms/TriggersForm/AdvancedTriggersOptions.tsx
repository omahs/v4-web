import styled, { AnyStyledComponent } from 'styled-components';

import { TriggerOrder } from '@/constants/abacus';
import { Nullable } from '@/constants/abacus';
import { STRING_KEYS } from '@/constants/localization';

import { useStringGetter } from '@/hooks';

import { layoutMixins } from '@/styles/layoutMixins';

import { HorizontalSeparatorFiller } from '@/components/Separator';

import { LimitPriceInputs } from './LimitPriceInputs';
import { OrderSizeInput } from './OrderSizeInput';

type ElementProps = {
  symbol: string;
  stopLossOrder?: Nullable<TriggerOrder>;
  takeProfitOrder?: Nullable<TriggerOrder>;
  stepSizeDecimals?: number;
  tickSizeDecimals?: number;
};

type StyleProps = {
  className?: string;
};

export const AdvancedTriggersOptions = ({
  symbol,
  stopLossOrder,
  takeProfitOrder,
  stepSizeDecimals,
  tickSizeDecimals,
  className,
}: ElementProps & StyleProps) => {
  const stringGetter = useStringGetter();

  return (
    <Styled.Container>
      <Styled.Header>
        {stringGetter({ key: STRING_KEYS.ADVANCED })}
        <HorizontalSeparatorFiller />
      </Styled.Header>
      <Styled.Content>
        <OrderSizeInput
          className={className}
          symbol={symbol}
          stepSizeDecimals={stepSizeDecimals}
          stopLossOrder={stopLossOrder}
          takeProfitOrder={takeProfitOrder}
        />
        <LimitPriceInputs
          className={className}
          tickSizeDecimals={tickSizeDecimals}
          stopLossOrder={stopLossOrder}
          takeProfitOrder={takeProfitOrder}
        />
      </Styled.Content>
    </Styled.Container>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Container = styled.div`
  ${layoutMixins.column}
`;

Styled.Header = styled.h3`
  ${layoutMixins.inlineRow}
  font: var(--font-small-medium);
  color: var(--color-text-0);

  margin-bottom: 0.5rem;
`;

Styled.Content = styled.div`
  display: grid;
  gap: 0.5em;
`;

import { useEffect, useState } from 'react';

import styled, { AnyStyledComponent } from 'styled-components';

import { Nullable } from '@/constants/abacus';
import { TriggerOrder } from '@/constants/abacus';
import { STRING_KEYS } from '@/constants/localization';
import { USD_DECIMALS } from '@/constants/numbers';

import { useStringGetter } from '@/hooks';

import { layoutMixins } from '@/styles/layoutMixins';

import { Checkbox } from '@/components/Checkbox';
import { Collapsible } from '@/components/Collapsible';
import { FormInput } from '@/components/FormInput';
import { Tag } from '@/components/Tag';
import { WithTooltip } from '@/components/WithTooltip';

import { isConditionalLimitOrderType } from '@/lib/orders';

type ElementProps = {
  stopLossOrder?: Nullable<TriggerOrder>;
  takeProfitOrder?: Nullable<TriggerOrder>;
  tickSizeDecimals?: number;
};

type StyleProps = {
  className?: string;
};

export const LimitPriceInputs = ({
  stopLossOrder,
  takeProfitOrder,
  tickSizeDecimals,
  className,
}: ElementProps & StyleProps) => {
  const stringGetter = useStringGetter();

  const [shouldShowLimitPrice, setShouldShowLimitPrice] = useState(false);

  useEffect(() => {
    setShouldShowLimitPrice(
      !!(
        isConditionalLimitOrderType(stopLossOrder?.type || undefined) ||
        isConditionalLimitOrderType(takeProfitOrder?.type || undefined)
      )
    );
  }, [stopLossOrder, takeProfitOrder]); // xcxc this might break if you're updating the order type

  const onCheckLimit = (checked: boolean) => {
    if (!checked) {
      // should signify it is a market order now
    }
    setShouldShowLimitPrice(checked);
  };

  return (
    <>
      <Collapsible
        className={className}
        slotTrigger={
          <Checkbox checked={shouldShowLimitPrice} onCheckedChange={setShouldShowLimitPrice} />
        }
        open={shouldShowLimitPrice}
        label={
          <WithTooltip tooltip="limit-price">
            {stringGetter({ key: STRING_KEYS.LIMIT_PRICE })}
          </WithTooltip>
        }
      >
        {
          <Styled.InputsRow>
            <FormInput
              id="TP-limit"
              decimals={tickSizeDecimals ?? USD_DECIMALS}
              value={
                isConditionalLimitOrderType(takeProfitOrder?.type)
                  ? takeProfitOrder?.price?.limitPrice
                  : null
              }
              label={
                <>
                  {stringGetter({ key: STRING_KEYS.TP_LIMIT })}
                  <Tag>USD</Tag>
                </>
              }
            />
            <FormInput
              id="SL-limit"
              decimals={tickSizeDecimals ?? USD_DECIMALS}
              value={
                isConditionalLimitOrderType(stopLossOrder?.type)
                  ? stopLossOrder?.price?.limitPrice
                  : null
              }
              label={
                <>
                  {stringGetter({ key: STRING_KEYS.SL_LIMIT })}
                  <Tag>USD</Tag>
                </>
              }
            />
          </Styled.InputsRow>
        }
      </Collapsible>
    </>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.InputsRow = styled.span`
  ${layoutMixins.flexEqualColumns}
  gap: 1ch;
`;

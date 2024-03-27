import { useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';
import styled, { AnyStyledComponent } from 'styled-components';

import {
  AbacusOrderType,
  TriggerOrdersInputField,
  TriggerOrdersInputFields,
} from '@/constants/abacus';
import { STRING_KEYS } from '@/constants/localization';
import { USD_DECIMALS } from '@/constants/numbers';

import { useStringGetter } from '@/hooks';

import { layoutMixins } from '@/styles/layoutMixins';

import { Checkbox } from '@/components/Checkbox';
import { Collapsible } from '@/components/Collapsible';
import { FormInput } from '@/components/FormInput';
import { Tag } from '@/components/Tag';
import { WithTooltip } from '@/components/WithTooltip';

import { getTriggerOrdersInputs } from '@/state/inputsSelectors';

import abacusStateManager from '@/lib/abacus';
import { MustBigNumber } from '@/lib/numbers';
import { isConditionalLimitOrderType } from '@/lib/orders';

type ElementProps = {
  tickSizeDecimals?: number;
  multipleTakeProfitOrders: boolean;
  multipleStopLossOrders: boolean;
};

type StyleProps = {
  className?: string;
};

export const LimitPriceInputs = ({
  tickSizeDecimals,
  multipleTakeProfitOrders, // xcxc maybe pull this up into state
  multipleStopLossOrders,
  className,
}: ElementProps & StyleProps) => {
  const stringGetter = useStringGetter();

  const { stopLossOrder, takeProfitOrder } =
    useSelector(getTriggerOrdersInputs, shallowEqual) || {};

  const [shouldShowLimitPrice, setShouldShowLimitPrice] = useState(false);

  useEffect(() => {
    setShouldShowLimitPrice(
      !!(
        isConditionalLimitOrderType(stopLossOrder?.type || undefined) ||
        isConditionalLimitOrderType(takeProfitOrder?.type || undefined)
      )
    );
  }, []); 

  const onCheckLimit = (newChecked: boolean) => {
    if (!newChecked) {
      abacusStateManager.setTriggerOrdersValue({
        value: AbacusOrderType.takeProfitMarket.rawValue,
        field: TriggerOrdersInputField.takeProfitOrderType,
      });
      abacusStateManager.setTriggerOrdersValue({
        value: null,
        field: TriggerOrdersInputField.takeProfitLimitPrice,
      });
      abacusStateManager.setTriggerOrdersValue({
        value: AbacusOrderType.stopMarket.rawValue,
        field: TriggerOrdersInputField.stopLossOrderType,
      });
      abacusStateManager.setTriggerOrdersValue({
        value: null,
        field: TriggerOrdersInputField.stopLossLimitPrice,
      });
    }
    // we don't want to update types here if checked, not until they type
    setShouldShowLimitPrice(newChecked);
  };

  const onLimitInput =
    (field: TriggerOrdersInputFields) =>
    ({ floatValue, formattedValue }: { floatValue?: number; formattedValue: string }) => {
      const newLimitPrice = MustBigNumber(floatValue);

      abacusStateManager.setTriggerOrdersValue({
        value:
          formattedValue === '' || newLimitPrice === 'NaN'
            ? null
            : newLimitPrice.toFixed(tickSizeDecimals),
        field,
      });
    };

  return (
    <>
      <Collapsible
        className={className}
        slotTrigger={<Checkbox checked={shouldShowLimitPrice} onCheckedChange={onCheckLimit} />}
        open={shouldShowLimitPrice}
        label={
          <WithTooltip tooltip="limit-price">
            {stringGetter({ key: STRING_KEYS.LIMIT_PRICE })}
          </WithTooltip>
        }
      >
        {
          <Styled.InputsRow>
            {!multipleTakeProfitOrders && (
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
                onInput={onLimitInput(TriggerOrdersInputField.takeProfitLimitPrice)}
              />
            )}
            {!multipleStopLossOrders && (
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
                onInput={onLimitInput(TriggerOrdersInputField.stopLossLimitPrice)}
              />
            )}
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

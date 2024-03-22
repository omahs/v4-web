import { shallowEqual, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import styled, { type AnyStyledComponent } from 'styled-components';

import { TriggerOrdersInputField, type SubaccountOrder } from '@/constants/abacus';
import { ButtonAction } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';

import { useStringGetter } from '@/hooks';

import { layoutMixins } from '@/styles/layoutMixins';

import { Button } from '@/components/Button';
import { Output, OutputType } from '@/components/Output';

import { getPositionDetails } from '@/state/accountSelectors';

import { AdvancedTriggersOptions } from './AdvancedTriggersOptions';
import { TriggerOrderInputs } from './TriggerOrderInputs';

import abacusStateManager from '@/lib/abacus';
import { getTriggerOrdersInputs } from '@/state/inputsSelectors';
import { TradeTypes } from '@/constants/trade';

type ElementProps = {
  marketId: string;
  stopLossOrders: SubaccountOrder[];
  takeProfitOrders: SubaccountOrder[];
  onViewOrdersClick: () => void;
};

export const TriggersForm = ({
  marketId,
  stopLossOrders,
  takeProfitOrders,
  onViewOrdersClick,
}: ElementProps) => {
  const stringGetter = useStringGetter();

  const { asset, entryPrice, stepSizeDecimals, tickSizeDecimals, oraclePrice } =
    useSelector(getPositionDetails(marketId)) || {};

  const { stopLossOrder, takeProfitOrder } = useSelector(getTriggerOrdersInputs, shallowEqual) || {};

  const symbol = asset?.id ?? '';

  const isDisabled = false; // TODO: CT-625 Update based on whether values are populated based on abacus
  const isEditingExistingTriggers = stopLossOrders.length > 0 || takeProfitOrders.length > 0;

  useEffect(() => {
    if (stopLossOrders.length == 1) {
      const {size, triggerPrice, price, type} = stopLossOrders[0];
      abacusStateManager.setTriggerOrdersValue({
        field: TriggerOrdersInputField.size,
        value: size
      })
      abacusStateManager.setTriggerOrdersValue({
        field: TriggerOrdersInputField.stopLossPrice,
        value: triggerPrice
      })
      abacusStateManager.setTriggerOrdersValue({
        field: TriggerOrdersInputField.stopLossLimitPrice,
        value: price
      })
      abacusStateManager.setTriggerOrdersValue({
        field: TriggerOrdersInputField.stopLossOrderType,
        value: type.rawValue
      })
      console.log("Xcxc size", size)
      // xcxc we don't set percent here, we calculate it in abacus based on stop loss limit and return it?
    }
    if (takeProfitOrders.length == 1) {
      const {size, triggerPrice, price, type} = takeProfitOrders[0];
      abacusStateManager.setTriggerOrdersValue({
        field: TriggerOrdersInputField.size,
        value: size
      })
      abacusStateManager.setTriggerOrdersValue({
        field: TriggerOrdersInputField.takeProfitPrice,
        value: triggerPrice
      })
      abacusStateManager.setTriggerOrdersValue({
        field: TriggerOrdersInputField.takeProfitLimitPrice,
        value: price
      })
      abacusStateManager.setTriggerOrdersValue({
        field: TriggerOrdersInputField.takeProfitOrderType,
        value: type.rawValue
      })
      console.log("Xcxc size", size)
      // xcxc we don't set percent here, we calculate it in abacus based on stop loss limit and return it?
    }
  }, []);

  // The triggers form does not support editing multiple stop loss or take profit orders - so if both have
  // multiple, we hide the triggers button CTA
  const existsEditableOrCreatableOrders = !(
    stopLossOrders.length > 1 && takeProfitOrders.length > 1
  );

  const priceInfo = (
    <Styled.PriceBox>
      <Styled.PriceRow>
        <Styled.PriceLabel>{stringGetter({ key: STRING_KEYS.AVG_ENTRY_PRICE })}</Styled.PriceLabel>
        <Styled.Price type={OutputType.Fiat} value={entryPrice?.current} />
      </Styled.PriceRow>
      <Styled.PriceRow>
        <Styled.PriceLabel>{stringGetter({ key: STRING_KEYS.ORACLE_PRICE })}</Styled.PriceLabel>
        <Styled.Price type={OutputType.Fiat} value={oraclePrice} />
      </Styled.PriceRow>
    </Styled.PriceBox>
  );

  return (
    <Styled.Form>
      {priceInfo}
      <TriggerOrderInputs
        symbol={symbol}
        tooltipId="take-profit"
        stringKeys={{
          header: STRING_KEYS.TAKE_PROFIT,
          price: STRING_KEYS.TP_PRICE,
          output: STRING_KEYS.GAIN,
        }}
        // orders={takeProfitOrders}
        tickSizeDecimals={tickSizeDecimals}
        onViewOrdersClick={onViewOrdersClick}
        isMultiple={takeProfitOrders.length > 1}
        price={takeProfitOrder?.price}
      />
      <TriggerOrderInputs
        symbol={symbol}
        tooltipId="stop-loss"
        stringKeys={{
          header: STRING_KEYS.STOP_LOSS,
          price: STRING_KEYS.SL_PRICE,
          output: STRING_KEYS.LOSS,
        }}
        // orders={stopLossOrders}
        tickSizeDecimals={tickSizeDecimals}
        onViewOrdersClick={onViewOrdersClick}
        isMultiple={stopLossOrders.length > 1}
        price={stopLossOrder?.price}
      />
      {existsEditableOrCreatableOrders && (
        <>
          <AdvancedTriggersOptions
            symbol={symbol}
            stopLossOrder={stopLossOrder} // xcxc can clean up
            takeProfitOrder={takeProfitOrder}
            stepSizeDecimals={stepSizeDecimals}
            tickSizeDecimals={tickSizeDecimals}
          />
          <Button action={ButtonAction.Primary} state={{ isDisabled }}>
            {isEditingExistingTriggers
              ? stringGetter({ key: STRING_KEYS.ENTER_TRIGGERS })
              : stringGetter({ key: STRING_KEYS.ADD_TRIGGERS })}
          </Button>
        </>
      )}
    </Styled.Form>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Form = styled.form`
  ${layoutMixins.column}
  gap: 1.25ch;
`;

Styled.PriceBox = styled.div`
  background-color: var(--color-layer-2);
  border-radius: 0.5em;
  font: var(--font-base-medium);

  display: grid;
  gap: 0.625em;
  padding: 0.625em 0.75em;
`;

Styled.PriceRow = styled.div`
  ${layoutMixins.spacedRow};
`;

Styled.PriceLabel = styled.h3`
  color: var(--color-text-0);
`;

Styled.Price = styled(Output)`
  color: var(--color-text-2);
`;

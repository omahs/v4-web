import { useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { AbacusOrderType, SubaccountOrder, TriggerOrdersInputField } from '@/constants/abacus';

import { getTriggerOrdersInputErrors } from '@/state/inputsSelectors';

import abacusStateManager from '@/lib/abacus';
import { isTruthy } from '@/lib/isTruthy';
import { isConditionalLimitOrderType } from '@/lib/orders';

export const useTriggerOrdersFormInputs = ({
  marketId,
  positionSize,
  stopLossOrder,
  takeProfitOrder,
}: {
  marketId: string;
  positionSize?: number;
  stopLossOrder?: SubaccountOrder;
  takeProfitOrder?: SubaccountOrder;
}) => {
  const inputErrors = useSelector(getTriggerOrdersInputErrors, shallowEqual);

  const [differingOrderSizes, setDifferingOrderSizes] = useState(false);
  const [inputSize, setInputSize] = useState(null);

  useEffect(() => {
    abacusStateManager.setTriggerOrdersValue({
      field: TriggerOrdersInputField.marketId,
      value: marketId,
    });
  }, [marketId]);

  useEffect(() => {
    // Initialize trigger order data on mount
    if (stopLossOrder) {
      [
        {
          field: TriggerOrdersInputField.stopLossOrderId,
          value: stopLossOrder.id,
        },
        {
          field: TriggerOrdersInputField.stopLossPrice,
          value: stopLossOrder.triggerPrice,
        },
        isConditionalLimitOrderType(stopLossOrder.type) && {
          field: TriggerOrdersInputField.stopLossLimitPrice,
          value: stopLossOrder.price,
        },
        {
          field: TriggerOrdersInputField.stopLossOrderType,
          value: stopLossOrder.type.rawValue,
        },
      ]
        .filter(isTruthy)
        .map(({ field, value }) => abacusStateManager.setTriggerOrdersValue({ field, value }));
    } else {
      abacusStateManager.setTriggerOrdersValue({
        field: TriggerOrdersInputField.stopLossOrderType,
        value: AbacusOrderType.stopMarket.rawValue,
      });
    }

    if (takeProfitOrder) {
      [
        {
          field: TriggerOrdersInputField.takeProfitOrderId,
          value: takeProfitOrder.id,
        },
        {
          field: TriggerOrdersInputField.takeProfitPrice,
          value: takeProfitOrder.triggerPrice,
        },
        isConditionalLimitOrderType(takeProfitOrder.type) && {
          field: TriggerOrdersInputField.takeProfitLimitPrice,
          value: takeProfitOrder.price,
        },
        {
          field: TriggerOrdersInputField.takeProfitOrderType,
          value: takeProfitOrder.type.rawValue,
        },
      ]
        .filter(isTruthy)
        .map(({ field, value }) => abacusStateManager.setTriggerOrdersValue({ field, value }));
    } else {
      abacusStateManager.setTriggerOrdersValue({
        field: TriggerOrdersInputField.takeProfitOrderType,
        value: AbacusOrderType.takeProfitMarket.rawValue,
      });
    }

    const setSize = (size?: number) => {
      const absSize = size ? Math.abs(size) : null;
      setInputSize(absSize);
      abacusStateManager.setTriggerOrdersValue({
        field: TriggerOrdersInputField.size,
        value: absSize,
      });
    };

    if (stopLossOrder?.size && takeProfitOrder?.size) {
      // Assumption that we hide the size slider when the orders differ in size
      if (stopLossOrder?.size === takeProfitOrder?.size) {
        setSize(stopLossOrder?.size);
      } else {
        setSize(undefined);
        setDifferingOrderSizes(true);
      }
    } else if (stopLossOrder?.size) {
      setSize(stopLossOrder?.size);
    } else if (takeProfitOrder?.size) {
      setSize(takeProfitOrder?.size);
    } else {
      // Default to full position size
      setSize(positionSize);
    }
  }, []);

  return {
    inputErrors,
    isEditingExistingOrder: stopLossOrder || takeProfitOrder,
    differingOrderSizes,
    inputSize,
  };
};

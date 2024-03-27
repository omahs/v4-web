import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import assign from 'lodash/assign';

import type {
  InputError,
  Inputs,
  Nullable,
  TradeInputs,
  ClosePositionInputs,
  TransferInputs,
  TriggerOrdersInputs,
} from '@/constants/abacus';
import { CLEARED_SIZE_INPUTS, CLEARED_TRADE_INPUTS } from '@/constants/trade';

export const CLEARED_TRIGGERS_FORM_INPUTS = {
  size: '',
};

type TradeFormInputs = typeof CLEARED_TRADE_INPUTS & typeof CLEARED_SIZE_INPUTS;
type TriggersFormInputs = typeof CLEARED_TRIGGERS_FORM_INPUTS;

export interface InputsState {
  current?: Nullable<string>;
  inputErrors?: Nullable<InputError[]>;
  tradeFormInputs: TradeFormInputs;
  tradeInputs?: Nullable<TradeInputs>;
  closePositionInputs?: Nullable<ClosePositionInputs>;
  triggersFormInputs: TriggersFormInputs;
  triggerOrdersInputs?: Nullable<TriggerOrdersInputs>;
  transferInputs?: Nullable<TransferInputs>;
}

const initialState: InputsState = {
  current: undefined,
  inputErrors: undefined,
  tradeFormInputs: {
    ...CLEARED_TRADE_INPUTS,
    ...CLEARED_SIZE_INPUTS,
  },
  tradeInputs: undefined,
  transferInputs: undefined,
  triggersFormInputs: {
    ...CLEARED_TRIGGERS_FORM_INPUTS,
  },
  triggerOrdersInputs: undefined,
};

export const inputsSlice = createSlice({
  name: 'Inputs',
  initialState,
  reducers: {
    setInputs: (state, action: PayloadAction<Nullable<Inputs>>) => {
      const { current, errors, trade, closePosition, transfer, triggerOrders } =
        action.payload || {};

      return {
        ...state,
        current: current?.rawValue,
        inputErrors: errors?.toArray(),
        tradeInputs: trade,
        triggerOrdersInputs: triggerOrders,
        closePositionInputs: closePosition,
        transferInputs: {
          ...transfer,
          isCctp: !!transfer?.isCctp,
        } as Nullable<TransferInputs>,
      };
    },

    setTradeFormInputs: (state, action: PayloadAction<Partial<TradeFormInputs>>) => {
      state.tradeFormInputs = assign({}, state.tradeFormInputs, action.payload);
    },

    setTriggersFormInputs: (state, action: PayloadAction<Partial<TriggersFormInputs>>) => {
      state.triggersFormInputs = assign({}, state.triggersFormInputs, action.payload);
    },
  },
});

export const { setInputs, setTradeFormInputs, setTriggersFormInputs } = inputsSlice.actions;

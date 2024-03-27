import { useCallback, useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';
import styled, { AnyStyledComponent } from 'styled-components';

import { TriggerOrdersInputField } from '@/constants/abacus';
import { STRING_KEYS } from '@/constants/localization';
import { TOKEN_DECIMALS } from '@/constants/numbers';

import { useStringGetter } from '@/hooks';

import { Checkbox } from '@/components/Checkbox';
import { Collapsible } from '@/components/Collapsible';
import { FormInput } from '@/components/FormInput';
import { InputType } from '@/components/Input';
import { Tag } from '@/components/Tag';
import { WithTooltip } from '@/components/WithTooltip';

import { getTriggerOrdersInputs } from '@/state/inputsSelectors';

import abacusStateManager from '@/lib/abacus';
import { MustBigNumber } from '@/lib/numbers';

import { OrderSizeSlider } from './OrderSizeSlider';

type ElementProps = {
  symbol: string;
  size?: number;
  positionSize?: number;
  stepSizeDecimals?: number;
};

type StyleProps = {
  className?: string;
};

export const OrderSizeInput = ({
  symbol,
  size,
  positionSize,
  stepSizeDecimals,
  className,
}: ElementProps & StyleProps) => {
  const stringGetter = useStringGetter();

  const [orderSize, setOrderSize] = useState(size);
  const [shouldShowCustomAmount, setShouldShowCustomAmount] = useState(false);

  useEffect(() => {
    setOrderSize(size);
    setShouldShowCustomAmount(size && size != positionSize);
  }, [size]);

  const onSizeInput = ({ floatValue }: { floatValue?: number }) => {
    if (floatValue && positionSize) {
      setOrderSize(Math.min(floatValue, positionSize));

      abacusStateManager.setTriggerOrdersValue({
        value: Math.min(floatValue, positionSize),
        field: TriggerOrdersInputField.size,
      });  
    }
  };

  const onCheckedChange = (newChecked: boolean) => {
    if (!newChecked || !size) {
      abacusStateManager.setTriggerOrdersValue({
        value: positionSize,
        field: TriggerOrdersInputField.size,
      });
    }
    setShouldShowCustomAmount(newChecked);
  };

  const setOrderSizeInput = (newSize: string) => {
    const newSizeBN = MustBigNumber(newSize);
    setOrderSize(newSizeBN.toNumber());
  };

  return (
    <Collapsible
      slotTrigger={<Checkbox checked={shouldShowCustomAmount} onCheckedChange={onCheckedChange} />}
      open={shouldShowCustomAmount}
      label={
        <WithTooltip tooltip="custom-amount">
          {stringGetter({ key: STRING_KEYS.CUSTOM_AMOUNT })}
        </WithTooltip>
      }
    >
      <Styled.SizeInputRow>
        <Styled.OrderSizeSlider
          className={className}
          size={orderSize}
          positionSize={positionSize}
          setOrderSizeInput={setOrderSizeInput}
        />
        <FormInput
          type={InputType.Number}
          value={orderSize?.toFixed(stepSizeDecimals || TOKEN_DECIMALS)}
          slotRight={<Tag>{symbol}</Tag>}
          onInput={onSizeInput}
        />
      </Styled.SizeInputRow>
    </Collapsible>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.OrderSizeSlider = styled(OrderSizeSlider)`
  width: 100%;
`;

Styled.SizeInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

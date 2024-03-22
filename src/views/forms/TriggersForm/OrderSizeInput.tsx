import { useEffect, useState } from 'react';

import styled, { AnyStyledComponent } from 'styled-components';

import { STRING_KEYS } from '@/constants/localization';

import { useStringGetter } from '@/hooks';

import { TriggerOrder } from '@/constants/abacus';

import { Checkbox } from '@/components/Checkbox';
import { Collapsible } from '@/components/Collapsible';
import { FormInput } from '@/components/FormInput';
import { InputType } from '@/components/Input';
import { Tag } from '@/components/Tag';
import { WithTooltip } from '@/components/WithTooltip';

import { OrderSizeSlider } from './OrderSizeSlider';

type ElementProps = {
  symbol: string;
  stopLossOrder?: TriggerOrder;
  takeProfitOrder?: TriggerOrder;
  stepSizeDecimals?: number;
};

type StyleProps = {
  className?: string;
};

export const OrderSizeInput = ({
  symbol,
  stopLossOrder,
  takeProfitOrder,
  stepSizeDecimals,
  className,
}: ElementProps & StyleProps) => {
  const stringGetter = useStringGetter();

  const [shouldShowCustomAmount, setShouldShowCustomAmount] = useState(false);

  useEffect(() => {
    const notFullAmount = false;
    setShouldShowCustomAmount(notFullAmount);
  }, [
    stopLossOrder, takeProfitOrder
  ]) // xcxc this might break if you're updating the order type
  return (
    <Collapsible
      slotTrigger={
        <Checkbox checked={shouldShowCustomAmount} onCheckedChange={setShouldShowCustomAmount} />
      }
      open={shouldShowCustomAmount}
      label={
        <WithTooltip tooltip="custom-amount">
          {stringGetter({ key: STRING_KEYS.CUSTOM_AMOUNT })}
        </WithTooltip>
      }
    >
      {/* TODO: CT-625 Update with values from abacus */}
      <Styled.SizeInputRow>
        <Styled.OrderSizeSlider className={className} stepSizeDecimals={stepSizeDecimals} />
        <FormInput type={InputType.Number} slotRight={<Tag>{symbol}</Tag>} />
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

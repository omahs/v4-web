import { useCallback } from 'react';

import _ from 'lodash';
import styled, { AnyStyledComponent } from 'styled-components';

import { TriggerOrdersInputField } from '@/constants/abacus';

import { Slider } from '@/components/Slider';

import abacusStateManager from '@/lib/abacus';
import { BigNumberish, MustBigNumber } from '@/lib/numbers';

type ElementProps = {
  size?: BigNumberish | null;
  positionSize?: number;
  setOrderSizeInput: (value: string) => void;
};

type StyleProps = {
  className?: string;
};

export const OrderSizeSlider = ({
  size,
  positionSize,
  setOrderSizeInput,
  className,
}: ElementProps & StyleProps) => {
  const sizeBN = MustBigNumber(size);
  const sizeNumber = isNaN(sizeBN.toNumber()) ? 0 : sizeBN.toNumber();
  const maxSizeBN = MustBigNumber(positionSize);
  const maxSizeNumber = isNaN(maxSizeBN.toNumber()) ? 0 : maxSizeBN.toNumber();

  const step = positionSize ? Math.pow(10, Math.floor(Math.log10(positionSize) - 1)) : 0.1;

  // Debounced slightly to avoid excessive updates to Abacus while still providing a smooth slide
  const debouncedSetAbacusSize = useCallback(
    _.debounce((newSize: number) => {
      abacusStateManager.setTriggerOrdersValue({
        value: newSize,
        field: TriggerOrdersInputField.size,
      });
    }, 50),
    []
  );

  const onSliderDrag = ([newSize]: number[]) => {
    setOrderSizeInput(`${newSize}`);
    debouncedSetAbacusSize(newSize);
  };

  const onValueCommit = ([newSize]: number[]) => {
    setOrderSizeInput(`${newSize}`);

    // Ensure Abacus is updated with the latest, committed value
    debouncedSetAbacusSize.cancel();

    abacusStateManager.setTriggerOrdersValue({
      value: newSize,
      field: TriggerOrdersInputField.size,
    });
  };

  return (
    <Styled.SliderContainer className={className}>
      <Styled.Slider
        label="PositionSize"
        min={0}
        max={positionSize}
        step={step}
        value={Math.min(sizeNumber, maxSizeNumber)}
        onSliderDrag={onSliderDrag}
        onValueCommit={onValueCommit}
      />
    </Styled.SliderContainer>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.SliderContainer = styled.div`
  height: 1.375rem;
`;
Styled.Slider = styled(Slider)`
  --slider-track-backgroundColor: var(--color-layer-4);
  --slider-track-background: linear-gradient(
    90deg,
    var(--color-layer-6) 0%,
    var(--color-text-0) 100%
  );
`;

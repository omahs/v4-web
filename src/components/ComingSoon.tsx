import styled, { type AnyStyledComponent } from 'styled-components';

import { STRING_KEYS } from '@/constants/localization';

import { useStringGetter } from '@/hooks';

import { layoutMixins } from '@/styles/layoutMixins';

export const ComingSoon = () => {
  const stringGetter = useStringGetter();
  return <h1>{stringGetter({ key: STRING_KEYS.COMING_SOON })}</h1>;
};

export const ComingSoonSpace = () => (
  <$FullPageContainer>
    <ComingSoon />
  </$FullPageContainer>
);
const $FullPageContainer = styled.div`
  ${layoutMixins.centered}

  h1 {
    padding-bottom: 2rem;
  }
`;

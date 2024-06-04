import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import HeaderLeft from '../../utils/HeaderLeft';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: jest.fn(),
    }),
  };
});

test('HeaderLeft component should render and handle press correctly', () => {
  const { getByTestId } = render(
    <NavigationContainer>
      <HeaderLeft colors="black" />
    </NavigationContainer>
  );

  const headerLeft = getByTestId('header-left');

  fireEvent.press(headerLeft);

  expect(headerLeft).toBeTruthy();
});

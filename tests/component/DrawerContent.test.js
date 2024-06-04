import React from 'react';
import { render } from '@testing-library/react-native';
import DrawerContent from '../../components/DrawerContent';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ErrorBoundary from "../ErrorBoundary";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerActions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const mockStore = configureStore([]);
const store = mockStore({
  user: {
    token: null,
    user: {},
  },
});

const mockNavigation = {
  dispatch: jest.fn(),
  navigate: jest.fn(),
  closeDrawer: jest.fn(),
};

const mockState = {
  index: 0,
  routes: [],
};

describe('DrawerContent', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <SafeAreaProvider>
        <ErrorBoundary>
          <NavigationContainer>
            <Provider store={store} >
              <DrawerContent navigation={mockNavigation} state={mockState} />
            </Provider>
          </NavigationContainer>
        </ErrorBoundary>
      </SafeAreaProvider>
    );

    expect(getByTestId("menu")).toBeTruthy();
  });
});

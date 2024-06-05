import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Profil from '../../screens/newScreen/profil';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; 
import ErrorBoundary from "../ErrorBoundary"

const mockStore = configureStore([]);
const store = mockStore({
  user: {
    token: 'yourTokenHere',
    user: {},
  },
  incidents: [], 
  challenges: [], 
});

describe('Profil Component', () => {
  it('renders correctly', async () => {
    const { getByText } = render(
        <ErrorBoundary>
            <Provider store={store}>
                <Profil />
            </Provider>
        </ErrorBoundary>

    );
    await waitFor(() => {
      expect(getByText('Modifier votre profil')).toBeTruthy();
    });
  });

});

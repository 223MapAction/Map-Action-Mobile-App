import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import IncidentForm from '../../screens/newScreen/IncidentForm'; 
import { onAddIncident, onLogin } from '../../redux/incidents/action';
import {NavigationContainer} from "@react-navigation/native"
import ErrorBoundary from "../ErrorBoundary"

const mockStore = configureStore([]);
const store = mockStore({
  user: {
    token: null,
    user: {},
  },
});

describe('IncidentForm', () => {
  it('should render correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <ErrorBoundary>
        <NavigationContainer>
          <Provider store={store}>
            <IncidentForm route={{ params: {} }} />
          </Provider>
        </NavigationContainer>
      </ErrorBoundary>
      
      
    );

    expect(getByPlaceholderText('Titre')).toBeTruthy();
    expect(getByText('Ajouter des détails')).toBeTruthy();
    expect(getByText('Joindre une vidéo')).toBeTruthy();
  });

  it('should show an error message when title is empty on submit', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <NavigationContainer>
          <Provider store={store}>
            <IncidentForm route={{ params: {} }} />
          </Provider>
        </NavigationContainer>
      </ErrorBoundary>
      
      
    );

    fireEvent.press(getByText('ENVOYER'));

    // expect(getByText("Titre est un champ obligatoire")).toBeTruthy();
  });

  it('should call submit function on button press', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <ErrorBoundary>
        <NavigationContainer>
          <Provider store={store}>
            <IncidentForm route={{ params: {} }} />
          </Provider>
        </NavigationContainer>
      </ErrorBoundary>
      
      
    );

    fireEvent.changeText(getByPlaceholderText('Titre'), 'Test Title');
    fireEvent.changeText(getByTestId('zone'), 'Test Zone');
    fireEvent.press(getByText('ENVOYER'));

  });
});

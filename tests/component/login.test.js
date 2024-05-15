import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../../screens/login';

describe('Login component', () => {
    test('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render( < Login / > );

        expect(getByPlaceholderText('Adresse mail du citoyen')).toBeTruthy();
        expect(getByPlaceholderText('mot de passe')).toBeTruthy();
        expect(getByText('Se connecter')).toBeTruthy();
        expect(getByText('Mot de passe oublié')).toBeTruthy();
        expect(getByText('Pas encore de compte ?')).toBeTruthy();
        expect(getByText('S’inscrire')).toBeTruthy();
    });

    test('submits form with valid input', async() => {
        const { getByPlaceholderText, getByText } = render( < Login / > );

        fireEvent.changeText(getByPlaceholderText('Adresse mail du citoyen'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('mot de passe'), 'password');
        fireEvent.press(getByText('Se connecter'));

        await waitFor(() => {
            expect(getByText('Connexion réussie')).toBeTruthy();
            expect(getByText('OK')).toBeTruthy();
        });
    });

    test('shows error with invalid input', async() => {
        const { getByPlaceholderText, getByText } = render( < Login / > );

        fireEvent.changeText(getByPlaceholderText('Adresse mail du citoyen'), 'invalidemail');
        fireEvent.changeText(getByPlaceholderText('mot de passe'), '');
        fireEvent.press(getByText('Se connecter'));

        await waitFor(() => {
            expect(getByText('Adresse Mail')).toBeTruthy(); // Assuming this is how you display the error message for email
            expect(getByText('Mot de passe')).toBeTruthy(); // Assuming this is how you display the error message for password
        });
    });
});
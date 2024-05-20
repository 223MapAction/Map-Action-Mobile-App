import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { act } from 'react-test-renderer'; // Import act from react-test-renderer
import Logout from '../../screens/Logout';

// Mocking the redux action
jest.mock('../../redux/user/action', () => ({
    onLogout: jest.fn(),
}));

// Mocking the AsyncStorage for Storage
jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(() => Promise.resolve()),
        setItem: jest.fn(() => Promise.resolve()),
        removeItem: jest.fn(() => Promise.resolve()),
    },
}));

describe('Logout component', () => {
    test('renders ActivityIndicator while logging out', async() => {
        await act(async() => {
            render( < Logout / > );
        });

        // Assert that ActivityIndicator is present
        expect(screen.getByTestId('activity-indicator')).toBeTruthy();
    });
});
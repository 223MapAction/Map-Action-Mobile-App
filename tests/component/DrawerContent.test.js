import React from 'react';
import { render } from '@testing-library/react-native';
import {
    DrawerContent
} from '../../components/DrawerContent';
import { NavigationContext } from '@react-navigation/native';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

const navigationMock = {
    navigate: mockNavigate,
    dispatch: mockDispatch,
};

describe('DrawerContent', () => {
    it('renders correctly', () => {
        const { getByText } = render( < NavigationContext.Provider value = { navigationMock } >
            <
            DrawerContent navigation = { navigationMock }
            state = {
                { index: 0 }
            }
            /> < /
            NavigationContext.Provider >
        );

        expect(getByText('Menu')).toBeTruthy();
    });
});
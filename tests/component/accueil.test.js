import { React } from 'react';
import { render } from '@testing-library/react-native';
import Accueil from '../../screens/accueil';
describe('Accueil Component', () => {
        it('renders correctly', () => {
                const { getByText, getByTestId } = render( 
                        < Accueil navigation = {
                                { replace: jest.fn(), push: jest.fn() }
                                }
                        />);
                        expect(getByText('SUIVANT')).toBeTruthy();
                        expect(getByTestId('dot-style').props.style).toMatchObject({ backgroundColor: '#eee' });
                });
        });
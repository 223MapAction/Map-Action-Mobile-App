import { React } from 'react';
import { render } from '@testing-library/react-native';
import { Accueil } from '../../screens/accueil'; // Adjust the import path as needed

describe('Accueil Component', () => {
            it('renders correctly', () => {
                    const { getByText, getByTestId } = render( < Accueil navigation = {
                            { replace: jest.fn(), push: jest.fn() }
                        }
                        />);

                        // Check if the "SUIVANT" button is rendered
                        expect(getByText('SUIVANT')).toBeTruthy();

                        // Check for initial dot style, could be specific to your initial render state
                        expect(getByTestId('dot-style').props.style).toMatchObject({ backgroundColor: '#eee' });
                    });
            });
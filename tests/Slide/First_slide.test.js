import React from 'react';
import { render } from '@testing-library/react-native';
import Slide1 from '../../screens/slides/Slide1';

describe('Slide1 Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Slide1 />);
    expect(getByText('Déclarer un incident')).toBeTruthy();
    expect(getByText('Participer efficacement à l’assainissement')).toBeTruthy();
  });
});

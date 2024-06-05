import React from 'react';
import { render } from '@testing-library/react-native';
import Slide3 from '../../screens/slides/Slide3';

describe('Slide3 Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Slide3 />);
    expect(getByText('Faites du bien')).toBeTruthy();
    expect(getByText('Plus vous reportez des incidents')).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import Slide2 from '../../screens/slides/Slide2';

describe('Slide2 Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Slide2 />);
    expect(getByText('Impactez positivement')).toBeTruthy();
    expect(getByText('Créez des challenges afin')).toBeTruthy();
  });
});

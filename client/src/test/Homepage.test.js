import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Homepage from '../containers/Homepage';
import MetricSection from '../containers/MetricSection';
import 'jest-enzyme';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


describe('<Homepage />', () => {
    it('renders three <MetricSection /> components', () => {
        const wrapper = shallow(<Homepage />);
        expect(wrapper.find(MetricSection)).to.have.length(7);
    });

});
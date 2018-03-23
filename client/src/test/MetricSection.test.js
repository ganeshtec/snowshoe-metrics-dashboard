import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import Homepage from '../components/Homepage';
import MetricSection from '../components/MetricSection';
import Metric from '../components/Metric';
import 'jest-enzyme';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


describe('<MetricSection />', () => {

    var mockMethod = () => {
        return ({
            metrics: [
                {
                    description: "Test",
                    count: 100
                },
                {
                    description: "Test2",
                    count: 300
                },
                {
                    description: "Test3",
                    count: 300
                }
            ]
        }
        )
    }
    var source = {
        name: "TEST source",
        method: () => mockMethod()
    }

    it('Loads a Metric Section', () => {
        const wrapper = shallow(<MetricSection source={source} />);
        expect(wrapper.find(".sectionHeader")).to.have.length(1);
        expect(wrapper.find('.sectionHeader').text()).equal('TEST source');
    });

    it('dynamically renders proper amount of metrics', () => {
        sinon.spy(MetricSection.prototype, 'componentWillMount');
        const wrapper = mount(<MetricSection source={source} />);
        expect(MetricSection.prototype.componentWillMount.calledOnce).to.equal(true);
    });
});
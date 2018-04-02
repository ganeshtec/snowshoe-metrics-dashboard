import React from 'react';
import {expect} from 'chai';
import Enzyme, {mount, shallow} from 'enzyme';
import sinon from 'sinon';
import MetricSection from '../containers/MetricSection';
import 'jest-enzyme';
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
        expect(wrapper.find("#headerName")).to.have.length(1);
        expect(wrapper.find('#headerName').text()).equal('TEST source');
    });

    it('dynamically renders proper amount of metrics', () => {
        sinon.spy(MetricSection.prototype, 'componentWillMount');
        const wrapper = mount(<MetricSection source={source} />);
        expect(MetricSection.prototype.componentWillMount.calledOnce).to.equal(true);
    });
});
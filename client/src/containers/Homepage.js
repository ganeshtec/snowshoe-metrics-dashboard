import React, {Component} from 'react';
import '../css/homepage.css';
import {getActivePromotions, getMarkDownServiceMetrics, getCircuitBreakerServiceMetrics} from '../service/apiService';
import MetricSection from './MetricSection';

class Homepage extends Component {

    state = {
        fetchDataMethods: [
            {
                name: "Active Promotions",
                needsDateRange: false,
                method: () => getActivePromotions()
            },
            {
                name: "Markdown Service V2",
                needsDateRange: true,
                method: (startDate, endDate) => getMarkDownServiceMetrics(startDate, endDate)
            },
            {
                name: "Circuit Breaker",
                needsDateRange: false,
                method: () => getCircuitBreakerServiceMetrics()
            }
        ]
    };

    render() {
        const metricsSection = this.state.fetchDataMethods.map((source, index) => {
            return (<MetricSection key={index} source={source}/>)
        })
        return (
            <div className="homePage">
                {metricsSection}
            </div>
        )
    }
}

export default Homepage;
import React, {Component} from 'react';
import '../css/homepage.css';
import {getActivePromotions, getMarkDownServiceMetrics, getCircuitBreakerServiceMetrics} from '../service/apiService';
import MetricSection from './MetricSection';

class Homepage extends Component {

    state = {
        fetchDataMethods: [
            {
                name: "Active Promotions",
                startingTomorrowSubHeader: "Starting Tomorrow",
                futurePromotionsSubHeader: "Future Promotions",
                needsDateRange: false,
                method: () => getActivePromotions()
            },
            {
                name: "Circuit Breaker",
                needsDateRange: true,
                method: (startDate, endDate) => getCircuitBreakerServiceMetrics(startDate, endDate)
            },
            {
                name: "Markdown Service V2",
                needsDateRange: true,
                method: (startDate, endDate) => getMarkDownServiceMetrics(startDate, endDate)
            }
        ]
    };

    render() {
        const metricsSection = this.state.fetchDataMethods.map((source, index) => {
            console.log(source, '*****', index);
            return (<MetricSection key={index} source={source} index={index}/>)
        });
        return (
            <div className="homePage">
                {metricsSection}
            </div>
        );
    }
}

export default Homepage;
import React, {Component} from 'react';
import '../css/homepage.css';
import {getActivePromotions, getMarkDownServiceMetrics, getCircuitBreakerServiceMetrics} from '../service/apiService';
import MetricSection from './MetricSection';
import GridSection from './GridSection';

class Homepage extends Component {

    state = {
        fetchDataMethods: [
            {
                name: "Promotion Breakdown",
                today: "Today",
                tomorrow: "Starting Tomorrow",
                future: "Future Promotions",
                isGrid: true,
                needsDateRange: false,
                method: () => getActivePromotions()
            },
            {
                name: "Circuit Breaker",
                needsDateRange: true,
                isGrid: false,
                method: (startDate, endDate) => getCircuitBreakerServiceMetrics(startDate, endDate)
            },
            {
                name: "Markdown Service V2",
                needsDateRange: true,
                isGrid: false,
                method: (startDate, endDate) => getMarkDownServiceMetrics(startDate, endDate)
            }
        ]
    };

    render() {
        const metricsSection = this.state.fetchDataMethods.map((source, index) => {
            if(source.isGrid){
                return  (<GridSection key={index} source={source} index={index} />)
            } else {
                return  (<MetricSection key={index} source={source} index={index}/>)
            }
        });
        return (
            <div className="homePage">
                {metricsSection}
            </div>
        );
    }
}

export default Homepage;
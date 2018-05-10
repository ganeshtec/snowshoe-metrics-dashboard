import React, {Component} from 'react';
import '../css/homepage.css';
import * as apiService from '../service/apiService';
import MetricSection from './MetricSection';
import GridSection from './GridSection';

class Homepage extends Component {

    state = {
        fetchDataMethods: [
            {
                name: "Promotion Breakdown",
                subHeader: {
                    today: "Today",
                    tomorrow: "Starting Tomorrow",
                    future: "Future Promotions",
                },
                isGrid: true,
                needsDateRange: false,
                method: () => apiService.getActivePromotions()
            }, {
                name: "Qualifiers",
                needsDateRange: false,
                isGrid: false,
                method: () => apiService.getQualifiersForActivePromotions()
            },
            {
                name: "Rewards",
                needsDateRange: false,
                isGrid: false,
                method: () => apiService.getRewardsForActivePromotions()
            },
            {
                name: "Attributes",
                needsDateRange: false,
                isGrid: false,
                method: () => apiService.getAttributesForActivePromotions()
            },{
                name: "Circuit Breaker",
                needsDateRange: true,
                isGrid: false,
                method: (startDate, endDate) => apiService.getCircuitBreakerServiceMetrics(startDate, endDate)
            }, {
                name: "Markdown Service V2",
                needsDateRange: true,
                isGrid: false,
                method: (startDate, endDate) => apiService.getMarkDownServiceMetrics(startDate, endDate)
            }, {
                name: "Pro Bid Room",
                needsDateRange: true,
                isGrid: false,
                method: (startDate, endDate) => apiService.getProBidRoomServiceMetrics(startDate, endDate)
            }, {
                name: "Sonar Code Coverage",
                needsDateRange: false,
                isGrid: false,
                method: () => apiService.getSonarCodeCoverageMetrics()
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
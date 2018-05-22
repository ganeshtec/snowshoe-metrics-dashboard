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
                subHeader: ["Today", "Starting Tomorrow", "Future Promotions"],
                isGrid: true,
                needsDateRange: false,
                fetchOnLoad: true,
                method: () => apiService.getActivePromotions()
            }, {
                name: "Qualifiers",
                needsDateRange: false,
                isGrid: false,
                fetchOnLoad: true,
                method: () => apiService.getQualifiersForActivePromotions()
            },
            {
                name: "Rewards",
                needsDateRange: false,
                isGrid: false,
                fetchOnLoad: true,
                method: () => apiService.getRewardsForActivePromotions()
            },
            {
                name: "Attributes",
                needsDateRange: false,
                isGrid: false,
                fetchOnLoad: true,
                method: () => apiService.getAttributesForActivePromotions()
            },
            {
                name: "Creators",
                needsDateRange: false,
                subHeader: ["Role", "Count"],
                isGrid: true,
                fetchOnLoad: true,
                method: () => apiService.getCreatorsForActivePromotions()
            },
            {
                name: "Circuit Breaker",
                needsDateRange: true,
                isGrid: false,
                fetchOnLoad: true,
                method: (startDate, endDate) => apiService.getCircuitBreakerServiceMetrics(startDate, endDate)
            }, {
                name: "Markdown Service V2",
                needsDateRange: true,
                isGrid: false,
                fetchOnLoad: true,
                method: (startDate, endDate) => apiService.getMarkDownServiceMetrics(startDate, endDate)
            }, {
                name: "Pro Bid Room",
                needsDateRange: true,
                isGrid: false,
                fetchOnLoad: true,
                method: (startDate, endDate) => apiService.getProBidRoomServiceMetrics(startDate, endDate)
            }, {
                name: "Promotion Domain Service",
                needsDateRange: true,
                isGrid: false,
                fetchOnLoad: false,
                method: (startDate, endDate) => apiService.getPromotionDomainServiceMetrics(startDate, endDate)
            }, {
                name: "Sonar Code Coverage",
                needsDateRange: false,
                isGrid: false,
                fetchOnLoad: true,
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
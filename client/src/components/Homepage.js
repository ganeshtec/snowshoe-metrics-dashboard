import React, { Component } from 'react';
import '../css/homepage.css';
import { getActivePromotions, getMarkDownServiceMetrics } from '../service/apiService';
import MetricSection from './MetricSection';

class Homepage extends Component {

    state = {
        fetchDataMethods: [
            {
                name: "Active Promotions",
                method: getActivePromotions()
            },
            {
                name: "Markdown Service V2",
                method: getMarkDownServiceMetrics()
            }
        ]
    }


    render() {
        const metricsSection = this.state.fetchDataMethods.map((source, index) => {
            return (<MetricSection key={index} source={source} />)
        })
        return (
            <div className="homePage">
                {metricsSection}
            </div>
        )
    }
}

export default Homepage;
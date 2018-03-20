import React, { Component } from 'react';
import '../css/homepage.css';
import axios from 'axios';


class MetricSection extends Component {
    render() {

        //iterate through state metrics to show as many of the metrics as express gave us
        var sectionResults = this.props.section.data.map((metric, index) => {
            return (
                <div className='row' key={index} ><span className='col col1'>{metric.description}</span><span className ='col'>{metric.count}</span></div>
            )
        })

        return (
            <div className="MetricSection">
                <h2 className='sectionHeader'>{this.props.section.name}</h2>
                <div>
                    {sectionResults}
                </div>

            </div>
        )
    }
}

export default MetricSection;
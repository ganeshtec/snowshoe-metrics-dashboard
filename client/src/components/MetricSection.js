import React, { Component } from 'react';
import '../css/homepage.css';

class MetricSection extends Component {

    state = {
        data: {
            metrics: []
        },
        fetchDataStatus: "loading"
    }

    async componentWillMount() {
        var response = await this.props.source.method
        if (response === "Error") {
            this.setState({ fetchDataStatus: "error" })
        } else {
            this.setState({ fetchDataStatus: "loaded", data: response })
        }
    }
    render() {

        var sectionResults;
        if (this.state.fetchDataStatus === "loading") {
            sectionResults = (
                <div className="col">
                    Loading data for {this.props.source.name}...
                <div className="progress-circular indeterminate md">
                        <div className="stroke">
                            <div className="stroke-left"></div>
                            <div className="stroke-right"></div>
                        </div>
                    </div>
                </div>)
        }
        else if (this.state.fetchDataStatus === "error") {
            sectionResults = "Error fetching data"
        } else {
            sectionResults = this.state.data.metrics.map((metric, index) => {
                return (
                    <div className='row' key={index} ><span className='col col1'>{metric.description}</span><span className='col'>{metric.count}</span></div>
                )
            })
        }


        return (
            <div className="MetricSection">
                <h2 className='sectionHeader'>{this.props.source.name}</h2>
                <div>
                    {sectionResults}
                </div>

            </div>
        )
    }
}

export default MetricSection;
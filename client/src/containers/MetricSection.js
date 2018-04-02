import React, { Component } from 'react';
import '../css/homepage.css';
import moment from 'moment'

import Metric from '../components/Metric'
import DateSelection from '../components/DateSelection'


class MetricSection extends Component {

    state = {
        data: {
            metrics: []
        },
        dateRange: {
            startDate: '',
            endDate: ''
        },
        fetchDataStatus: "loading"
    }

    async componentWillMount() {
        var todaysDate = moment().format("YYYY-MM-DD");
        await this.updateDates(todaysDate, todaysDate)
        await this.fetchData()
    }

    updateDates = (startDate, endDate) => {
        startDate = startDate === null ? this.state.dateRange.startDate : startDate;
        endDate = endDate === null ? this.state.dateRange.endDate : endDate;

        this.setState({
            dateRange: {
                startDate: startDate,
                endDate: endDate
            }
        })
    }

    fetchData = async () => {
        if (this.state.fetchDataStatus !== "loading") {
            this.setState({ fetchDataStatus: "loading" })
        }
        var response;
        if (this.props.source.needsDateRange) {
            response = await this.props.source.method(this.state.dateRange.startDate, this.state.dateRange.endDate)
        } else {
            response = await this.props.source.method()
        }

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
                    <Metric metric={metric} key={index} />
                )
            })
        }
        return (
            <div className="MetricSection">
                <table id="headerBack">
                    <tbody>
                        <tr>
                            <td id="headerName">{this.props.source.name}</td>
                            <td>{this.props.source.needsDateRange ? <DateSelection loading={this.state.fetchDataStatus === "loading"} 
                                                                                   dateRange={this.state.dateRange} 
                                                                                   updateDates={this.updateDates} fetchData={this.fetchData} /> : null}</td>
                        </tr>
                    </tbody>
                </table>
                <div className='sectionResults'>
                    {sectionResults}
                </div>
            </div>
        )
    }
}

export default MetricSection;
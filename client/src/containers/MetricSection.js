import React, { Component } from 'react';
import '../css/homepage.css';
import moment from 'moment'

import Metric from '../components/Metric'
import DateSelection from '../components/DateSelection'
import Spinner from "../components/Spinner";


class MetricSection extends Component {

    state = {
        data: {
            metrics: []
        },
        dateRange: {
            startDate: '',
            endDate: ''
        },
        fetchDataStatus: null
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
    };

    fetchData = async () => {
        let response;

        if (this.state.fetchDataStatus) {
            this.setState({ fetchDataStatus: null })
        }
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
    };

    render() {

        let sectionResults;
        if (this.state.fetchDataStatus === null) {
            sectionResults = <Spinner name={this.props.source.name}/>
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
                            <td>{this.props.source.needsDateRange ? <DateSelection loading={this.state.fetchDataStatus === null}
                                dateRange={this.state.dateRange}
                                updateDates={this.updateDates}
                                fetchData={this.fetchData}
                                index={this.props.index}
                                /> : null}</td>
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
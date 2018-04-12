import React, {Component} from 'react';
import '../css/homepage.css';
import moment from 'moment'


class GridSection extends Component {
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
    };

    fetchData = async () => {
        if (this.state.fetchDataStatus !== "loading") {
            this.setState({fetchDataStatus: "loading"})
        }
        var response;
        if (this.props.source.needsDateRange) {
            response = await this.props.source.method(this.state.dateRange.startDate, this.state.dateRange.endDate)
        } else {
            response = await this.props.source.method()
        }

        if (response === "Error") {
            this.setState({fetchDataStatus: "error"})
        } else {
            this.setState({fetchDataStatus: "loaded", data: response})
        }
    };

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
                </div>
            );
        }
        else if (this.state.fetchDataStatus === "error") {
            sectionResults = "Error fetching data"
        } else {
            sectionResults = this.state.data.metrics.map((metric, index) => {
                return (
                    <tr className='row'>
                        <td>{metric.description}</td>
                        <td>{metric.count}</td>
                        <td className="padding-horizontal-3">{metric.tomorrow}</td>
                        <td className="padding-horizontal-3">{metric.future}</td>
                    </tr>
                )
            });
        }
        return (
            <div className="MetricSection">
                <table id="headerBack">
                    <tr>
                        <td className="promotion-breakdown-header">{this.props.source.name}</td>
                        <td className="sub-header">{this.props.source.subHeader.today}</td>
                        <td className="sub-header">{this.props.source.subHeader.tomorrow}</td>
                        <td className="sub-header">{this.props.source.subHeader.future}</td>
                    </tr>
                    {sectionResults}
                </table>
            </div>
        );
    }
}

export default GridSection;


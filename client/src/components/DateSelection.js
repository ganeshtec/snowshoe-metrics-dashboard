import React from 'react';
import '../css/dateselection.css';
import {Datepicker as DatePicker} from 'ux-react-styleguide'

const DateSelection = (props) => {
    let startDateId = `startDatePicker${props.index}`
    let endDateId = `endDatePicker${props.index}`

    return (
        <span className="date-selection">
            <div className="date-picker-wrapper">
                {!props.loading
                    ?
                    <DatePicker
                        id={startDateId}
                        callback={(date) => props.updateDates(date, null)}
                        placeholder="Start Date"
                        defaultDate={props.dateRange.startDate}
                    />
                    :
                    <span>Start Date: {props.dateRange.startDate}</span>
                }

            </div>
            <div className="date-picker-wrapper">
                {!props.loading
                    ?
                    <DatePicker
                        id={endDateId}
                        callback={(date) => props.updateDates(null, date)}
                        placeholder="End Date"
                        defaultDate={props.dateRange.endDate}
                    />
                    :
                    <span>End Date: {props.dateRange.endDate}</span>
                }

            </div>
            <button onClick={()=>props.fetchData(true)} className="button md refresh" disabled={props.loading}> Refresh </button>
        </span>
    )
};
export default DateSelection;

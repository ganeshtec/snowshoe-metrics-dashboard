import React from 'react';
import '../css/DateSelection.css';
import { Datepicker as DatePicker } from 'ux-react-styleguide'

const DateSelection = (props) => {

    
    return (
        <span className="date-selection">
            <div className="date-picker-wrapper">
                {!props.loading
                     ? 
                     <DatePicker
                    id="startDatePicker" 
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
                    id="endDatePicker" 
                    callback={(date) => props.updateDates(null, date)} 
                    placeholder="End Date"
                    defaultDate={props.dateRange.endDate}
                    />
                    :
                    <span>End Date: {props.dateRange.endDate}</span>
                }

            </div>
            <button onClick={props.fetchData} className="button md refresh" disabled={props.loading} > Refresh </button>
        </span>
    )
}
export default DateSelection;

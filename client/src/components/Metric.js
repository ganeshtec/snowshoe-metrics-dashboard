import React from 'react';

const Metric = (props) => {
    return (
        <div className='row' >
            <span className='col col-1'>{props.metric.description}</span>
            <span className='col-1'>{props.metric.count}</span>
            <span className='col-2'>{props.metric.tomorrow}</span>
            <span className='col-1'>{props.metric.future}</span>
        </div>
    );
}
export default Metric;

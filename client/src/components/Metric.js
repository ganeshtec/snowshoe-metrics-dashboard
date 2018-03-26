import React from 'react';

const Metric = (props) => {
    return (
        <div className='row' >
            <span className='col col1'>{props.metric.description}</span>
            <span className='col'>{props.metric.count}</span>
        </div>
    )
}
export default Metric;

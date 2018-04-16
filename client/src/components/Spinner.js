import React from 'react';

const Spinner = (props) => {
    return (
        <div className="col">
           Fetching data for {props.name}.
            <div className="progress-circular indeterminate md">
                <div className="stroke">
                    <div className="stroke-left"></div>
                    <div className="stroke-right"></div>
                </div>
            </div>
        </div>
    );
}
export default Spinner;

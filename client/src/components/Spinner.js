import React from 'react';

const Spinner = (props) => {
    return (
        <div className="col">
            Crunching the latest data, just for you.
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

import React, { Component } from 'react';
import '../css/homepage.css';
import axios from 'axios';
import getActivePromotions from '../service/apiService';

class Homepage extends Component{

    state = {
        data: []
    }
    async componentWillMount(){
       this.setState({
           data: await getActivePromotions()
       })
    }
    render(){
    const listItems = this.state.data.map((item) => <p key = {item.code}>{item.description + ": " + item.count }</p>);
         return(
            <div className="homePage">
                <h1>Metrics Dashboard</h1>
                    <h2>Active Promotions</h2>
                        <div>
                        {listItems}
                        </div>

                    <h2>Markdown v2 Stats</h2>
                        <p>Calls Received: 0</p>
                        <p>Calls to VPP: 0</p>
                        <p>Calls to IVP: 0</p>
                        <p>Calls to GPAS: 0</p>
                        <p>Total Calls out: (sum of previous 3)</p>
                        <p>Error responses from V2</p> 
            </div>
            )
    }
}

export default Homepage;
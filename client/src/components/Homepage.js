import React, { Component } from 'react';
import '../css/homepage.css';
import axios from 'axios';

class Homepage extends Component{
    async componentWillMount(){
        var response = await axios.get('/api/getInfo');
        console.log(response.data);
    }
    render(){
         return(
            <div className="homePage">
                <h1>Metrics Dashboard</h1>
                    <h2>Active Promotions</h2>
                        <p>Online #</p>
                        <p>Store #</p>
                        <p>All #</p> 
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
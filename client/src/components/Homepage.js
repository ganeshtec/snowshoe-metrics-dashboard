import React, { Component } from 'react';
import '../css/homepage.css';
import axios from 'axios';
import getActivePromotions from '../service/apiService';
import MetricSection from './MetricSection';

class Homepage extends Component{

    state = {
        data: []
    }
    async componentWillMount(){
        var clonedData = [...this.state]
        clonedData.push(await getActivePromotions())
       this.setState({
           data: clonedData
       })
    }
    render(){
    // const listItems = this.state.data.map((item) => <p key = {item.code}>{item.description + ": " + item.count }</p>);
        const metricsSection = this.state.data.map((section, index) => {
            return (<MetricSection key={index} section={section}/>)
        })
         return(
            <div className="homePage">
                {metricsSection}
            </div>
            )
    }
}

export default Homepage;
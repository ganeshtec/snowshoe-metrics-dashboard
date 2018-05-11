import axios from 'axios';
import moment from 'moment';

let getActivePromotions = async () => {
    try {
        var response = await axios.get('/api/discount-maintenance/fetchData');
        var returnObject = {
            metrics: response.data
        };
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Discount Maintenance API")
        return "Error"
    }
}

let getMarkDownServiceMetrics = async (startDate, endDate) => {
    if (moment(endDate) < moment(startDate)) {
        return "Error"
    }
    try {
        var response = await axios.post('/api/markdown-service/fetchData', {
            startDate: startDate,
            endDate: endDate
        })
        var data = response.data;
        var returnObject = {
            metrics: data
        }
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Markdown Service")
        return "Error"
    }

}

let getPromotionDomainServiceMetrics = async(startDate, endDate) => {
    if (moment(endDate) < moment(startDate)) {
        return "Error"
    }
    try {
        var response = await axios.post('/api/promotion-domain-service/fetchData', {
            startDate: startDate,
            endDate: endDate
        })
        var data = response.data;
        var returnObject = {
            metrics: data
        }
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Promotion Domain Service")
        return "Error"
    }
};


let getCircuitBreakerServiceMetrics = async (startDate, endDate) => {
    if (moment(endDate) < moment(startDate)) {
        return "Error"
    }
    try {
        var response = await axios.post('/api/circuit-breaker/fetchData', {
            startDate: startDate,
            endDate: endDate
        })
        var returnObject = {
            metrics: response.data
        }
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Circuit Breaker Service: ", err)
        return "Error"
    }

}

let getSonarCodeCoverageMetrics = async () => {
    try {
        var response = await axios.get('/api/sonar-code-coverage/fetchData');
        var returnObject = {
            metrics: response.data
        }
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Code Coverage")
        return "Error"
    }
}

export { getActivePromotions, getMarkDownServiceMetrics, getCircuitBreakerServiceMetrics, getSonarCodeCoverageMetrics,getPromotionDomainServiceMetrics };
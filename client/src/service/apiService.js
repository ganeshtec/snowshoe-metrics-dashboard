import axios from 'axios';

let getActivePromotions = async () => {
    try {
        var response = await axios.get('/api/discount-maintenance/fetchData');
        var data = response.data.filter(el => el.code === 57 || el.code === 87 || el.code === 9999)
        var returnObject = {
            metrics: data
        }
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Discount Maintenance API")
        return "Error"
    }
}

let getMarkDownServiceMetrics = async () => {
    try {
        var response = await axios.get('/api/markdown-service/fetchData')
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


let getCircuitBreakerServiceMetrics = async () => {
    try {
        var response = await axios.get('/api/circuit-breaker/fetchData')
        var data = response.data;
        var returnObject = {
            metrics: data
        }
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Circuit Breaker Service: ", err)
        return "Error"
    }

}

export { getActivePromotions, getMarkDownServiceMetrics, getCircuitBreakerServiceMetrics };
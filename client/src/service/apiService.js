import axios from 'axios';
import moment from 'moment';

export let getActivePromotions = async () => {
    try {
        var response = await axios.get('/api/discount-maintenance/fetchPromotionData');
        var returnObject = {
            metrics: response.data
        };
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Discount Maintenance API")
        return "Error"
    }
}

export let getQualifiersForActivePromotions = async () => {
    try {
        var response = await axios.get('/api/discount-maintenance/fetchPromoQualifiers');
        var returnObject = {
            metrics: response.data
        };
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Qualifiers")
        return "Error"
    }
}

export let getRewardsForActivePromotions = async () => {
    try {
        var response = await axios.get('/api/discount-maintenance/fetchPromoRewards');
        var returnObject = {
            metrics: response.data
        };
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Qualifiers")
        return "Error"
    }
}

export let getAttributesForActivePromotions = async () => {
    try {
        var response = await axios.get('/api/discount-maintenance/fetchPromoAttributes');
        var returnObject = {
            metrics: response.data
        };
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Attributes")
        return "Error"
    }
}

export let getCreatorsForActivePromotions = async () => {
    try {
        var response = await axios.get('/api/discount-maintenance/fetchPromoCreators');
        var returnObject = {
            metrics: response.data
        };
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Creators")
        return "Error"
    }
}

export let getMarkDownServiceMetrics = async (startDate, endDate) => {
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

export let getPromotionDomainServiceMetrics = async(startDate, endDate) => {
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


export let getCircuitBreakerServiceMetrics = async (startDate, endDate) => {
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

export let getSonarCodeCoverageMetrics = async () => {
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

export let getProBidRoomServiceMetrics = async (startDate, endDate) => {
    if (moment(endDate) < moment(startDate)) {
        return "Error"
    }
    try {
        var response = await axios.post('/api/pro-bid-room/fetchData', {
            startDate: startDate,
            endDate: endDate
        })
        var returnObject = {
            metrics: response.data
        }
        return returnObject;
    } catch (err) {
        console.log("Error Fetching Results for Pro Bid Room Service: ", err)
        return "Error"
    }

}


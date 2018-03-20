import axios from 'axios';

let getActivePromotions = async () => {
    var response = await axios.get('/discount-maintenance/status');
    var data = response.data.filter(el=>el.code===57 || el.code===87 || el.code===9999)
    return data;
    }

    export default getActivePromotions;
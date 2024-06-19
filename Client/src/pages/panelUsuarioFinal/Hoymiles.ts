import axios from 'axios'

const fetchData = async (user : any)=>{
    try {
    const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
    const request = await axios.post(`${apiUrl}/api/device-info/hoymiles`,{
        user_name:user
    })
    const response = request.data
    return response
    } catch (error) {
        console.log(error);
        
    }
}
export {fetchData}
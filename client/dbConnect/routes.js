import {config} from './types.js'

export const login = async (email,password) => {
   let body = {
      email,
      password
   }
   body = JSON.stringify(body)
   const res = await axios.post('api/login',body,config)
   return res.data;
}
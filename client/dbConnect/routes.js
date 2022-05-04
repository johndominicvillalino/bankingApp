import {config} from './types.js'
const origin = window.location.origin;

export const login = async ({email,password}) => {
   let body = {
      email,
      password
   }
   body = JSON.stringify(body)
   const res = await axios.post('api/login',body,config)
   return res.data;
}

export const getAllBanks = async (id) => {

 
  const res = await axios.get(`${origin}/api/bank?id=${id}`)
  return res
}

export const stateUpdate = (pushTo,stateUpdate = { state: pushTo}) => {
   history.pushState(pushTo, pushTo,pushTo);
   let popStateEvent = new PopStateEvent("popstate", stateUpdate);
   dispatchEvent(popStateEvent);

}

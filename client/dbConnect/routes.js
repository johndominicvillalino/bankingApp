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

   //a6844539-5324-4251-a7b8-a49ebca40b24
  const res = await axios.get(`${origin}/api/bank?id=${id}`)
  return res
}

export const stateUpdate = (pushTo,stateUpdate = { state: pushTo}) => {
   history.pushState(pushTo, pushTo,pushTo);
   let popStateEvent = new PopStateEvent("popstate", stateUpdate);
   dispatchEvent(popStateEvent);

}
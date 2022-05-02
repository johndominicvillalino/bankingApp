import { login,stateUpdate } from "../dbConnect/routes.js";
import { storeData, getStringData } from "../dbConnect/storage.js";
const reloadState = window.location.href;
const origin = window.location.origin;
const dom = document;

//link on click to trigger popstate
dom.querySelectorAll("a").forEach((el) => {
  el.addEventListener("click", (e) => {
    const { id } = e.target;
    stateUpdate(`/${id}`)
  });
});

//state update
window.onpopstate = function (event) {
  let { state } = event;
  state = window.location.origin + state;
  storeData("currentState", state);
  processStateRoute();
};

window.addEventListener("load", (e) => {
  let state = getStringData("currentState");
  let user = getStringData("user");

  if(user) {
    stateUpdate(`/dashboard`)
    storeData("currentState", state);
  } else {
    stateUpdate('/')
    storeData("currentState", state);
  }

  if (reloadState !== state) {
    storeData("currentState", reloadState);
  }

  const newStateState = {state: window.location.pathname }
  let popStateEvent = new PopStateEvent("popstate",newStateState );
  dispatchEvent(popStateEvent);

});

function processStateRoute() {

  if (getStringData("currentState") === origin + "/forgotPassword") {
    dom.getElementById("loginForm").style.display = "none";
  } else {
    dom.getElementById("loginForm").style.display = 'flex';
  }
}

dom.getElementById('loginSubmit').addEventListener('click', async e => {
  e.preventDefault()
  const data = {}
  const inputs = dom.querySelectorAll('.loginform')
  inputs.forEach(e => {
    if (e.value.length < 1) {
      e.style.border = '1px solid red'
      return
    }
    data[e.name] = e.value
    e.value = ''
  })

try {
  const keys = Object.keys(data)
  if(keys.length < 1) {
    return
  }
  const res = await login(data)
  if(res) {
    storeData('user',res.id)
    history.pushState(`/dashboard`, 'dashboard', "/dashboard");
    let popStateEvent = new PopStateEvent("popstate", { state: `/dashboard` });
    dispatchEvent(popStateEvent);
    storeData("currentState", state);
  }


} catch (err) {
  console.error(err.message)
}
  
})

//default color
dom.querySelectorAll('.loginform').forEach(e => {
  e.addEventListener('focus', el => {
    e.style.border = '1px solid black'
  })
})
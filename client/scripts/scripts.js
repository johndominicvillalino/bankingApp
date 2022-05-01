import { login } from "../dbConnect/routes.js";
import { storeData, getStringData } from "../dbConnect/storage.js";
const reloadState = window.location.href;
const origin = window.location.origin;
const dom = document;

dom.querySelectorAll("a").forEach((el) => {
  el.addEventListener("click", (e) => {
    const { id } = e.target;
    history.pushState(`/${id}`, id, "/" + id);
   let popStateEvent = new PopStateEvent("popstate", { state: `/${id}` });
    dispatchEvent(popStateEvent);
  });
});

window.onpopstate = function (event) {
  let { state } = event;
  state = window.location.origin + state;
  storeData("currentState", state);
  processStateRoute();
};

window.addEventListener("load", (e) => {
  let state = getStringData("currentState");

  if (reloadState !== state) {
    storeData("currentState", reloadState);
  }
  
  let popStateEvent = new PopStateEvent("popstate",{state : window.location.pathname});
  dispatchEvent(popStateEvent);

});

function processStateRoute() {

  if (getStringData("currentState") === origin + "/forgotPassword") {
    dom.getElementById("loginForm").style.display = "none";
  }
}

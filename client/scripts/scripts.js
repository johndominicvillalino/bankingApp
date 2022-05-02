import { login, stateUpdate, getAllBanks } from "../dbConnect/routes.js";
import { storeData, storeObjData, getStringData, getStoredObjData } from "../dbConnect/storage.js";
const reloadState = window.location.href;
const origin = window.location.origin;
const dom = document;

//link on click to trigger popstate
dom.querySelectorAll("a").forEach((el) => {
  el.addEventListener("click", (e) => {
    const { id } = e.target;
    stateUpdate(`${origin}/${id}`)
  });
});

//state update
window.onpopstate = function (event) {



  let { state } = event;
  storeData("currentState", state);
  processStateRoute();
};

window.addEventListener("load", (e) => {
  let state = getStringData("currentState");
  let user = getStringData("user");

  console.log(state)
  processStateRoute()

  if (user) {
    stateUpdate(`/dashboard`, { state: origin + '/dashboard' })
    return
  }

  if (reloadState !== state) {
    console.log(reloadState)
    stateUpdate(reloadState)
  }


});

function processStateRoute() {

  const elArr = ['loginForm', 'RegisterForm', 'resetPassword', 'dashboard']

  let display = 'flex'

  function hideOthers(id) {
    if (id === 'dashboard') {
      display = 'grid'
    }
    elArr.forEach(el => {
      try {
        if (id !== el) {
          dom.getElementById(el).style.display = 'none'

        } else {
          dom.getElementById(el).style.display = 'grid';
        }
      } catch (error) {

      }
    })

  }

  switch (getStringData("currentState")) {
    case origin + '/':
      hideOthers('loginForm')
      break;
    case origin + '/register':
      hideOthers('RegisterForm')
      break;
    case origin + '/forgotPassword':
      hideOthers('resetPassword')
      break;
    case origin + '/dashboard':
      if (!getStringData('user')) {
        stateUpdate('/', { state: origin + "/" })
        return
      }
      hideOthers('dashboard')
      break
    case origin + '/dashboard' + '/accounts':

      const getData = async () => {
        try {
          let res = await getAllBanks('a6844539-5324-4251-a7b8-a49ebca40b24')
          res = res.data
          storeObjData('banks',res)

          const storedBanks = getStoredObjData('banks')

          const checkBankEl = dom.querySelectorAll('.banks')
          if(checkBankEl) {
            checkBankEl.forEach(e => {
              e.remove()
            })
          }

          storedBanks.forEach(el => {
            const div = dom.createElement('div')
            div.setAttribute('class','banks')
            div.textContent = el.accountNum
            dom.getElementById('inner').appendChild(div)
          })


        } catch (error) {
        }
      }

      getData()

      break;
    default:
      break;
  }

}

dom.getElementById('loginSubmit').addEventListener('click', async e => {
  e.preventDefault()
  const data = {}
  const inputs = dom.querySelectorAll('.loginform')

  const handleError = ['loginEmail', 'loginPassword']
  inputs.forEach(e => {


    if (e.value.length < 1) {
      let check = handleError.includes(e.id)
      if (check) {
        e.style.border = '1px solid red'
      }
      return
    }
    data[e.name] = e.value
    e.value = ''
  })


  try {
    const errorMsg = ['password incorrect', 'Email not found']
    const keys = Object.keys(data)
    if (keys.length < 1) {
      return
    }
    const res = await login(data)

    if (res && !errorMsg.includes(res)) {
      storeData('user', res.id)
      delete res.id
      storeObjData('userInfo', res)
      stateUpdate(`/dashboard`, { state: origin + '/dashboard' })
      return
    }
    const error = dom.getElementById('error')
    error.style.color = 'red'
    error.innerText = 'Invalid Credentials'

  } catch (err) {
    console.error(err.message)
    const error = dom.getElementById('error')
    error.style.color = 'red'
    error.innerText = 'Invalid Credentials'
  }

})

//default color
dom.querySelectorAll('.loginform').forEach(e => {
  e.addEventListener('focus', el => {
    e.style.border = '1px solid black'
    dom.getElementById('error').innerText = ''
  })
})

dom.querySelectorAll('.dashboardMenu').forEach(e => {
  e.addEventListener('click', el => {

    const subRoute = el.target.innerText;
    stateUpdate(`${origin}/dashboard/${subRoute.toLowerCase()}`)

  })
})
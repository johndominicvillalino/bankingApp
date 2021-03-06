import { login, stateUpdate, getAllBanks } from "../dbConnect/routes.js";
import { storeData, storeObjData, getStringData, getStoredObjData } from "../dbConnect/storage.js";
import { config } from '../dbConnect/types.js'
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

      removeTransTable()

      const getData = async () => {
        try {
          let res = await getAllBanks('a6844539-5324-4251-a7b8-a49ebca40b24')
          res = res.data
          storeObjData('banks', res)

          const storedBanks = getStoredObjData('banks')

          const checkBankEl = dom.querySelectorAll('.banksContainer')
          if (checkBankEl) {
            checkBankEl.forEach(e => {
              e.remove()
            })
          }

          const personalBank = dom.querySelectorAll('.personalBankContainer')

          if (personalBank) {
            personalBank.forEach(e => {
              e.remove()
            })
          }


          storedBanks.forEach((el, i) => {
            const div = dom.createElement('div')
            div.setAttribute('class', 'banksContainer')
            div.setAttribute('onclick', `bankInfo(this)`)
            div.setAttribute('id', `bank${i}`)
            const banks = dom.createElement('div')
            banks.setAttribute('class', 'banks')
            const p = dom.createElement('p')
            const pTwo = dom.createElement('p')
            p.textContent = el.accountName
            pTwo.textContent = el.accountNum
            banks.appendChild(p)
            banks.appendChild(pTwo)
            div.appendChild(banks)

            dom.getElementById('inner').appendChild(div)
          })
        } catch (error) {
        }
      }

      dom.querySelectorAll('.add-account-button').forEach(e => {
        e.remove()
      })

      getData()

      const span = dom.createElement('span')
      span.setAttribute('id', 'addAccount')
      span.setAttribute('class', 'add-account-button')
      span.setAttribute('onclick', `addAccountFunc()`)
      span.textContent = '+'
      dom.getElementById('inner').appendChild(span)

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

    if (res.isAdmin) {
      if (res && !errorMsg.includes(res)) {
        storeData('user', res.id)
        delete res.id
        storeObjData('userInfo', res)
        stateUpdate(`/dashboard`, { state: origin + '/dashboard' })
        return
      }
    } else {
      storeData('regUser', res.id)
      delete res.id
      storeObjData('regUserInfo', res)
      const banks = await getAllBanks()
      const alltrans = await axios.get('api/transactions')
      storeObjData('allbanks', banks.data)
      storeObjData('AllTrans', alltrans.data)
      
      window.location.href = '/user'
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


dom.getElementById('registerSubmit').addEventListener('click', async e => {
  e.preventDefault()

  const registerFname = dom.getElementById('registerFname')
  const registerLname = dom.getElementById('registerLname')
  const age = dom.getElementById('age')
  const registerEmail = dom.getElementById('registerEmail')
  const registerPassword = dom.getElementById('registerPassword')
  const registerPasswordTwo = dom.getElementById('registerPasswordTwo')


  if (registerPassword.value !== registerPasswordTwo.value) {
    window.alert('Password not Match')
    return
  }

  if (registerFname.value.length < 1 || registerLname.value.length < 1 || age.value.length < 1 || registerEmail.value.length < 1 || !registerEmail.value.includes('@') || registerPassword.value.length < 1 || registerPasswordTwo.value.length < 1) {
    window.alert('missing information')
    return
  }


  let body = {
    fName: registerFname.value,
    lName: registerLname.value,
    age: age.value,
    password: registerPassword.value,
    email: registerEmail.value
  }

  body = JSON.stringify(body)
  try {


    const res = await axios.post('/api/account/create', body, config)

    window.alert('Registration Complete')

    window.location.href = '/'



  } catch (err) {

    window.alert(err.response.data)


  }




})



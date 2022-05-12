const storage = window.localStorage
const dom = document

const config =
{
    headers: {
        'Content-Type': 'Application/json'
    }
}

const globalState = {
    nav: ''
}

const nav = {loc:'Deposit / Withdraw'};


window.addEventListener('load', e => {
    //get name

    getBank()
    getName()
    filterTrans()
    hideUnhide()

})

function getBank() {

    let banks = storage.getItem('allbanks')
    banks = JSON.parse(banks)
    banks.forEach(e => e.fullName = e.fName + " " + e.lName)

    let user = storage.getItem('regUserInfo')
    user = JSON.parse(user)

    const userFullName = user.fName + " " + user.lName

    storage.setItem('fullName',userFullName)
    let userBank = banks.find(e => e.fullName === userFullName)
    const userBankStr = JSON.stringify(userBank)
    storage.setItem('userBank', userBankStr)

    dom.getElementById('balance').innerText = `Balance : ₱${userBank.balance}`
    dom.getElementById('AccountNumber').innerText = `${userBank.accountNum}`
}

function filterTrans() {

    const fullName = storage.getItem('fullName')
    let allTrans = storage.getItem('AllTrans')
    allTrans = JSON.parse(allTrans)
    let filterTrans = allTrans.filter(e => e.name === fullName)
    filterTrans = JSON.stringify(filterTrans)
    storage.setItem('AllTrans',filterTrans)


}

function hideUnhide() {
    if(nav.loc === 'Deposit / Withdraw'){
        dom.getElementById('myChart').style.display = 'none'
        dom.getElementById('depositWithdraw').style.display = 'flex'
    }
    if(nav.loc === 'Activities'){
        dom.getElementById('myChart').style.display = 'block'
        dom.getElementById('depositWithdraw').style.display = 'none'
    }
}



function getName() {
    let regUserInfo = storage.getItem('regUserInfo')
    if (!regUserInfo) {
        window.location.href = '/'
    }
    regUserInfo = JSON.parse(regUserInfo);
    const name = regUserInfo.fName
    dom.getElementById('userName').textContent = `Hi ${name}!`
}

dom.querySelectorAll('.navLi').forEach(e => {
    e.addEventListener('click', el => {
        nav.loc = el.target.textContent
        updateUlStyle(el.target.textContent, '.navLi', 'liHover')
        hideUnhide()
    })
})

function updateUlStyle(text, classes, removeClass) {
    dom.querySelectorAll(classes).forEach(e => {
        if (e.textContent === text) {
            e.classList += ` ${removeClass}`
        } else {
            e.classList.remove(removeClass)
        }
    })
}

//btnHover

function logout() {
    storage.clear()
    window.location.href = '/'
}

dom.querySelectorAll('.wdButtn').forEach(e => {
    e.addEventListener('click', el => {
        updateUlStyle(el.target.textContent, '.wdButtn', 'btnHover')
    })
})

dom.getElementById('submiTrans').addEventListener('click', async e => {

    e.preventDefault()
    const amount = dom.getElementById('amount')
    const { value } = amount

    if (value < 1 || value.length < 1) {
        window.alert('missing information')
        return
    }


    const type = dom.querySelector('.btnHover')
    const account = dom.getElementById('AccountNumber')
    const balanceEl = dom.getElementById('balance')
    let balance = balanceEl.textContent

    if (!type) {
        window.alert('Choose transaction')
        return
    }

    let transType = type.textContent.toLowerCase()

    let body = {
        account: account.textContent,
        action: transType,
        amount: parseInt(value)
    }

    body = JSON.stringify(body)
    await axios.put('/api/bank', body, config)

    const test = `Balance : ₱5400`

    balance = balance.match(/\d/g)
    balance = balance.join("")
    balance = parseInt(balance)

    if (transType === 'deposit') {
        balance +=  parseInt(value)
    } else {
        balance -=  parseInt(value)
    }
    
    balanceEl.textContent = `Balance : ₱${balance}`
    dom.getElementById('amount').value = ''
    window.alert('Transaction complete!')
    
})




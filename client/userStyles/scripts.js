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

const nav = { loc: 'Deposit / Withdraw' };


window.addEventListener('load', e => {
    //get name

    getBank()
    getName()
    filterTrans()
    hideUnhide()
    putBalance()

})

function getBank() {

    let banks = storage.getItem('allbanks')
    banks = JSON.parse(banks)
    banks.forEach(e => e.fullName = e.fName + " " + e.lName)

    let user = storage.getItem('regUserInfo')
    user = JSON.parse(user)

    const userFullName = user.fName + " " + user.lName

    storage.setItem('fullName', userFullName)
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
    storage.setItem('AllTrans', filterTrans)


}

function hideUnhide() {
    if (nav.loc === 'Deposit / Withdraw') {
        dom.getElementById('myChart').style.display = 'none'
        dom.getElementById('depositWithdraw').style.display = 'flex'
        dom.getElementById('budgetExpense').style.display = 'none'
    }
    if (nav.loc === 'Activities') {
        dom.getElementById('myChart').style.display = 'block'
        dom.getElementById('depositWithdraw').style.display = 'none'
        dom.getElementById('budgetExpense').style.display = 'none'
    }
    if (nav.loc === 'Budget / Expense') {
        dom.getElementById('myChart').style.display = 'none'
        dom.getElementById('depositWithdraw').style.display = 'none'
        dom.getElementById('budgetExpense').style.display = 'flex'
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
        balance += parseInt(value)
    } else {
        balance -= parseInt(value)
    }

    balanceEl.textContent = `Balance : ₱${balance}`
    dom.getElementById('amount').value = ''
    window.alert('Transaction complete!')

})


let counter = 0

dom.querySelector('.startBudget').addEventListener('click', e => {

    counter += 1;

    const budgetExpense = dom.getElementById('budgetExpense')

    const description = dom.createElement('input')
    const value = dom.createElement('input')

    const calculate = dom.createElement('button')

    calculate.textContent = 'Calculate'
    calculate.setAttribute('id', `calculate${counter}`)
    calculate.setAttribute('onclick', `calculate(this)`)


    const save = dom.createElement('button')
    save.setAttribute('id', 'save')
    save.textContent = 'save'

    const div = dom.createElement('div')
    div.setAttribute('class', 'budgetDiv')

    value.setAttribute('type', 'number')
    description.setAttribute('type', 'text')

    value.setAttribute('id', `value${counter}`)
    value.setAttribute('class', `value`)

    description.setAttribute('id', `description${counter}`)
    description.setAttribute('class', `description`)

    value.setAttribute('placeholder', 'amount')
    description.setAttribute('placeholder', 'description')

    const arr = [value, description, calculate]

    dom.querySelector('.startBudget').textContent = 'Add more'

    arr.forEach(e => {
        div.append(e)
    })

    budgetExpense.append(div)


    if (dom.getElementById('save')) {
        dom.getElementById('save').remove()
    }
    // budgetExpense.append(save)

})


function putBalance() {
    let balance = storage.getItem('userBank')
    balance = JSON.parse(balance)
    balance = balance.balance

    storage.setItem('balance',balance)
}

function calculate(e) {

    let balance = storage.getItem('balance')
    
    if(dom.getElementById(`result${e.id}`)){
        dom.getElementById(`result${e.id}`).remove()
    }

    const { id } = e
    let num = id.match(/\d/g)
    num = num.join(" ")

    let desc, value;

    const allValue = dom.querySelectorAll('.value')
    const allDesc = dom.querySelectorAll('.description')

    allValue.forEach(e => {
        if (e.id.includes(num)) {
            value = e.value
        }
    })
    allDesc.forEach(e => {
        if (e.id.includes(num)) {
            desc = e.value
        }
    })

    const span = dom.createElement('span')
    span.setAttribute('id',`result${e.id}`)
    span.style.marginLeft = '10px'

    balance = parseInt(balance)

    if(balance < parseInt(value)) {
        span.textContent = 'insufficient funds'
        span.style.color = 'red'
        dom.getElementById(e.id).after(span)
        return 
    }

    if(value.length < 1 || parseInt(value) <1 || typeof value == 'String' ) {
        span.textContent = 'Please put a valid amount'
        span.style.color = 'red'
        dom.getElementById(e.id).after(span)
        return
    }

    const diff = balance - parseInt(value)

    console.log(diff)

    storage.setItem('balance',diff)
    span.style.color = 'black'
    span.textContent = diff
    dom.getElementById(e.id).after(span)


}


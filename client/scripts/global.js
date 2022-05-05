
const storage = window.localStorage
const dom = document

async function bankInfo({ id }) {

    const el = dom.getElementById(id)
    const child = el.children
    const childrenOfChild = child[0].children
    const numP = childrenOfChild[1];
    const accountNumber = numP.textContent
    hideBankInfo()
    const storedBank = getStoredObjData('banks')
    const found = storedBank.find(e => e.accountNum === accountNumber)

    const div = createDiv('personalBankContainer')
    const divTwo = createDiv('personalName')
    const divThree = createDiv('personalBalance')
    const divFour = createDiv('personalBalance')
    divFour.setAttribute('id','accountNumber')
    const widthdrawBtn = createButton('widthraw')
    widthdrawBtn.setAttribute('onclick', `widthdraw(this)`)
    widthdrawBtn.textContent = 'Withdraw'

    const DepositBtn = createButton('deposit')

    DepositBtn.textContent = 'Deposit'
    DepositBtn.setAttribute('onclick', `deposit(this)`)
    let appendAll = [divTwo ,divFour,divThree, widthdrawBtn, DepositBtn]

    divTwo.textContent = found.accountName
    divFour.textContent = found.accountNum
    divThree.textContent = found.balance
  

    appendAll.forEach(e => {
        div.append(e)
    })

    dom.getElementById('inner').append(div)

}


function hideBankInfo() {
    dom.querySelectorAll('.banksContainer').forEach(e => {
        e.style.display = 'none'
    })

}

function getStoredObjData(holder) {
    let data = storage.getItem(holder)
    data = JSON.parse(data)
    return data;
}

function createDiv(classes) {
    const div = dom.createElement('div')
    div.setAttribute('class', classes)
    return div;
}

function createButton(classes) {
    const btn = dom.createElement('button')
    btn.setAttribute('class', classes)
    return btn;
}

function widthdraw(e) {

    const widthdrawBtn = dom.querySelector('.widthraw')
    const depositBtn = dom.querySelector('.deposit')

    const hideThis = [widthdrawBtn, depositBtn]
    const input = dom.createElement('input')
    const button = dom.createElement('button')
    button.setAttribute('id', 'submitTrans')
    button.setAttribute('onclick', `submitTrans('withdraw')`)
    button.textContent = 'Complete'
        input.setAttribute('type', 'number')
    input.setAttribute('id', 'withdrawId')
    const personal = dom.querySelector('.personalBankContainer')




    hideThis.forEach(e => {
        e.remove()
    })

    personal.appendChild(input)
    personal.appendChild(button)

}

function deposit(e) {

}

function submitTrans(action) {

        switch (action) {
            case 'withdraw':
                
                
                break;
        
            default:
                break;
        }

}
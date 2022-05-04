
const storage = window.localStorage
const dom = document

async function bankInfo ({id}) {
    
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
    const widthdrawBtn = createButton('widthraw')

    widthdrawBtn.textContent = 'Withdraw'

    const DepositBtn = createButton('deposit')

    DepositBtn.textContent = 'Deposit'

    let appendAll = [divTwo,divThree,widthdrawBtn,DepositBtn]
    
    divTwo.textContent = found.accountName
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

function getStoredObjData (holder) {
    let data = storage.getItem(holder)
    data = JSON.parse(data)
    return data;
}

function createDiv (classes) {
    const div = dom.createElement('div')
    div.setAttribute('class',classes)
    return div;
}

function createButton (classes) {
    const btn = dom.createElement('button')
    btn.setAttribute('classes',classes)
    return btn;
}
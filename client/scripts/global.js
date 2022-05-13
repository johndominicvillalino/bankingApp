const storage = window.localStorage;
const dom = document;

async function bankInfo({ id }) {
  const el = dom.getElementById(id);
  const child = el.children;
  const childrenOfChild = child[0].children;
  const numP = childrenOfChild[1];
  const accountNumber = numP.textContent;
  hideBankInfo();
  const storedBank = getStoredObjData("banks");
  const found = storedBank.find((e) => e.accountNum === accountNumber);

  const div = createDiv("personalBankContainer");
  const divTwo = createDiv("personalName");
  const divThree = createDiv("personalBalance");
  divThree.setAttribute("id", "balance");
  const divFour = createDiv("personalBalance");
  divFour.setAttribute("id", "accountNumber");
  const widthdrawBtn = createButton("widthraw");
  const transferButton = createButton("widthraw");
  widthdrawBtn.setAttribute("onclick", `widthdraw(this)`);
  widthdrawBtn.textContent = "Withdraw";

  transferButton.setAttribute("onclick", `transfer(this)`);
  transferButton.setAttribute("id", `transfer`);
  transferButton.setAttribute("class", `transfer`);
  transferButton.textContent = "Transfer";

  const DepositBtn = createButton("deposit");

  DepositBtn.textContent = "Deposit";
  DepositBtn.setAttribute("onclick", `deposit(this)`);
  let appendAll = [
    divTwo,
    divFour,
    divThree,
    widthdrawBtn,
    DepositBtn,
    transferButton,
  ];

  divTwo.textContent = found.accountName;
  divFour.textContent = found.accountNum;
  divThree.textContent = found.balance;

  appendAll.forEach((e) => {
    div.append(e);
  });

  dom.getElementById("inner").append(div);
}

function hideBankInfo() {
  dom.querySelectorAll(".banksContainer").forEach((e) => {
    e.style.display = "none";
  });

  dom.querySelectorAll('.add-account-button').forEach(e => {
    e.remove()
  })
  
}

function getStoredObjData(holder) {
  let data = storage.getItem(holder);
  data = JSON.parse(data);
  return data;
}

function createDiv(classes) {
  const div = dom.createElement("div");
  div.setAttribute("class", classes);
  return div;
}

function createButton(classes) {
  const btn = dom.createElement("button");
  btn.setAttribute("class", classes);
  return btn;
}

function transfer(e) {
  const widthdrawBtn = dom.querySelector(".widthraw");
  const ownName = dom.querySelector(".personalName").textContent;
  const depositBtn = dom.querySelector(".deposit");
  const transferBtn = dom.querySelector(".transfer");

  const banks = getStoredObjData("banks");

  const button = dom.createElement("button");
  button.setAttribute("id", "submitTrans");
  button.setAttribute("onclick", `submitTrans('transfer')`);
  button.textContent = "Complete";


  dom.createElement("select");
  const hideThis = [widthdrawBtn, depositBtn, transferBtn];
  hideThis.forEach((e) => {
    e.remove();
  });

  const personal = dom.querySelector(".personalBankContainer");

  const input = dom.createElement("input");
  input.setAttribute("id", "transferVal");
  input.setAttribute("class", "transferVal");
  input.setAttribute("type", "number");

  personal.appendChild(input);

  const select = dom.createElement("select");
  select.setAttribute("id", "bankSelect");
  select.setAttribute("class", "bankSelect");

  personal.appendChild(select);

  banks.forEach((e) => {
    if (e.accountName !== ownName) {
      const option = dom.createElement("option");
      option.text = e.accountName;
      option.value = e.accountNum;
      select.appendChild(option);
    }
  });

  personal.appendChild(button)



}

function widthdraw(e) {
    const transferBtn = dom.querySelector(".transfer");
  const widthdrawBtn = dom.querySelector(".widthraw");
  const depositBtn = dom.querySelector(".deposit");




  const hideThis = [widthdrawBtn, depositBtn,transferBtn];
  const input = dom.createElement("input");
  const button = dom.createElement("button");
  button.setAttribute("id", "submitTrans");
  button.setAttribute("onclick", `submitTrans('withdraw')`);
  button.textContent = "Complete";
  input.setAttribute("type", "number");
  input.setAttribute("id", "withdrawId");
  const personal = dom.querySelector(".personalBankContainer");

  hideThis.forEach((e) => {
    e.remove();
  });

  personal.appendChild(input);
  personal.appendChild(button);
}

function deposit(e) {
    const transferBtn = dom.querySelector(".transfer");
  const widthdrawBtn = dom.querySelector(".widthraw");
  const depositBtn = dom.querySelector(".deposit");

  const hideThis = [widthdrawBtn, depositBtn,transferBtn];
  const input = dom.createElement("input");
  const button = dom.createElement("button");
  button.setAttribute("id", "submitTrans");
  button.setAttribute("onclick", `submitTrans('deposit')`);
  button.textContent = "Complete";
  input.setAttribute("type", "number");
  input.setAttribute("id", "depositId");
  const personal = dom.querySelector(".personalBankContainer");

  hideThis.forEach((e) => {
    e.remove();
  });

  personal.appendChild(input);
  personal.appendChild(button);
}

async function submitTrans(action) {



  let config = {
    headers: {
      "Content-Type": "Application/json",
    },
  };

  let val = dom.getElementById("withdrawId");
  let valDeposit = dom.getElementById("depositId");
  const balance = dom.getElementById("balance");
 

  const accNumber = dom.getElementById("accountNumber").textContent;


  const url = "/api/bank";
  const transferUrl = "/api/bank/transfer";

  let body = {};

  switch (action) {
    case "withdraw":


      if(val.value < 1 || val.value.length < 1) {
        window.alert('missing input value')
        return 
      }


      if (val.value > parseInt(balance.textContent)) {
        window.alert("Insuffecient funds");
        return;
      }
      body = {
        account: accNumber,
        action,
        amount: val.value,
      };

      await axios.put(url, body, config);

      balance.textContent -= val.value;
      val.value = "";
      window.alert("transaction completed!");
      break;

    case "deposit":


      if(valDeposit.value < 1 || valDeposit.value.length < 1) {
        window.alert('missing input value')
        return 
      }

      
      let depoVal = parseInt(valDeposit.value);
      body = {
        account: accNumber,
        action,
        amount: depoVal,
      };

      await axios.put(url, body, config);
      let balInt = parseInt(balance.textContent);
      balance.textContent = parseInt(balInt) + depoVal;
      valDeposit.value = "";
      window.alert("transaction completed!");

      break;

      case 'transfer': 

      const transValue = dom.getElementById('transferVal') 

  
      if(parseInt(balance.textContent) < parseInt(transValue.value)) {
        window.alert('insufficient funds')
        return 
      }
    
      if(transValue.value < 1 || transValue.value.length < 1) {
        window.alert('missing input value')
        return 
      }
     const currentBal = dom.getElementById('balance') 
   
     let transValInput = transValue.value
     
     transValInput = parseInt(transValInput)



     const fromId = dom.getElementById('accountNumber').textContent
     const toId = dom.getElementById('bankSelect').value


     let data = {
        from:fromId,
        to:toId,
        transValue:transValInput
     }

             
    await axios.put(transferUrl, data, config);

    let currVal = currentBal.textContent
    currVal = parseInt(currVal)

    currVal = currVal - transValInput

    currentBal.textContent = currVal

    transValue.value = ''

    window.alert('transaction complete')
   
     
      break;

    default:
      break;
  }
}

function logout() {
  window.localStorage.clear();
  window.location.href = "/";
}


function addAccountFunc () {
  
  //a6844539-5324-4251-a7b8-a49ebca40b24
  const body = dom.getElementById('body')
  body.style.opacity = .20
  body.style.pointerEvents ='none'

  const div = dom.createElement('div')
  div.setAttribute('class','addFormContainer')
  // const form = dom.createElement()

  const inputOne = dom.createElement('input')
  const inputTwo = dom.createElement('input')
  const inputThree = dom.createElement('input')
  const submitBtn = dom.createElement('button')
  const span = dom.createElement('span')
  span.setAttribute('class','xButton')
  span.setAttribute('onclick','removeAddForm()')
  span.textContent = 'X'



  inputOne.setAttribute('type','text')
  inputTwo.setAttribute('type','text')
  inputThree.setAttribute('type','number')

  inputOne.setAttribute('placeholder','First Name')
  inputOne.setAttribute('id','createFname')
  inputTwo.setAttribute('placeholder','Last Name')
  inputTwo.setAttribute('id','createLname')
  inputThree.setAttribute('placeholder','Initial Deposit')
  inputThree.setAttribute('id','initialDeposit')

  submitBtn.setAttribute('onclick','createAccountSubmit(this)')
  submitBtn.textContent = 'Create'

  const allElements = [span,inputOne,inputTwo,inputThree,submitBtn]

  allElements.forEach(e => {
    div.appendChild(e)
  })
  
  dom.querySelector('html').appendChild(div)



}


function removeAddForm () {
  const body = dom.getElementById('body')
  body.style.opacity = 1

  body.style.pointerEvents = 'auto'
  dom.querySelector('.addFormContainer').remove()
}

async function createAccountSubmit (e) {

 
  const id = 'a6844539-5324-4251-a7b8-a49ebca40b24'

  const fName = dom.getElementById('createFname')
  const lName = dom.getElementById('createLname')
  const initialD = dom.getElementById('initialDeposit')



  const fNameLen = fName.value.length
  const lNameLen = lName.value.length
  const initialDLen = initialD.value.length
 
  if(fNameLen < 1 || !fNameLen) {
    window.alert('missing information')
    removeAddForm()
    return
  }
  if(lNameLen < 1 || !lNameLen) {
    window.alert('missing information')
    removeAddForm()
    return
  }
  if(initialDLen < 1 || !initialDLen) {
    window.alert('missing information')
    removeAddForm()
    return
  }

  const url = '/api/bank'


  body = {
    id,
    fName:fName.value,
    lName:lName.value,
    initialDeposit:initialD.value
  }

let config = {
    headers: {
      "Content-Type": "Application/json",
    },
  };

  await axios.post(url,body,config)

  removeAddForm()

  let clickEvent = new Event('click');
  dom.getElementById('accountHome').dispatchEvent(clickEvent)


}

function removeTransTable () {
  const tableExist = dom.querySelector('table')
  if(tableExist) {
    tableExist.remove()
  }
}

async function analysis () {

  dom.querySelectorAll('.banksContainer').forEach(e => {
    e.remove()
  })

  const personal = dom.querySelector('.personalBankContainer');
  if(personal) {
    personal.remove()
  }


  removeTransTable()

  const spanExist = dom.getElementById('addAccount')
  
  if(spanExist){
    spanExist.remove()
  }

  let transactions = await axios.get('/api/transactions')
  transactions = transactions.data


  
  const table = dom.createElement('table')

  const tr = dom.createElement('tr')

  const transType = dom.createElement('th')
  transType.textContent = 'Transaction Type'

  const name = dom.createElement('th')
  name.textContent = 'Name'

  const amount = dom.createElement('th')
  amount.textContent = 'Amount'

  const running = dom.createElement('th')
  running.textContent = 'Running Balance'

  const date = dom.createElement('th')
  date.textContent = 'Date'

  const appendThis = [tr,transType,amount,running,date]

    table.appendChild(tr)
    table.appendChild(name)
    table.appendChild(transType)

    table.appendChild(running)
    table.appendChild(amount)
    table.appendChild(date)
 

  transactions.forEach(e => {

    const trIn = dom.createElement('tr')


    const td0 = dom.createElement('td')
    td0.textContent = e.name

    const td1 = dom.createElement('td')
    td1.textContent = e.type

    const td2 = dom.createElement('td')
    td2.textContent = e.running
    const td3 = dom.createElement('td')
    td3.textContent = e.amount

    const td4 = dom.createElement('td')
    const month = new Date(e.time).getMonth() + 1 
    td4.textContent = new Date(e.time).getDate() + '/' + month  + '/' + new Date(e.time).getFullYear() 

    const appendAll = [td0,td1,td2,td3,td4]

    appendAll.forEach(el => {

      trIn.appendChild(el)

    }) 

    table.appendChild(trIn)

  })



  dom.getElementById('inner').appendChild(table)


   
}
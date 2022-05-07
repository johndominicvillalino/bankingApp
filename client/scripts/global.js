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
      let depoVal = parseInt(valDeposit.value);
      body = {
        account: accNumber,
        action,
        amount: depoVal,
      };

      await axios.put(url, body, config);
      let balInt = parseInt(balance.textContent);
      balance.textContent = balInt + depoVal;
      valDeposit.value = "";
      window.alert("transaction completed!");
      break;

      case 'transfer': 
     const transValue = dom.getElementById('transferVal') 
     const currentBal = dom.getElementById('balance') 
   
     let val = transValue.value
     val = parseInt(val)

     const fromId = dom.getElementById('accountNumber').textContent
     const toId = dom.getElementById('bankSelect').value


     let data = {
        from:fromId,
        to:toId,
        transValue:val
     }

             
    await axios.put(transferUrl, data, config);

    let currVal = currentBal.textContent
    currVal = parseInt(currVal)

    currVal = currVal - val
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

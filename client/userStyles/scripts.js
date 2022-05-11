const storage = window.localStorage
const dom = document

const globalState = {
    nav: ''
}

window.addEventListener('load', e => {
    //get name
    getName()


})


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
        updateUlStyle(el.target.textContent)
    })
})

function updateUlStyle(text) {
    dom.querySelectorAll('.navLi').forEach(e => {
        if (e.textContent === text) {
            e.classList += ' liHover'
        } else {
            e.classList.remove('liHover')
        }
    })
}

function logout () {
    storage.clear()
    window.location.href = '/'
}
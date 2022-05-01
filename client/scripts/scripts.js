import {login} from '../dbConnect/routes.js'

window.addEventListener('load',async e => {
    const test = await login('john@emaisl.com','testPassword')
    console.log(test)
})



window.addEventListener('load', e => {
   const sampleGet = async () => {
      const getThis = await axios.get('/api/login')
      console.log(getThis.data)
   }
   sampleGet()
})
   // const samplePost = async () => {
   //    const getThis = await axios.post('/api/login')
   //    console.log(getThis.data)
   // }

document.getElementById('test').addEventListener('click',e => {
   const samplePost = async () => {
      const getThis =  await axios.post('/api/login')
      console.log(getThis.data)
   }
    samplePost()

})


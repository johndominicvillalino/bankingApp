

const sampleGet = async () => {

   const getThis = await axios.get('/api/login')

   console.log(getThis.data)

}

sampleGet()
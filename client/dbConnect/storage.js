
const storage = window.localStorage


export const storeData = (holder,data) => {
    storage.setItem(holder,data)
}

export const getStringData = (holder) => {
    let data = storage.getItem(holder)
    return data
}

export const storeObjData = (holder,data) => {
    let updateData = JSON.stringify(data)
    storage.setItem(holder,updateData)

}

export const getStoredObjData = (holder) => {
    let data = storage.getItem(holder)
    data = JSON.parse(data)
    return data;
}
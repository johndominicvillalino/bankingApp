
const storage = window.localStorage


export const storeData = (holder,data) => {
    storage.setItem(holder,data)
}

export const getStringData = (holder) => {
    let data = storage.getItem(holder)
    return data
}
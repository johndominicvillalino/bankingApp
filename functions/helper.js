const fs = require("fs");

const getData = (filePath) => {
  let fileData = fs.readFileSync(filePath, "utf-8");
  fileData = JSON.parse(fileData)
  return fileData;
};


const updateData = (filePath,newData) => {
    let currentData = getData(filePath)
    currentData.push(newData)
    currentData = JSON.stringify(currentData)
    fs.writeFileSync(filePath,currentData, "utf-8");

    return 'done'
    
  };

  
module.exports = {
  getData,
  updateData
};

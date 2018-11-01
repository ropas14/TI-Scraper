  const fs = require('fs');
   const pdf = require('pdf-parse');
function readpdfile(path){
  let dataBuffer = fs.readFileSync(path);
        pdf(dataBuffer).then(function(data) {
            console.log(data.text);
        });
    }

    module.exports=readpdfile;

  const fs = require('fs');
   const pdf = require('pdf-parse');
function readpdfile(path){
  let dataBuffer = fs.readFileSync(path);
        pdf(dataBuffer).then(function(data) {
            console.log(data.text);
            let pdftext = data.text;
            if(pdftext.indexOf('ACTIVE')>-1){
                    console.log(pdftext.indexOf('ACTIVE'));
            }
            else{
                console.log(pdftext.indexOf('PREVIEW'));
            }
        });
    }

    module.exports=readpdfile;

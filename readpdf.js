  const fs = require('fs');
   const pdf = require('pdf-parse');
function readpdfile(path){
  let dataBuffer = fs.readFileSync(path);
        pdf(dataBuffer).then(function(data) {        
            let pdftext = data.text;
            let arrDevices = [];
            if(pdftext.indexOf('Samples')>-1){
                // remove upper unneccessary text from pdf content
               pdftext= pdftext.substring((pdftext.indexOf('Samples')+"Samples".length), pdftext.length);
                //remove bottom contents not needed
                pdftext = pdftext.split('(1)')[0].trim();
                // split each line details with a comma instead of newline
                pdftext=pdftext.replace(/\n/g,",");
                // now put each row in an array by splitting with a comma
                pdftext=pdftext.split(',');

                pdftext.forEach(function(item){
                    if(item.indexOf('ACTIVE')>-1){
                        item=item.split('ACTIVE')[0];
                        //console.log(item);
                        arrDevices.push(item);
                    }
                    else if (item.indexOf('PREVIEW')>-1){
                          item=item.split('PREVIEW')[0];
                         // console.log(item);
                          arrDevices.push(item);
                    }
                    else{}
                });
               // console.log(arrDevices);
                return arrDevices;
            }
            
        });
    }

    module.exports=readpdfile;

  // readpdfile('./pdfs/am5746_oa.pdf');

const download = require('download-pdf');
const readpdfile = require('./readpdf.js');

function downloadPdf(lnk) {
    let link = lnk;
    let pdflink = link.split('/');
    let pdfname = pdflink[pdflink.length - 1];

    var options = {
        directory: "./pdfs/",
        filename: pdfname
    }

    download(link, options, function(err) {
        if (err) { console.log("pppppppppp "+link);
        	throw err;}
        console.log("file downloaded");
        readpdfile(options.directory + options.filename);
      
    });
}

module.exports = downloadPdf
//downloadPdf('http://www.ti.com/ods/sysadd/oa/symlink/am5746_oa.pdf');


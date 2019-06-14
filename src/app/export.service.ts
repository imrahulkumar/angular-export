import { Injectable } from '@angular/core';
import * as saveAs from "file-saver";
import * as json2csv from "json2csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as _ from 'lodash';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }
/**
 * 
 * @param fileType : csv | xlsx | Pdf
 * @param arrayColKey : key of the data in format {label : NAME , value:employeName}
 * @param arryColHeader : header which is going to display in pdf [HEADER1, HEADER2, HEADER3, HEADER4]
 * @param rowData : actual array of data
 * @param fileName : name of file which is going to download
 * @param heading : First Heading in pdf
 * @param sub_heading : Second Heading in pdf
 */
  print(fileType:string,arrayColKey:Array<any>,arryColHeader:Array<any>,rowData:Array<any>,fileName:string,heading:string,sub_heading:string){
    
   this.generateCSVDownloadLinks({
      filename: fileName,
      data: rowData,
      columns: arrayColKey,
      fileType: fileType,
      rowData:rowData,
      arryColHeader:arryColHeader,
      heading:heading,
      sub_heading:sub_heading
    });
  }
 // you can move this method to a service | responsible for the downloading (saveAs, json2csv library)
 public generateCSVDownloadLinks(options: {
  filename: string;
  data: any[];
  columns: string[];
  fileType: string;
  rowData:Array<any>,
  arryColHeader:Array<any>,
  heading:string,
  sub_heading:string
}) {
  const fields = options.columns;
  const opts = { fields, output: options.filename };

try {
  const csv = json2csv.parse(options.data, opts);
  var blob = new Blob([csv], { type: "text/csv" });
  if (options.fileType == "csv") {
    saveAs(blob, options.filename + ".csv");
  }
  if (options.fileType == "xlsx") {
    saveAs(blob, options.filename + ".xlsx");
  }
} catch(err){
 console.log("json2csv::",err);
} 
  if (options.fileType == "Pdf") {
    var doc = new jsPDF();  
   doc.setFont("times");
   doc.setFontSize(22);
   doc.text(options.heading, 15, 20);
   
   doc.setFontSize(16);
   doc.text(options.sub_heading, 15, 30);    
   doc.autoTable({
      head: [options.arryColHeader],
      body: this.rowGenerator(fields, options.rowData),  
      startY: 40
    });
    doc.save(`${options.filename}.pdf`);
  }
}
rowGenerator(rowHeader, arr) {
  let row = [];
  arr.map(it => {
    let singleRow = [];
    rowHeader.forEach(key => {
      debugger
      if(key.type == "Date"){
        singleRow.push( moment(_.get(it, key.value, 'default')).format('MM/DD/YYYY') )
      }
      else{
        singleRow.push(_.get(it, key.value, 'default'))
      }      
    });
    row.push(singleRow);
  });
  return row;
}

}

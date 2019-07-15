import { Component, OnInit } from '@angular/core';
import * as XLSX from 'ts-xlsx';
import { HttpService } from '../shared/http.service';
// import { read, IWorkBook } from 'ts-xlsx';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  arrayBuffer: any;
  file: File;
  fileData;
  url = 'http://localhost:3000/employee/';
  filesOnServer;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    console.log('Inside oninit method');
    this.filesOnServer = [];

    this.httpService.getFileList().subscribe((res: Array<any>) => {
      if (res.length) {
        console.log(res);
        console.log(res[0].excelFile.split('Z')[1]);
        this.filesOnServer = res;
      }
    });

  }

  incomingfile(event) {
    this.file = event.target.files[0];
    console.log(this.file);
  }

  Upload() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const firstSheet = workbook.SheetNames[0];
      const secondSheet = workbook.SheetNames[1];
    };
    fileReader.readAsArrayBuffer(this.file);

    const formData = new FormData();

    formData.append('excelFile', this.file, this.file.name);

    this.httpService.sendExcelFile(formData).subscribe(response => {
      console.log('response');

      this.router.navigate(['/preview/' + response._id], { relativeTo: this.route });
    });
  }

  deleteFileAndData (id) {
    console.log(id);
    this.httpService.deleteFileAndData(id).subscribe(res => {
      console.log(res);
      this.ngOnInit();
    });
  }

}

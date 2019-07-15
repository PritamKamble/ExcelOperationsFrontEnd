import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getFileList() {
    return this.http.get('http://localhost:3000/upload/fileList');
  }

  sendExcelFile(data) {
    return this.http.post<any>('http://localhost:3000/upload/', data);
  }

  getExcelDataByID(id) {
    return this.http.get('http://localhost:3000/upload/' + id);
  }

  sendEmployeeData(data, id) {
    console.log('inside the send Excel function');
    data['fileID'] = id;
    console.log(data);
    return this.http.post('http://localhost:3000/upload/' + id, data);
  }

  deleteFileAndData(id){
    console.log('Calling deleteFile method');
    return this.http.delete('http://localhost:3000/upload/' + id);
  }

}

import { Component, OnInit } from '@angular/core';
import { HttpService } from '../shared/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  id = this.active.snapshot.paramMap.get('id');
  arrayBuffer: any;
  file: File;
  data: File;
  response;
  employees;
  managers;

  constructor(
    private httpService: HttpService,
    private active: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.httpService.getExcelDataByID(this.id).subscribe((res: any) => {
      this.response = res;
      this.employees = res.employees;
      this.managers = res.manager;
    });
  }

  sendEmployeeData(save) {

    if (save) {
      this.httpService.sendEmployeeData(this.response, this.id).subscribe(res => {
        console.log(res);
        this.router.navigate(['/upload']);
      });
    }
    if (!save) {
      this.httpService.deleteFileAndData(this.id).subscribe(res => {
        this.employees = [];
        this.managers = [];
        this.router.navigate(['/upload']);
      });
    }
  }

  editEmpContent(obj, event) {
    let i = 0;
    for (let key in this.response.employees[obj]) {
      if (this.response.employees[obj].hasOwnProperty(key)) {
        this.response.employees[obj][key] = event.target.parentNode.parentNode.childNodes[i].innerText;
        i++;
      }
    }
  }

  editMngContent(obj, event) {
    let i = 0;
    for (let key in this.response.manager[obj]) {
      if (this.response.manager[obj].hasOwnProperty(key)) {
        if (i === 0) {
          this.editEmpIDs(this.response.manager[obj][key], event.target.parentNode.parentNode.childNodes[i].innerText);
        }
        this.response.manager[obj][key] = event.target.parentNode.parentNode.childNodes[i].innerText;
        i++;
      }
    }
  }

  editEmpIDs(originalValue, newValue) {
    for (let i of this.response.employees) {
      if (i.mng_code === originalValue) {
        i.mng_code = newValue;
      }
    }
  }

  deleteEmpRow(obj) {
    this.response.employees.splice(obj, 1);
  }

  deleteMngRow(obj, id) {
    let flag = true;
    for (const i of this.response.employees) {
      if (i.mng_code === id) {
        console.log('cannot delete');
        flag = false;
      }
    }
    if (flag) {
      this.response.manager.splice(obj, 1);
    }
  }
}

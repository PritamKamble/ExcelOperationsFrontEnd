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
      console.log(res);
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
      console.log('Deleting file');
      this.httpService.deleteFileAndData(this.id).subscribe(res => {
        console.log(res);
        this.employees = [];
        this.managers = [];
        this.router.navigate(['/upload']);
      });
    }

  }

}

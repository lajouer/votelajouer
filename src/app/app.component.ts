import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { TblDt, Sval, QueryService } from './query.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lajouer';
  mail: string = "";
  dataSource = new MatTableDataSource();
  displayedColumns = [
    'waku',
    'riki',
    'riki2',
    'c01',
    'c02',
    'c03',
    'c04',
    'c05',
    'c06',
    'c07',
    'c08',
    'c09',
    'c10',
    'c11',
    'c12',
    'c13',
    'c14',
    'c15',
  ];

  constructor(public qrysrv: QueryService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.qrysrv.qryRikishi();
    this.qrysrv.qryWaku();
    this.route.queryParamMap.pipe(
      filter(n => Object.keys(n["params"]).length !== 0)
    ).subscribe(
      n => {
        // console.log(n);
        let params = n["params"];
        Object.keys(params).map(k => {
          if (k == "mail") {
            this.mail = params[k];
            this.getData();
          }
        })
      }
    )
  }
  getData() {
    this.qrysrv.qryMonth(this.mail);
    // this.dataSource.data = this.qrysrv.votes[0].tbls;
    // console.log(this.dataSource.data);
    // this.cdRef.detectChanges();
  }
  refresh() {
    this.dataSource.data = this.qrysrv.votes[0].tbls;
    console.log(this.dataSource.data);
    this.cdRef.detectChanges();
  }

  makeSelVal(fldnm: string): Sval[] {

    let ret: Sval[] = [];

    let yflg: boolean = false;

    this.dataSource.data.forEach((e: any) => {
      let i: number = this.qrysrv.yoko.findIndex((obj: any) => obj.sval == e[fldnm]);
      if (i > -1) {
        yflg = true;
      }
    });
    this.qrysrv.init.forEach((e: any) => {
      ret.push(e);
    });
    this.qrysrv.yoko.forEach((e: any) => {
      e.dis = yflg;
      ret.push(e);
    });

    this.qrysrv.riki.forEach((e: any) => {
      let i: number = this.dataSource.data.findIndex(
        (obj: any) => obj[fldnm] == e.sval
      );
      if (i > -1) {
        e.dis = true;
      } else {
        e.dis = false;
      }
      ret.push(e);
    });
    return ret;
  }
}
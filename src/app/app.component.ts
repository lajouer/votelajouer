import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
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
  // forms: FormArray = this.fb.array([]);
  form: FormGroup;
  mail: string = "";
  dataSource = new MatTableDataSource();
  displayedColumns = [
    'waku',
    'riki',
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
    'riki2'
  ];
  dataSource2 = new MatTableDataSource();
  displayedColumns2 = [
    'eposi',
    'ename',
    'emove',
    'e6',
    'e5',
    'e4',
    'e3',
    'e2',
    'e1',
    'wposi',
    'wname',
    'wmove',
    'w6',
    'w5',
    'w4',
    'w3',
    'w2',
    'w1'
  ];

  constructor(public qrysrv: QueryService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    let rows: FormArray = this.fb.array([]);
    this.form = this.fb.group({
      comp: new FormControl(''),
      cust: new FormControl(''),
      name: new FormControl(''),
      mtbl: rows
    });
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

    this.qrysrv.observe.subscribe(number => {
      this.form = this.qrysrv.frmCur;
      this.dataSource.data = this.qrysrv.frmArr.controls;
      this.dataSource2.data = this.qrysrv.list;
      this.cdRef.detectChanges();
    });

  }

  updKana(value: string) {
    let val = this.qrysrv.convKana(value);
    // console.log(value,val);
    this.form.get('name').setValue(val);
  }

  getData() {
    this.qrysrv.qryMonth(this.mail);
    // console.log(this.qrysrv.end, new Date());
    history.replaceState('', '', './?mail=' + this.mail);
  }

  setPrev() { //前へ
    this.qrysrv.cur -= 1;  //現在番号をカウントダウン
    this.qrysrv.subject.next(this.qrysrv.cur);  //画面を更新
  }
  setNext() { //次へ
    // console.log(this.form.dirty);
    if (this.form.dirty) {
      this.qrysrv.updTran(); //変更があった場合だけ、保存する
    }
    this.qrysrv.cur += 1;  //現在番号をカウントアップ
    this.qrysrv.subject.next(this.qrysrv.cur); //画面を更新
  }
  makeSelVal(j: number): Sval[] {
    let ret: Sval[] = [];

    let tmp = [];
    let yflg: boolean = false;
    this.dataSource.data.forEach((e: any) => {
      if (e.getRawValue().riki) {
        tmp.push({ riki: e.getRawValue().riki });
        let i: number = this.qrysrv.yoko.findIndex((obj: any) => obj.sval == e.getRawValue().riki);
        if (i > -1 && e.getRawValue().riki != this.qrysrv.frmArr.getRawValue()[j].riki) {
          yflg = true;
        }
      }

    });
    this.qrysrv.yoko.forEach((e: any) => {
      e.dis = yflg;
      ret.push(e);
    });

    this.qrysrv.riki.forEach((e: any) => {
      let i: number = tmp.findIndex(
        (obj: any) => obj.riki == e.sval
      );
      if (i > -1 && e.sval != this.qrysrv.frmArr.getRawValue()[j].riki) {
        e.dis = true;
      } else {
        e.dis = false;
      }
      ret.push(e);
    });
    return ret;
  }
}
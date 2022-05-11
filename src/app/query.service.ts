import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';

export class Sval {
  sval: string;
  viewval: string;
  dis: boolean;
}

export class TblDt {
  waku: string;
  riki: string;
  riki2: string;
  c01: string;
  c02: string;
  c03: string;
  c04: string;
  c05: string;
  c06: string;
  c07: string;
  c08: string;
  c09: string;
  c10: string;
  c11: string;
  c12: string;
  c13: string;
  c14: string;
  c15: string;
}

export class List {
  wname: string;
  wmove: string;
  w1: string;
  w2: string;
  w3: string;
  w4: string;
  w5: string;
  w6: string;
  wposi: string;
  ename: string;
  emove: string;
  e1: string;
  e2: string;
  e3: string;
  e4: string;
  e5: string;
  e6: string;
  eposi: string;
  // rspan: number;
  constructor(init?: Partial<List>) {
    Object.assign(this, init);
  }
}

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  public month: string = "";
  public yoko: Sval[] = [];
  public riki: Sval[] = [];
  public list: List[] = [];
  public waku = [];
  public tblDt = [];
  public forms: FormArray = this.fb.array([]);
  public cnt: number = 0;
  public cur: number = 0;
  public buy: string = "";
  public subject = new Subject<number>();
  public observe = this.subject.asObservable();
  constructor(private apollo: Apollo,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  qryMonth(pmail: string): void {
    const GetMast = gql`
    query get_month($mail: String!) {
      msmonth(order_by: {month: desc_nulls_last}, offset: 0, limit: 1) {
        month
        trvotes(where: {mail: {_eq: $mail}},order_by: {customerid: asc_nulls_last}) {
          month
          orderid
          customerid
          goodsid
          introducerid
          mail
          name
          riki10i
          riki10c
          riki09i
          riki09c
          riki08i
          riki08c
          riki07i
          riki07c
          riki06i
          riki06c
          riki05i
          riki05c
          riki04i
          riki04c
          riki03i
          riki03c
          riki02i
          riki02c
          riki01i
          riki01c
          riki00i
          riki00c
        }
      }
    }`;
    this.apollo.watchQuery<any>({
      query: GetMast,
      variables: {
        mail: pmail
      },
    })
      .valueChanges
      .subscribe(({ data }) => {

        this.month = data.msmonth[0].month;
        this.cnt = data.msmonth[0].trvotes.length;
        for (let i = 0; i < this.cnt; i++) {
          const trvote = data.msmonth[0].trvotes[i];
          let tmp: string = trvote.customerid.toString();
          let rows: FormArray = this.fb.array([]);
          for (let j = 10; j > -1; j--) {
            const waku: string = ('00' + j).slice(-2);
            let row = this.waku.filter(e => e.waku == waku);
            rows.push(this.createRow(row[0], trvote['riki' + waku + 'i'], trvote['riki' + waku + 'c']));
          }
          let form = this.fb.group({
            comp: new FormControl({ value: tmp.slice(0, 4), disabled: true }),
            cust: new FormControl({ value: tmp.slice(-4), disabled: true }),
            name: new FormControl(trvote.name),
            mtbl: rows
          });
          this.forms.push(form);
        }
        this.cur = 1;
        this.subject.next(this.cur);
      }, (error) => {
        console.log('error get_month', error);
      });
  }
  createRow(row, riki, riki2) {
    return this.fb.group({
      waku: new FormControl({ value: row.waku, disabled: true }),
      riki: new FormControl(riki, Validators.required),
      riki2: new FormControl({ value: riki2, disabled: true }),
      c01: new FormControl({ value: row.c01, disabled: true }),
      c02: new FormControl({ value: row.c02, disabled: true }),
      c03: new FormControl({ value: row.c03, disabled: true }),
      c04: new FormControl({ value: row.c04, disabled: true }),
      c05: new FormControl({ value: row.c05, disabled: true }),
      c06: new FormControl({ value: row.c06, disabled: true }),
      c07: new FormControl({ value: row.c07, disabled: true }),
      c08: new FormControl({ value: row.c08, disabled: true }),
      c09: new FormControl({ value: row.c09, disabled: true }),
      c10: new FormControl({ value: row.c10, disabled: true }),
      c11: new FormControl({ value: row.c11, disabled: true }),
      c12: new FormControl({ value: row.c12, disabled: true }),
      c13: new FormControl({ value: row.c13, disabled: true }),
      c14: new FormControl({ value: row.c14, disabled: true }),
      c15: new FormControl({ value: row.c15, disabled: true }),
    });
  }

  qryRikishi(): void {
    const GetMast = gql`
    query get_rikishi {
      msrikishi(order_by: {riki: asc}) {
        riki
        name
        move
        posi
        pastcnt1
        pastpos1
        pastcnt2
        pastpos2
        pastcnt3
        pastpos3
        pastcnt4
        pastpos4
        pastcnt5
        pastpos5
        pastcnt6
        pastpos6
      }
    }`;
    this.apollo.watchQuery<any>({
      query: GetMast
    })
      .valueChanges
      .subscribe(({ data }) => {
        let row1: List = new List();
        for (let i = 0; i < data.msrikishi.length; i++) {
          const row = data.msrikishi[i];
          if (row.posi == '横綱' || row.posi == '大関') {
            this.yoko.push({ sval: row.riki, viewval: row.posi + row.name, dis: false });
          } else {
            this.riki.push({ sval: row.riki, viewval: row.name, dis: false });
          }
          if (row.riki % 2 == 1) {
            this.list.push(row1);
            row1 = new List();
            row1.wname = row.name;
            row1.wmove = row.move;
            row1.wposi = row.posi;
            row1.w1 = row.pastpos1 + '\n' + row.pastcnt1;
            row1.w2 = row.pastpos2 + '\n' + row.pastcnt2;
            row1.w3 = row.pastpos3 + '\n' + row.pastcnt3;
            row1.w4 = row.pastpos4 + '\n' + row.pastcnt4;
            row1.w5 = row.pastpos5 + '\n' + row.pastcnt5;
            row1.w6 = row.pastpos6 + '\n' + row.pastcnt6;
          } else {
            row1.ename = row.name;
            row1.emove = row.move;
            row1.eposi = row.posi;
            row1.e1 = row.pastpos1 + '\n' + row.pastcnt1;
            row1.e2 = row.pastpos2 + '\n' + row.pastcnt2;
            row1.e3 = row.pastpos3 + '\n' + row.pastcnt3;
            row1.e4 = row.pastpos4 + '\n' + row.pastcnt4;
            row1.e5 = row.pastpos5 + '\n' + row.pastcnt5;
            row1.e6 = row.pastpos6 + '\n' + row.pastcnt6;
          }
        }
        this.list.push(row1);
        this.list.shift();
      }, (error) => {
        console.log('error get_rikishi', error);
      });
  }
  qryWaku(): void {
    const GetMast = gql`
    query get_waku {
      msstar(order_by: {waku: desc}) {
        waku
        c01
        c02
        c03
        c04
        c05
        c06
        c07
        c08
        c09
        c10
        c11
        c12
        c13
        c14
        c15
      }
    }`;
    this.apollo.watchQuery<any>({
      query: GetMast
    })
      .valueChanges
      .subscribe(({ data }) => {
        this.waku = data.msstar;
      }, (error) => {
        console.log('error get_star', error);
      });
  }
  get frmCur(): FormGroup {
    // return this.forms.at(i); 
    return this.forms.controls[this.cur - 1] as FormGroup;
  }
  get frmArr(): FormArray {
    // console.log(this.parentForm);    
    return this.frmCur.get('mtbl') as FormArray;
  }
  updTran() {
    const current: number = this.cur;
    const UpdateTran = gql`
      mutation upd_hatden($month: String!, $comcusid: Int!,$_set:trvote_set_input!) {
        update_trvote(where: {month: {_eq:$month},customerid: {_eq:$comcusid}}, _set: $_set)  {
          affected_rows
        } 
      }`;
    let trvote = {
      name: this.frmCur.value.name
    }
    for (let j = 0; j < 11; j++) {
      console.log();
      trvote['riki' + this.frmArr.getRawValue()[j].waku + 'i'] = this.frmArr.getRawValue()[j].riki;
    }
    this.apollo.mutate<any>({
      mutation: UpdateTran,
      variables: {
        month: this.month,
        comcusid: this.frmCur.getRawValue().comp + this.frmCur.getRawValue().cust,
        _set: trvote
      },
    }).subscribe(({ data }) => {
      this.toastr.success(current + ' 口目を保存しました');
    }, (error) => {
      console.log('error upd trvote', error);
    });
    // console.log(this.getCurForm(this.cur - 1));
  }
}

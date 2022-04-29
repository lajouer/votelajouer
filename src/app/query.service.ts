import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
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
export class Vote {
  comp: string;
  cust: string;
  name: string;
  tbls: TblDt[];
  constructor(init?: Partial<Vote>) {
    Object.assign(this, init);
  }
}


@Injectable({
  providedIn: 'root'
})
export class QueryService {
  public month: string = "";
  public init: Sval[] = [{ sval: null, viewval: '', dis: false }];
  public yoko: Sval[] = [];
  // zeki: Sval[];
  public riki: Sval[] = [];
  public waku = [];
  public tblDt = [];
  public votes: Vote[] = [];
  public vote = new Vote();
  constructor(private apollo: Apollo) { }

  qryMonth(pmail: string): void {
    const GetMast = gql`
    query get_month($mail: String!) {
      msmonth(order_by: {month: desc_nulls_last}, offset: 0, limit: 1) {
        month
        trlajouers(where: {mail: {_eq: $mail}}) {
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
        let tmp: string = data.msmonth[0].trlajouers[0].customerid.toString();
        let lcvote: Vote = {
          comp: tmp.slice(0, 4),
          cust: tmp.slice(-4),
          name: "",
          tbls: this.setTbl(data.msmonth[0].trlajouers[0])
        };
        this.votes.push(lcvote);
        this.vote = lcvote;
        // console.log(data.msmonth[0].trlajouers);
      }, (error) => {
        console.log('error get_month', error);
      });
  }
  setTbl(trlaj) {
    let tbl = [];
    for (let i = 10; i > -1; i--) {
      const waku: string = ('00' + i).slice(-2);
      let row = this.waku.filter(e => e.waku == waku);
      tbl.push({ ...row[0], riki: trlaj['riki' + waku + 'i'], riki2: trlaj['riki' + waku + 'c'] });
    }
    // console.log(tbl);
    return tbl;
  }
  qryRikishi(): void {
    const GetMast = gql`
    query get_rikishi {
      msrikishi(order_by: {riki: asc}) {
        riki
        name
        posi
      }
    }`;
    this.apollo.watchQuery<any>({
      query: GetMast
    })
      .valueChanges
      .subscribe(({ data }) => {
        for (let i = 0; i < data.msrikishi.length; i++) {
          const row = data.msrikishi[i];
          if (row.posi == '横綱' || row.posi == '大関') {
            this.yoko.push({ sval: row.riki, viewval: row.posi + row.name, dis: false });
          } else {
            this.riki.push({ sval: row.riki, viewval: row.name, dis: false });
          }
        }
        // console.log(this.yoko, this.riki);
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
}

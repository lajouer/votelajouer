import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'waku'
})
export class WakuPipe implements PipeTransform {

  transform(value: any): any {
    if (value === "00") {
      return "控";
    } else {
      return +value + "点";
    }
  }

}

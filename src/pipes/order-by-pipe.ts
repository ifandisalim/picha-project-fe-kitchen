import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the OrderByPipe pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'orderByPipe'
})
@Injectable()
export class OrderByPipe {
  /*
    Takes a value and makes it lowercase.
   */
  transform(array: Array<string>, args: string): Array<string> {

    if(!array || array === undefined || array.length === 0) return null;

    array.sort((a: any, b: any) => {
      if (a.due_datetime > b.due_datetime) {
        return -1;
      } else if (a.due_datetime < b.due_datetime) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}

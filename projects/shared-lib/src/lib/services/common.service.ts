import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  sortAz(array: any, attr: string, isAsc = true) {
    return array.sort((a, b) =>
      (a[attr] < b[attr] ? -1 : 1) * (isAsc ? 1 : -1)
    );
  }
}

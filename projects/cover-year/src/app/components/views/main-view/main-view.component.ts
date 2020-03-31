import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cy-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {
  year: any;

  constructor() { }

  ngOnInit(): void {
    this.year = window.location.pathname.match(/\d{4}/g);

    this.year = this.year ? parseInt(this.year[0], 10) : (new Date()).getFullYear();
  }

}

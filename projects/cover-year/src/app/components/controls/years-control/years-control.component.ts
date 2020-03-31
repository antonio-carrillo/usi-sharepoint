import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { SharepointIntegrationService, MessageService } from 'shared-lib';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cy-years-control',
  templateUrl: './years-control.component.html',
  styleUrls: ['./years-control.component.scss']
})
export class YearsControlComponent implements AfterViewInit, OnInit {
  @Input() year: number;
  years = [];

  constructor(
    private message: MessageService,
    private sis: SharepointIntegrationService
  ) { }

  ngAfterViewInit() {
    this.loadData();
  }

  ngOnInit(): void {
  }

  // Custom private methods

  private loadData() {
    const data = {
      select: ['anio'],
      orderBy: 'anio'
    };
    const pathName = window.location.pathname;
    const hasYear = pathName.match(/\d{4}$/) !== null;

    this.sis.read(environment.sharepoint.listName, data).subscribe(
      (response: any) => {
        const years = [];

        response.value.forEach(r => {
          if (years.indexOf(r.anio) === -1) {
            years.push(r.anio);

            this.years.push({
              link: hasYear ? pathName.replace(/\d{4}$/, r.anio) : `${pathName}/${r.anio}`,
              year: parseInt(r.anio, 10)
            });
          }
        });
      },
      err => this.message.genericHttpError(err)
    );
  }

}

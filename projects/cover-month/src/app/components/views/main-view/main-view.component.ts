import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { MessageService, SharepointIntegrationService } from 'shared-lib';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cm-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {
  covers = [];
  loading = true;
  month: string;
  year: number;

  constructor(
    private message: MessageService,
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit(): void {
    const today = this.getDate();
    const from = new Date(today.year, today.month - 1, 1); // Month is 0 based
    const to = new Date(today.year, today.month, 1);

    this.month = MONTHS[today.month - 1];
    this.year = today.year;

    this.loadData(from, to);
  }

  // Private custom methods

  private getDate() {
    const now = new Date();
    const urlDate: any = window.location.pathname.match(/\d{4}\/\d{1,2}/g);
    let month: number;
    let year: number;

    if (urlDate) {
      const dateArray = urlDate[0].split('/');

      month = parseInt(dateArray[1], 10);
      year = parseInt(dateArray[0], 10);
    } else {
      month = now.getMonth();
      year = now.getFullYear();
    }

    return { month, year };
  }

  private loadData(from: Date, to: Date) {
    const data = {
      select: ['Created', 'Fechanoticia', 'Id', 'Imagen', 'Title'],
      filter: [
        `Fechanoticia ge datetime'${from.toISOString()}'`,
        `Fechanoticia le datetime'${to.toISOString()}'`
      ],
      orderBy: 'Fechanoticia'
    };

    this.sis.read(environment.sharepoint.listName, data)
      .pipe(
        map((response: any) => response.value.map(r => ({
          created: r.Created,
          id: r.Id,
          image: r.Imagen,
          title: r.Title,
          url: `${environment.redirectUrl}/${r.Id}`
        })))
      )
      .subscribe(
        response => this.covers = response,
        err => this.message.genericHttpError(err),
        () => this.loading = false
      );
  }

}

export const MONTHS: string[] = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { SharepointIntegrationService } from 'shared-lib';
import { MainTableDataSource } from '../datasources/main-table.datasource';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainTableService {
  dataSource: MainTableDataSource;

  constructor(
    private sis: SharepointIntegrationService
  ) {
    this.dataSource = new MainTableDataSource();
  }

  clearAll() {
    this.dataSource.clearAll();
  }

  loadData() {
    const data = {
      select: ['Id', 'Principal', 'Title', 'Created', 'Descripcion', 'Enlace_1', 'Enlace_2',
      'Enlace_3', 'TtiuloEnlace1', 'TtiuloEnlace2', 'TtiuloEnlace3', 'Imagen',
      'CV', 'Mensaje', 'Orden', 'PalabrasClave'],
      top: 5000
    };
    const datePipe = new DatePipe('en-US');

    return this.sis.read(environment.sharepoint.listName, data)
      .pipe(
        map((response: any) => {
          return response.value.map(r => {

            if (!r.PalabrasClave)
              r.PalabrasClave = '';

            const item: any = {
              principal: r.Principal,
              created: new Date(r.Created),
              id: r.Id,
              title: r.Title,
              image: r.Imagen ? {data: r.Imagen, name: 'Imagen', type: 'image/png'} : null,
              description: r.Descripcion,
              order: String(r.Orden),
              content: r.CV,
              message: r.Mensaje,
              linkUrl1: r.Enlace_1,
              linkUrl2: r.Enlace_2,
              linkUrl3: r.Enlace_3,
              linkTitle1: r.TtiuloEnlace1,
              linkTitle2: r.TtiuloEnlace2,
              linkTitle3: r.TtiuloEnlace3,
              keywords: r.PalabrasClave
            };

            item.createdLabel = datePipe.transform(item.created, 'yyyy-MM-dd hh:mm a');

            return item;
          });
        }),
        tap((response: any) => {
          this.dataSource.replaceAll(response);
        })
      );
  }
}

import { DatePipe } from '@angular/common';
import { EventEmitter, Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { SharepointIntegrationService } from 'shared-lib';
import { MainTableDataSource } from '../datasources/main-table.datasource';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainTableService {
  countEvent = new EventEmitter();
  dataSource: MainTableDataSource;

  constructor(
    private sis: SharepointIntegrationService
  ) {
    this.dataSource = new MainTableDataSource();
  }

  getAll() {
    return this.dataSource.getAll();
  }

  clearAll() {
    this.dataSource.clearAll();
  }

  loadData() {
    const data = {
      select: ['Enlace', 'Id', 'Imagen', 'Title', 'Tipodered', 'Created'],
      top: 5000
    };
    const datePipe = new DatePipe('en-US');

    return this.sis.read(environment.sharepoint.listName, data)
      .pipe(
        map((response: any) => {
          return response.value.map(r => {
            const item: any = {
              created: new Date(r.Created),
              id: r.Id,
              image: {
                data: r.Imagen,
                name: 'Archivo',
                type: 'image/png'
              },
              title: r.Title,
              type: r.Tipodered,
              url: r.Enlace
            };

            item.createdLabel = datePipe.transform(item.created, 'yyyy-MM-dd hh:mm a');

            return item;
          });
        }),
        tap((response: any) => {
          this.dataSource.replaceAll(response);
          this.countEvent.emit(response.length);
        })
      );
  }
}

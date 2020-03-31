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
      select: ['Cargotitular', 'CV', 'Dependencia', 'Enlace', 'Enlace1', 'Enlace2', 'Enlace3', 'Id', 'Imagen', 'Keywords',
        'Nombre1', 'Nombre2', 'Nombre3', 'NombreImagen', 'Tipodegabinete', 'Title', 'Created'],
      top: 5000
    };
    const datePipe = new DatePipe('en-US');

    return this.sis.read(environment.sharepoint.listName, data)
      .pipe(
        map((response: any) => {
          return response.value.map(r => {
            const item: any = {
              created: new Date(r.Created),
              curriculum: r.CV,
              dependencyTitle: r.Dependencia,
              id: r.Id,
              image: {
                data: r.Imagen,
                name: r.NombreImagen,
                type: 'image/png'
              },
              keywords: r.Keywords,
              names: [],
              position: r.Cargotitular,
              title: r.Title,
              type: r.Tipodegabinete,
              url: r.Enlace
            };

            for (let i = 0, j = 3; i < j; i++) {
              item.names.push({
                link: r[`Enlace${i + 1}`],
                name: r[`Nombre${i + 1}`]
              });
            }

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

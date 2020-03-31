import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CommonService, SharepointIntegrationService } from 'shared-lib';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cy-covers-view',
  templateUrl: './covers-view.component.html',
  styleUrls: ['./covers-view.component.scss']
})
export class CoversViewComponent implements AfterViewInit, OnInit {
  covers$: Observable<any>;
  loading = true;
  @Input() year;

  constructor(
    private common: CommonService,
    private sis: SharepointIntegrationService
  ) { }

  ngAfterViewInit() {
    this.covers$ = this.loadData(this.year);
  }

  ngOnInit(): void {
  }

  // Private custom methods

  private loadData(year: number) {
    const data = {
      select: ['Created', 'Id', 'Imagen', 'mesN', 'Title'],
      filter: [`anio eq ${year}`]
    };

    return this.sis.read(environment.sharepoint.listName, data)
      .pipe(
        map((response: any) => response.value.map(r => ({
          created: r.Created,
          id: r.Id,
          image: r.Imagen,
          month: r.mesN,
          title: r.Title,
          url: `${environment.redirectUrl}/${year}/${r.mesN}`
        }))),
        map(response => this.common.sortAz(response, 'month')),
        tap(() => this.loading = false)
      );
  }

}

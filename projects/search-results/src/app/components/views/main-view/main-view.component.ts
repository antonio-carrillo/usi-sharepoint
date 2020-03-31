import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MessageService, SharepointIntegrationService } from 'shared-lib';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'sr-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {
  data: any = [];
  loading = true;

  constructor(
    private message: MessageService,
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit(): void {
    const search = window.location.pathname.split('/');

    this.loadData(search[search.length - 1]);
  }

  // Custom private methods

  private loadData(search: string) {
    const requests = [];

    environment.sources.forEach(s => {
      requests.push(this.sis.read(s.listName, {
        select: ['Created', 'Id', 'Title'],
        filter: s.fields.map(f => `substringof('${search}', ${f})`)
      }));
    });

    forkJoin(requests)
      .subscribe(
        (response: any) => response.forEach((r, rIndex) => r.value.forEach(n => {
          this.data.push({
            created: new Date(n.Created),
            id: n.Id,
            label: environment.sources[rIndex].label,
            title: n.Title,
            url: `${environment.sources[rIndex].rediretUrl}/${n.Id}`
          });
        })),
        err => this.message.genericHttpError(err),
        () => this.loading = false
      );
  }

}

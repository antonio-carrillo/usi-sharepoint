import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SharepointIntegrationService } from 'shared-lib';
// import { DatePipe } from '@angular/common';
// import { forkJoin } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  social: any;
  loadEnded = false;
  facebooks: any;
  twitters: any;

  urlFb = 'https://www.facebook.com/plugins/page.php?href';

  constructor(
    private sis: SharepointIntegrationService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
     this.loadData();
  }

  private loadData() {
    const data = {
      select: ['Id', 'Title', 'Tipodered', 'Enlace', 'Imagen'],
    };

    this.sis.read('Redessociales', data)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            let fbPrefix = 'https://www.facebook.com/plugins/page.php?href=';
            let fbSufix = '&amp;tabs=timeline%2C%20events%2C%20messages&amp;width=530&amp;height=500&amp;small_header=false&amp;adapt_container_width=true&amp;hide_cover=false&amp;show_facepile=true&amp;appId'; // width=100&amp;
            let framePrefix = '<iframe style="max-width: 530px; border: none; overflow: hidden;" allow="encrypted-media" xml="lang" src="' + fbPrefix;
            let frameSufix = fbSufix + '" width="530" height="500" frameborder="0" scrolling="no"></iframe>';

            // let fbEmbed = '%2F&amp;tabs=timeline&amp;width=388&amp;height=220&amp;small_header=true&amp;adapt_container_width=true&amp;hide_cover=false&amp;show_facepile=false&amp;appId=424152677979292';
            return {
              id: r.Id,
              image: r.Imagen,
              title: r.Title,
              type: r.Tipodered,
              twUrl: this.sanitizer.bypassSecurityTrustResourceUrl(r.Enlace),
              fbUrl: this.sanitizer.bypassSecurityTrustHtml(`${framePrefix}${r.Enlace}${frameSufix}`), // <!-- " -->
            };
          })
        )
      )
      .subscribe(response => {
        this.facebooks = [];
        this.twitters = [];

        response.forEach(network => {
          if (network.type.toLowerCase() == 'facebook')
            this.facebooks.push(network);
          else if (network.type.toLowerCase() == 'twitter')
            this.twitters.push(network);

          console.log('Facebooks');
          console.log(this.facebooks);

          console.log('Twitters');
          console.log(this.twitters);
        });

        this.social = this.facebooks || this.twitters;
      },
      err => console.log(err),
      () => {}
      );
  }

  ngAfterViewInit (): void {
    this.loadEnded = true;
  }
}

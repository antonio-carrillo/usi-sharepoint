import { Component, NgModule, OnInit } from '@angular/core';

import { SharepointIntegrationService } from 'shared-lib';

import { environment } from "../environments/environment";

@Component({
  selector: 'gw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'governor-webpart';
  button = {
    onMessage: false,
    isDisplayed: () => { return this.principal.content && this.principal.message; }
  };
  principal: {
    title: string,
    image: string,
    description: string,
    links: [
      {url: string, title: string},
      {url: string, title: string},
      {url: string, title: string}
    ],
    content: string,
    message: string
  };

  constructor(
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    const data = {
      select: ['Title', 'Descripcion', 'Enlace_1', 'Enlace_2',
      'Enlace_3', 'TtiuloEnlace1', 'TtiuloEnlace2', 'TtiuloEnlace3', 'Imagen',
      'CV', 'Orden', 'PalabrasClave', 'Principal', 'Mensaje'],
      filter: ['Principal ne ' + false, 'Principal ne ' + null],
      top: 1
    };
    this.sis.read(environment.sharepoint.listName, data)
    .subscribe((response: any) => {
      if(response.value.length > 0) {
        let element = response.value[0];

        this.principal = {
          title: element.Title,
          image: element.Imagen,
          description: element.Descripcion,
          links: [
            {
              url: element.Enlace_1,
              title: element.TtiuloEnlace1
            },
            {
              url: element.Enlace_2,
              title: element.TtiuloEnlace2
            },
            {
              url: element.Enlace_3,
              title: element.TtiuloEnlace3
            }
          ],
          content: element.CV,
          message: element.Mensaje
        };
        if (!this.button.isDisplayed() && this.principal.message)
          this.button.onMessage = true;
      }
    }); // read
  }

  changeContent() {
    this.button.onMessage = !this.button.onMessage;
  }

  someLink() {
    let links = false;

    this.principal.links.forEach(link => {
      if (link.title && link.url)
        links = true;
    });

    return links;
  }
}

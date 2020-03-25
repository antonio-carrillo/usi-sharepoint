import { Component, NgModule, OnInit, ViewChild } from '@angular/core';

import { SharepointIntegrationService } from 'shared-lib';
import { environment } from "../environments/environment";

import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'ncw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  htmlData: any;
  private local = false;
  whitoutImages = true;
  title = 'news-content';
  content = {
    id: 0,
    title: '',
    image: '',
    description: '',
    news: '',
    contentImage: '',
    briefDescription: '',
    date: null,
    images: ['', '', '', '', '', '', '', ''],
    month: '',
    points: ['', ''],
    video: false,
    url: '',
    createdDescription: '',
    createdYear: 0
  }
  pages = {
    next: 0,
    previous: 0
  };
  request = {
    id: 0
  };
  currentUrl: string;

  constructor(
    private sis: SharepointIntegrationService,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    let endIndicator = 'Noticias.aspx';
    let href = window.location.href;

    // ID de la noticia solicitada
    this.currentUrl = window.location.href;
    let end = href.lastIndexOf(endIndicator);
    let idFromHref = href.substring(end + endIndicator.length);
    idFromHref = this.obtenId(idFromHref);

    // Si no es un ID válido, el contenido es nulo.
    if (isNaN(Number(idFromHref))) {
      this.content = null;
    // Si es un ID válido, consultar SharePoint.
    } else {
      console.log('Number');
      console.log(idFromHref);

      this.request.id = Number(idFromHref);
      const data = {
        select: ['ID',
          'Title',
          'Imagen', // base64
          'Imagen1',
          'Imagen2',
          'Imagen3',
          'Imagen4',
          'Imagen5',
          'Imagen6',
          'Imagen7',
          'Imagen8',
          'Descripcion', // str
          'Noticia', // html
          'Imagencontenido',
          'Descripcioncorta',
          'Fechanoticia', // date
          'Mes',
          'punto1',
          'punto2',
          'video', // bool
          'url',
          'descripcionCreado',

          'Created'
        ],
        filter: ['ID eq ' + this.request.id],
        top: 1
      };
      this.sis.read(environment.sharepoint.listName, data)
      .subscribe((response: any) => {

        let result = response.value[0];

        // Si no hay resultado el contenido debe ser nulo.
        if (!result) {
          this.content = null;
        // Si sí hay resultado, guardar todo en `content` para desplegarlo.
        } else {
          this.content = {
            id: this.neverNull(result.ID),
            description: this.neverNull(result.Descripcion),
            briefDescription: this.neverNull(result.Descripcioncorta),
            date: this.neverNull(this.formatDate(result.Fechanoticia)),
            image: this.neverNull(result.Imagen),
            images: null,
            news: this.neverNull(result.Noticia),
            title: this.neverNull(result.Title),

            createdDescription: this.neverNull(result.descripcionCreado),

            month: this.neverNull(result.Mes),
            url: this.neverNull(result.url),
            contentImage: this.neverNull(result.Imagencontenido),
            video: this.neverNull(result.video, false),
            points: [
              this.neverNull(result.punto1),
              this.neverNull(result.punto2)],
            createdYear: (new Date(result.Created)).getFullYear()
          };

          // Captura de imágenes
          const data2 = {
            select: [
              'NoImagen',
              'Imagen'
            ],
            filter: ['IdNoticia eq ' + this.request.id],
            orderBy: 'NoImagen',
            top: 30
          };

          let listaImagenes = 'NoticiasIm' + this.content.createdYear;
          console.log('Lista a consultar:');
          console.log(listaImagenes);

          this.sis.read(listaImagenes, data2)
          .subscribe((response2: any) => {
            console.log('Respuesta:');
            console.log(response2);
            let imagenes = ['', '', '', '', '', '', '', ''];

            for (let imagen = 0; imagen < response2.value.length; imagen++) {
              const element = response2.value[imagen];
              console.log('NoImagen: ' + element.NoImagen);
              if (!imagenes[element.NoImagen])
                imagenes[element.NoImagen] = element.Imagen;
            }

            this.content.images = imagenes;

            // Después de ya capturar las imágenes
            for (const imagen in this.content.images)
            if (imagen) {
              this.whitoutImages = false;
              break;
            }

            console.log('Imagenes:');
            console.log(this.content.images);
          });

          this.setUrl(result.video, result.url);
        }

      }); // response

      this.nextId();
    }

    console.log('Imagenes:');
    console.log(this.content.images);
  }

  // Custom methods

  private nextId() {
    const data = {
      select: ['ID'],
      orderBy: 'ID',
      top: 50000
    };

    this.sis.read(environment.sharepoint.listName, data)
    .subscribe((response: any) => {

      response.value.forEach(element => {
        if (this.pages.next == 0 && element.ID > this.request.id)
          this.pages.next = element.ID;
        if (element.ID < this.request.id)
          this.pages.previous = element.ID;
      });

      if (this.pages.next == 0)
        this.pages.next = response.value[0].ID;
      if (this.pages.previous == 0)
        this.pages.previous = response.value[response.value.length - 1].ID;
    });
  }

  private formatDate(date) {
    if (date === null)
      return '';
    else {
      let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      let onlyWeekday = {
        weekday: 'long'
      };

      if (typeof date == 'string')
        date = new Date(date);

      let weekday = date.toLocaleDateString('es-MX', onlyWeekday);
      let text = date.toLocaleDateString('es-MX', options);

      weekday = weekday[0].toUpperCase() + weekday.substring(1);

      return weekday + ' ' + text;
    }
  }

  neverNull(variable, defaultValue: any = '') {
    if (this.content === null || variable === null)
      return defaultValue;
    else
      return variable;
  }

  obtenId(parteUrl) {
    if (parteUrl.length >= 2) {
      if (parteUrl[0] == '/')
        parteUrl = parteUrl.substring(1);

      let fin = parteUrl.length;
      for (let caracter = 0; caracter < parteUrl.length; caracter++)
        if (parteUrl[caracter] == '?' || parteUrl[caracter] == '#' || parteUrl[caracter] == '/') {
          fin = caracter;
          break;
        }

        parteUrl = parteUrl.substring(0, fin);
    }

    return parteUrl;
  }

  setUrl(video, url) {
    console.log('Video: ' + video);
    console.log('URL: ' + url);

    if (video) {
      let youtubeBaseUrls = ['youtube.com/watch?v=', 'youtu.be/'];
      let origin = 0;

      // Youtube
      youtubeBaseUrls.forEach(element => {
        if (url.indexOf(element) != -1)
          origin = 1;
      });

      if (origin == 1) { // YouTube
        let idCharacters = 11;
        let id = '';

        youtubeBaseUrls.forEach(element => {
          if (url.indexOf(element) != -1) {
            let inicio = url.indexOf(element) + element.length;
            id = url.substring(inicio, inicio + 11);
          }
        });
        if (id) {
          let style = 'width: 40vw; margin: auto; height: 27vw; '
          this.htmlData = this.sanitizer.bypassSecurityTrustHtml('<iframe src="https://www.youtube.com/embed/' + id + '" id="player" type="text/html" frameborder="0" style="' + style +'"></iframe>');
        }
      } else
        this.htmlData = this.sanitizer.bypassSecurityTrustHtml('<iframe src="' + url + '"></iframe>');

    }
  }
}

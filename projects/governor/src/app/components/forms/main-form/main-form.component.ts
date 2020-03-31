import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap, map } from 'rxjs/operators';
import { FormsService, SharepointIntegrationService, ImageUploadControlComponent } from 'shared-lib';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { environment } from '../../../../environments/environment';
import { MainTableService } from '../../../services/main-table.service';
import { of, forkJoin } from 'rxjs';

@Component({
  selector: 'ce-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss']
})
export class MainFormComponent implements OnInit {
  @Input() data: any;
  @ViewChild('image') iucc: ImageUploadControlComponent;
  flags = {
    loadingFields: true
  };
  maincheck = false;
  selected = 0;
  public Editor = ClassicEditor;
  public EditorMensaje = ClassicEditor;
  private isNew: boolean;
  mainForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private fs: FormsService,
    private sis: SharepointIntegrationService,
    private mts: MainTableService
  ) { }

  ngOnInit() {
    this.isNew = this.data ? false : true;

    this.setupForm();
  }

  // Custom public methods

  disableFields() {
    this.fs.disableFields(this.mainForm);
  }

  enableFields() {
    this.fs.enableFields(this.mainForm);
  }

  submit() {
    const values = this.mainForm.value;

    const data: any = {
      __metadata: environment.sharepoint.metadata,
      Title: this.checkNull(values.title),
      Imagen: values.image ? values.image.data : '',
      Descripcion: this.checkNull(values.description),
      Enlace_1: this.checkNull(values.linkUrl1),
      Enlace_2: this.checkNull(values.linkUrl2),
      Enlace_3: this.checkNull(values.linkUrl3),
      TtiuloEnlace1: this.checkNull(values.linkTitle1),
      TtiuloEnlace2: this.checkNull(values.linkTitle2),
      TtiuloEnlace3: this.checkNull(values.linkTitle3),
      CV: this.checkNull(values.content),
      Mensaje: this.checkNull(values.message),
      Orden: Number(this.checkNull(values.order, '0')),
      PalabrasClave: values.keywords ? values.keywords.keywords : ''
    };

    if (values.id) {
      data.Id = values.id;
    }

    this.validateOrder(values.order, values.id);

    return this.sis.getFormDigest().pipe(
      switchMap(formDigest => {
        return this.sis.save(environment.sharepoint.listName, data, formDigest);
      })
    );
  }

  // Custom private methods

  private setupForm() {
    this.mainForm = this.fb.group({
      principal: null,
      id: null,
      title: null,
      description: null,
      linkTitle1: null,
      linkTitle2: null,
      linkTitle3: null,
      linkUrl1: [null, Validators.pattern(/^(http[s]?:\/\/)(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)],
      linkUrl2: [null, Validators.pattern(/^(http[s]?:\/\/)(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)],
      linkUrl3: [null, Validators.pattern(/^(http[s]?:\/\/)(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)],
      image: null,
      content: null,
      message: null,
      order: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      keywords: null
    });

    if (!this.isNew) {
      this.mainForm.patchValue({
        principal: this.data.principal,
        id: this.data.id,
        title: this.data.title,
        description: this.data.description,
        linkTitle1: this.data.linkTitle1,
        linkTitle2: this.data.linkTitle2,
        linkTitle3: this.data.linkTitle3,
        linkUrl1: this.data.linkUrl1,
        linkUrl2: this.data.linkUrl2,
        linkUrl3: this.data.linkUrl3,
        image: this.data.image ? {
            data: this.data.image.data,
            name: 'Imagen',
            type: 'image/png'
          } : this.data.image,
        content: this.data.content,
        message: this.data.message,
        order: this.data.order,
        keywords: this.data.keywords ? {keywords: this.data.keywords} : this.data.keywords = ''
      });
    }
  }

  // Validators

  validateOrder(ord,id) {
    const data = {
      select: ['Id', 'Orden'],
      filter:['Orden eq ' + ord, 'Id ne ' + id],
      top:1
    };
    this.sis.read(environment.sharepoint.listName, data)
    .subscribe((response: any) => {
      if(response.value.length > 0) {
        const data: any = {
          __metadata: environment.sharepoint.metadata,
          Id: response.value[0].Id,
          Orden: response.value[0].Orden + 1
        };
        this.sis.getFormDigest().pipe(
          switchMap(formDigest => {
            return this.sis.save(environment.sharepoint.listName, data, formDigest);
          })
        ).subscribe(() => {
          this.validateOrder(data.Orden,data.Id);
          this.mts.loadData().subscribe();
        },);
      }
    });
  }

  updateMainController()
  {
    if(this.mainForm.value.principal)
    {
      const data = {
        select: ['Id', 'Principal'],
        top: 5000
      };
      this.sis.read(environment.sharepoint.listName, data)
      .subscribe((response: any) => {
        for(var i = 0; i < response.value.length; i++) {
          if(response.value[i].Principal == true) {
            if(this.mainForm.value.id != response.value[i].Id) {
              this.mainForm.get('principal').setValue(false);
              this.maincheck = true;
              this.selected = response.value[i].Id;
            }
          }
        }
      });
    }
  }

  // Getters and setters

  get orderCtrl() {
    return this.mainForm.get('order');
  }

  private checkNull(variable, defaultValue: any = '') {
    if (variable === null)
      return defaultValue;
    else
      return variable
  }
}

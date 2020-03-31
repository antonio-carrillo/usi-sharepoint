import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { switchMap, map } from 'rxjs/operators';
import { FormsService,SharepointIntegrationService, ImageUploadControlComponent } from 'shared-lib';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cab-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss']
})
export class MainFormComponent implements OnInit {
  @Input() data: any;
  flags = {
    loadingFields: true
  };
  @ViewChild('image') iucc: ImageUploadControlComponent;
  private isNew: boolean;
  mainForm: FormGroup;
  urlRegex = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

  constructor(
    private fb: FormBuilder,
    private fs: FormsService,
    private sis: SharepointIntegrationService
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
      Cargotitular: values.position,
      CV: values.curriculum,
      Dependencia: values.dependencyTitle,
      Enlace: values.url,
      Imagen: values.image.data,
      Keywords: values.keywords ? values.keywords.keywords : null,
      NombreImagen: values.image.name,
      Tipodegabinete: values.type,
      Title: values.ownerName
    };

    values.names.forEach((n, index) => {
      data[`Nombre${index + 1}`] = n.name;
      data[`Enlace${index + 1}`] = n.link;
    });

    if (values.id) {
      data.Id = values.id;
    }

    return this.sis.getFormDigest().pipe(
      switchMap(formDigest => this.sis.save(environment.sharepoint.listName, data, formDigest)),
      map(response => response ? response : true)
    );
  }

  // Custom private methods

  private createNameGroup() {
    return this.fb.group({
      link: [null, Validators.pattern(this.urlRegex)],
      name: null
    });
  }

  private setupForm() {
    this.mainForm = this.fb.group({
      curriculum: null,
      dependencyTitle: null,
      id: null,
      image: null,
      keywords: null,
      names: this.fb.array([]),
      ownerName: null,
      position: null,
      type: [null, Validators.required],
      url: [null, [Validators.required, Validators.pattern(this.urlRegex)]]
    });

    for (let i = 0, j = 3; i < j; i++) {
      this.names.push(this.createNameGroup());
    }

    if (!this.isNew) {
      this.mainForm.patchValue({
        curriculum: this.data.curriculum,
        dependencyTitle: this.data.dependencyTitle,
        id: this.data.id,
        image: this.data.image,
        keywords: {
          keywords: this.data.keywords
        },
        names: this.data.names,
        ownerName: this.data.title,
        position: this.data.position,
        type: this.data.type,
        url: this.data.url
      });
    }

    setTimeout(() => this.iucc.required = true);
  }

  // Getters and setters

  get names() {
    return this.mainForm.get('names') as FormArray;
  }

  get url() {
    return this.mainForm.get('url');
  }

}

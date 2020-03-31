import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { switchMap, map } from 'rxjs/operators';
import { FormsService,SharepointIntegrationService, ImageUploadControlComponent } from 'shared-lib';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'sn-main-form',
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
    this.isNew = this.data.target ? false : true;

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
      Enlace: values.url,
      Imagen: values.image.data,
      Tipodered: values.type,
      Title: values.title
    };

    if (values.id) {
      data.Id = values.id;
    }

    return this.sis.getFormDigest().pipe(
      switchMap(formDigest => this.sis.save(environment.sharepoint.listName, data, formDigest)),
      map(response => response ? response : true)
    );
  }

  // Custom private methods

  private setupForm() {
    this.mainForm = this.fb.group({
      id: null,
      image: null,
      title: [null, Validators.required],
      type: [null, [
        Validators.required,
        this.limitValidator(this.data.siblings.map(s => s.type))]
      ],
      url: [null, [Validators.required, Validators.pattern(this.urlRegex)]]
    });

    if (!this.isNew) {
      this.mainForm.patchValue({
        id: this.data.target.id,
        image: this.data.target.image,
        title: this.data.target.title,
        type: this.data.target.type,
        url: this.data.target.url
      });
    }

    setTimeout(() => this.iucc.required = true);
  }

  private limitValidator(siblings: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (control.value) {
        const temp = [...[control.value], ...siblings];
        const facebookCount = temp.filter(t => t === 'Facebook').length;
        const twitterCount = temp.filter(t => t === 'Twitter').length;

        return facebookCount > 2 || twitterCount > 2 ? { limit: true } : null;
      }

      return null;
    };
  }

  // Getters and setters

  get type() {
    return this.mainForm.get('type');
  }

  get url() {
    return this.mainForm.get('url');
  }

}

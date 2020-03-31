import { Component, Input, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, Validators, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImageFile } from '../../../interfaces/image-file';

@Component({
  selector: 'shared-image-upload-control',
  templateUrl: './image-upload-control.component.html',
  styleUrls: ['./image-upload-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadControlComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ImageUploadControlComponent),
      multi: true
    }
  ]
})
export class ImageUploadControlComponent implements AfterViewInit, ControlValueAccessor, OnDestroy, OnInit {
  disabled: boolean;
  imageGroup: FormGroup;
  overlimit = false;
  @Input() label: string;
  @Input() file: ImageFile;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private message: MessageService
  ) {

  }

  ngAfterViewInit() { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.setupForm();

    this.subscriptions.push(
      this.imageGroup.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  onChange: any = (_: any) => {};
  onTouched: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(_: FormControl) {
    return this.imageGroup.valid ? null : { imageGroup: { valid: false } };
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.imageGroup.reset();
    }
  }

  // Custom public methods

  onDelete() {
    this.file = null;

    this.imageGroup.patchValue({
      data: null,
      name: null,
      type: null
    });
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file.size > this.maxFileSizeBytes) {
      this.message.show(`Tamaño de imagen mayor al permitido (${this.maxFileSize}).`);

      return;
    } else if (file.type.match(/^image\/.*$/) === null) {
      this.message.show('El archivo seleccionado no es de tipo imagen.');

      return;
    }

    reader.readAsDataURL(file);

    var fileName = file.name;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile == 'jpg' || extFile == 'jpeg' || extFile == 'png') {
      if (file.size > 1024 * 750)
        this.overlimit = true;
      else {
        this.overlimit = false;
        reader.onload = () => {
          this.file = {
            data: reader.result,
            name: file.name,
            type: file.type
          };

          this.imageGroup.patchValue({
            data: reader.result,
            name: file.name,
            type: file.type
          });
        }
      }
    } else
      alert("Solo son permitidos los archivos con extensión jpg, jpeg y png.");
  }

  // Custom private methods

  private setupForm() {
    this.imageGroup = this.fb.group({
      data: null,
      name: null,
      type: null
    });
  }

  private setValidation(value: boolean) {
    if (value) {
      this.data.setValidators(Validators.required);
    } else {
      this.data.clearValidators();
    }

    this.data.updateValueAndValidity();
  }

  // Getters and setters

  get data() {
    return this.imageGroup.get('data');
  }

  set required(value: boolean) {
    this.setValidation(value);
  }

  get value() {
    return this.imageGroup.value;
  }

  set value(value) {
    this.file = value;
    this.imageGroup.setValue(value);
    this.onChange(value);
    this.onTouched();
  }
}

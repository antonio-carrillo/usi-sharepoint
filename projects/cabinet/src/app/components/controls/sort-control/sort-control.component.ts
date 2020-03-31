import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tap, switchMap } from 'rxjs/operators';
import { SharepointIntegrationService, MessageService } from 'shared-lib';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cab-sort-control',
  templateUrl: './sort-control.component.html',
  styleUrls: ['./sort-control.component.scss']
})
export class SortControlComponent implements OnInit {
  globalId: number;
  private globalListName = 'Global';
  loading = true;
  previousValue: string;
  sortGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private message: MessageService,
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit(): void {
    this.setupForm();

    this.sort.disable();

    this.loadData();
  }

  // Custom private methods

  private addEventListeners() {
    this.sort.valueChanges.subscribe(value => {
      if (value && value !== this.previousValue) {
        const data = {
          __metadata: {
            type: `SP.Data.${this.globalListName}ListItem`
          },
          Id: this.id.value,
          Ordenapor: value === 'name'
        };

        this.previousValue = value;
        this.loading = true;

        this.sort.disable();

        const ref$ = this.sis.getFormDigest()
          .pipe(
            switchMap(formDigest => this.sis.save(this.globalListName, data, formDigest))
          )
          .subscribe(
            response => this.message.genericSaveMessage(),
            err => this.message.genericHttpError(err),
            () => {
              this.loading = false;
              this.sort.enable();
              ref$.unsubscribe();
            }
          );
      }
    });
  }

  private loadData() {
    const data = {
      select: ['Id', 'Ordenapor'],
      filter: [`Lista eq '${environment.sharepoint.listName}'`]
    };

    this.sis.read(this.globalListName, data)
      .subscribe(
        (response: any) => {
          this.sortGroup.patchValue({
            id: response.value[0].Id,
            sort: response.value[0].Ordenapor ? 'name' : 'dependency'
          });

          this.sort.enable();
          this.addEventListeners();
        },
        err => {
          this.sort.enable();
          this.message.genericHttpError();
        },
        () => this.loading = false
      );
  }

  private setupForm() {
    this.sortGroup = this.fb.group({
      id: null,
      sort: null
    });
  }

  // Getters and setters

  get id() {
    return this.sortGroup.get('id');
  }

  get sort() {
    return this.sortGroup.get('sort');
  }

}

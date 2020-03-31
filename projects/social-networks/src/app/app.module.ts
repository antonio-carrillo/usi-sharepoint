import { NgModule } from '@angular/core';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedLibModule } from 'shared-lib';
// import 'hammerjs';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Custom components

import { MainTableComponent } from './components/tables/main-table/main-table.component';
import { MainFormComponent } from './components/forms/main-form/main-form.component';
import { MainFormDialogComponent } from './components/dialogs/main-form-dialog/main-form-dialog.component';

// Material components

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    MainFormComponent,
    MainFormDialogComponent,
    MainTableComponent
  ],
  entryComponents: [
    MainFormDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    // FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    SharedLibModule.forRoot(environment)
  ],
  providers: []
})
export class AppModule { }

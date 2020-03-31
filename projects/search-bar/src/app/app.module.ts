import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedLibModule } from 'shared-lib';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Custom components

import { SearchFormComponent } from './components/forms/search-form/search-form.component';

// Material components

import { MatIconModule } from '@angular/material/icon';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    SearchFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    SharedLibModule.forRoot(environment)
  ],
  providers: []
})
export class AppModule { }

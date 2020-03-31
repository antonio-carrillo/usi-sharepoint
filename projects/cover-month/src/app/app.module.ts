import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedLibModule } from 'shared-lib';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Custom components

import { MainViewComponent } from './components/views/main-view/main-view.component';

// Material components

import { MatCardModule } from '@angular/material/card';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    MainViewComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    MatCardModule,
    SharedLibModule.forRoot(environment)
  ],
  providers: []
})
export class AppModule { }

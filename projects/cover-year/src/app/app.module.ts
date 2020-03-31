import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedLibModule } from 'shared-lib';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Custom components

import { YearsControlComponent } from './components/controls/years-control/years-control.component';
import { CoversViewComponent } from './components/views/covers-view/covers-view.component';
import { MainViewComponent } from './components/views/main-view/main-view.component';

// Material components

import { MatCardModule } from '@angular/material/card';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    CoversViewComponent,
    MainViewComponent,
    YearsControlComponent
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedLibModule } from 'shared-lib';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedLibModule.forRoot(environment),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

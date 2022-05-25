import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { GraphQLModule } from './graphql.module';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { WakuPipe } from './waku.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WakuPipe
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    GraphQLModule,
    MaterialModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      positionClass: 'toast-center-center',
      preventDuplicates: false,
      closeButton: true
    }),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

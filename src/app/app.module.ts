import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TopComponent } from './top/top.component';
import { LeftComponent } from './left/left.component';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { RightComponent } from './right/right.component';
import { PageFoundComponent } from './page-found/page-found.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './content/home/home.component';
import { DoctorComponent } from './content/doctor/doctor.component';
import { TransactionsComponent } from './content/transactions/transactions.component';
import * as $ from 'jquery';
import { PatientsComponent } from './content/patients/patients.component';
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    TopComponent,
    LeftComponent,
    ContentComponent,
    FooterComponent,
    RightComponent,
    PageFoundComponent,
    LoginComponent,
    HomeComponent,
    PatientsComponent,
    DoctorComponent,
    TransactionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

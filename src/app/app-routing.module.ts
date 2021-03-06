import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageFoundComponent } from './page-found/page-found.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PatientsComponent } from './content/patients/patients.component';
import { HomeComponent } from './content/home/home.component';
import { ChannellingComponent } from './content/channelling/channelling.component';
import { DoctorComponent } from './content/doctor/doctor.component';
import { TransactionsComponent } from './content/transactions/transactions.component';
import { RegisterComponent } from './register/register.component';
import { UnregisteredComponent } from './unregistered/unregistered.component';
import { SettingsComponent } from './content/settings/settings.component';

const routes: Routes = [
  //{ path: 'home', component: PageFoundComponent },

  { path: 'login', component: LoginComponent },
  
  { path: 'register', component: RegisterComponent },

  { path: 'notFound', component: PageNotFoundComponent },
  { path: 'unregistered', component: UnregisteredComponent },
  {
    path: 'home',
    component: PageFoundComponent,
    children:[
      {
        path: 'patients',
        component: PatientsComponent,
      },
      {
        path: 'channelling',
        component: ChannellingComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'doctors',
        component: DoctorComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ]
  }, 
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

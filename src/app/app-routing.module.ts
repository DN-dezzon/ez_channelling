import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageFoundComponent } from './page-found/page-found.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PatientsComponent } from './content/patients/patients.component';

const routes: Routes = [
  { path: 'home', component: PageFoundComponent },

  { path: 'login', component: LoginComponent },

  {
    path: 'home',
    component: PageFoundComponent,
    children:[
      {
        path: 'patients',
        component: PatientsComponent,
      },
    ]
  },

  

  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

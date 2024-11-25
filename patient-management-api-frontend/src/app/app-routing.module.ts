import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { CanDeactivateGuard } from './add-patient/can-deactivate-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'view-patient', pathMatch: 'full' },
  {
    path: 'add-patient',
    component: AddPatientComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'view-patient',
    loadChildren: () =>
      import('./view-patient/view-patient.module').then(
        (m) => m.ViewPatientModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

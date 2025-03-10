import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DataEntryLayoutComponent } from './layouts/data-entry-layout/data-entry-layout.component';
import { PatientLayoutComponent } from './layouts/patient-layout/patient-layout.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { patientGuard } from './core/guards/patient.guard';
import { dataEntryGuard } from './core/guards/data-entry.guard';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: []
    },
    {
        path: '',component: DataEntryLayoutComponent, canActivate:[patientGuard],
        children: [
            {
                path: 'addpatient',
                loadComponent: () => import('./pages/addpatient/addpatient.component')
                    .then(m => m.AddpatientComponent),
                title: 'Add Patient'
            },
            {
                path: 'dEntrydashboard',
                loadComponent: () => import('./pages/dentrydashboard/dentrydashboard.component')
                    .then(m => m.DentrydashboardComponent),
                title: 'DataEntry Dashboard'
            },
            {
                path: 'dentryprofile',
                loadComponent: () => import('./pages/dentryprofile/dentryprofile.component')
                    .then(m => m.DentryprofileComponent),
                title: 'DataEntry Profile'
            },
            {
                path: 'departmentinteraction',
                loadComponent: () => import('./pages/departmentinteraction/departmentinteraction.component')
                    .then(m => m.DepartmentinteractionComponent),
                title: 'Department Interaction'
            }
        ]
    },
    {
        path: '',component: PatientLayoutComponent, canActivate:[dataEntryGuard],
        children: [
            {
                path: 'myvisits',
                loadComponent: () => import('./pages/myvisits/myvisits.component')
                    .then(m => m.MyvisitsComponent),
                title: 'My Visits'
            },
            {
                path: 'patientprofile',
                loadComponent: () => import('./pages/patientprofile/patientprofile.component')
                    .then(m => m.PatientprofileComponent),
                title: 'Patient Profile'
            },
            {
                path: 'patientdashboard',
                loadComponent: () => import('./pages/pdashboard/pdashboard.component')
                    .then(m => m.PdashboardComponent),
                title: 'Patient Dashboard'
            }
        ]
    },
    {
        path: '**',
        component: NotfoundComponent,
        title: 'Page Not Found'
    }
];

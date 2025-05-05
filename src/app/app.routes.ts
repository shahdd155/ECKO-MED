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
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                title: 'login',
                loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                title: 'Register',
                loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
            },
            {
                path: 'forgotpass',
                title: 'forget password',
                loadComponent: () => import('./pages/forgotpass/forgotpass.component').then(m => m.ForgotpassComponent)
            }
        ]
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
                title: 'DataEntryDashboard'
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
                title: 'My Visits',
            },


            {
                path: 'scans',
                loadComponent: () => import('./pages/scans/scans.component')
                    .then(m => m.ScansComponent),
                title: 'Scans'
            },
            {
                path: 'receipts',
                loadComponent: () => import('./pages/receipts/receipts.component')
                    .then(m => m.ReceiptsComponent),
                title: 'Receipts'
            },
            {
                path: 'prescriptions',
                loadComponent: () => import('./pages/prescriptions/prescriptions.component')
                    .then(m => m.PrescriptionsComponent),
                title: 'Prescriptions'
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
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/settings/settings.component')
                    .then(m => m.SettingsComponent),
                title: 'settings'
            }, 
            {
                path: 'helpCenter',
                loadComponent: () => import('./pages/help-center/help-center.component')
                    .then(m => m.HelpCenterComponent),
                title: 'helpCenter'
            },
            {
                path: 'search',
                loadComponent: () => import('./pages/search/search.component')
                    .then(m => m.SearchComponent),
                title: 'search'
            }
        ]
    },
    {
        path: '**',
        component: NotfoundComponent,
        title: 'Page Not Found'
    }
];

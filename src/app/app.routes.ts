import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DataEntryLayoutComponent } from './layouts/data-entry-layout/data-entry-layout.component';
import { PatientLayoutComponent } from './layouts/patient-layout/patient-layout.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { patientGuard } from './core/guards/patient.guard';
import { dataEntryGuard } from './core/guards/data-entry.guard';
import path from 'path';
import { PharmacyLayoutComponent } from './layouts/pharmacy-layout/pharmacy-layout.component';
import { pharmacyGuard } from './core/guards/pharmacy.guard';

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
                loadComponent: () => import('./pages/forgotPassword/forgotpass.component').then(m => m.ForgotpassComponent)
            }
        ]
    },
    {
        path: '',component: DataEntryLayoutComponent, canActivate:[patientGuard],
        children: [
            {
                path: 'addpatient',
                loadComponent: () => import('./pages/dataEntry/addpatient/addpatient.component')
                    .then(m => m.AddpatientComponent),
                title: 'Add Patient'
            },
            {
                path: 'dEntrydashboard',
                loadComponent: () => import('./pages/dataEntry/Dashboard/dentrydashboard.component')
                    .then(m => m.DentrydashboardComponent),
                title: 'DataEntryDashboard'
            },
            {
                path: 'dentryprofile',
                loadComponent: () => import('./pages/dataEntry/Profile/dentryprofile.component')
                    .then(m => m.DentryprofileComponent),
                title: 'DataEntry Profile'
            },
            {
                path: 'departmentinteraction',
                loadComponent: () => import('./pages/dataEntry/Department/Department.component')
                    .then(m => m.DepartmentComponent),
                title: 'Department Interaction'
            },
            {
                path: 'patientinteraction',
                loadComponent: () => import('./pages/dataEntry/PatientInteraction/PatientInteraction.component')
                    .then(m => m.PatientInteractionComponent),
                title: 'Patient Interaction'
            }
            
        ]
    },
    {
        path: '',component: PatientLayoutComponent, canActivate:[dataEntryGuard],
        children: [
            {
                path: 'myvisits',
                loadComponent: () => import('./pages/Patient/myvisits/myvisits.component')
                    .then(m => m.MyvisitsComponent),
                title: 'My Visits',
            },


            {
                path: 'scans',
                loadComponent: () => import('./pages/Patient/scans/scans.component')
                    .then(m => m.ScansComponent),
                title: 'Scans'
            },
            {
                path: 'prescriptions',
                loadComponent: () => import('./pages/Patient/prescriptions/prescriptions.component')
                    .then(m => m.PrescriptionsComponent),
                title: 'Prescriptions'
            },


            {
                path: 'patientprofile',
                loadComponent: () => import('./pages/Patient/Profile/patientprofile.component')
                    .then(m => m.PatientprofileComponent),
                title: 'Patient Profile'
            },
            {
                path: 'patientdashboard',
                loadComponent: () => import('./pages/Patient/Dashboard/pdashboard.component')
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
                loadComponent: () => import('./pages/Patient/search/search.component')
                    .then(m => m.SearchComponent),
                title: 'search'
            },
            {
                path: 'searchmedicine',
                loadComponent: () => import('./pages/Patient/searchmedicine/searchmedicine.component')
                    .then(m => m.SearchmedicineComponent),
                title: 'searchmedicine'
            },
            {
                path: 'verifyemail',
                loadComponent: () => import('./pages/verifyemail/verifyemail.component')
                    .then(m => m.VerifyemailComponent),
                title: 'Verify Email'
            }
        ]
    },
    {
        path:'',component:PharmacyLayoutComponent,canActivate:[pharmacyGuard],
        children:[
            {
        path: 'viewrequests',
        loadComponent: () => import('./pages/Pharmacy/viewRequests/view-requests.component')
            .then(m => m.ViewRequestsComponent),
        title: 'View Pharmacy Requests'
          },
      {
        path: 'managerequests',
        loadComponent: () => import('./pages/Pharmacy/manageRequests/manage-requests.component')
            .then(m => m.ManageRequestsComponent),
        title: 'Manage Pharmacy Requests'
         },
        ]
    },
    {
        path: '**',
        component: NotfoundComponent,
        title: 'Page Not Found'
    }
];

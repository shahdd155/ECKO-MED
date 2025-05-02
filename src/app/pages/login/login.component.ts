
import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required, Validators.minLength(4),Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]*$/) ]),
    password: new FormControl(null,[Validators.required,Validators.pattern(/^[A-Z]\w{7}$/) ])
   
  });

  submitLogin():void{
    if(this.loginForm.valid){

    }
  }
}

  
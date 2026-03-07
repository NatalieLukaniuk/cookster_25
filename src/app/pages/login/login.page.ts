import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth-service';
import { Router } from '@angular/router';
import { IonItem, IonLabel, IonNote, IonButton, IonInput, IonContent, IonList, IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonList, IonButton, IonItem, CommonModule, ReactiveFormsModule, IonInput, ]
})
export class LoginPage implements OnInit {
  authService = inject(AuthService);
  router = inject(Router)
  formBuilder = inject(FormBuilder);

  loginForm: FormGroup = this.formBuilder.group({
    username: ['', [
      Validators.required,
      Validators.email,
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
    ]],
  });

  isRegistration = signal(false);

  constructor() {

  }

  ngOnInit(): void {
    // this.initForm()
  }


  submit() {
    if (!this.loginForm) {
      return
    }
    this.authService.loginUser(
      this.loginForm.controls['username'].value,
      this.loginForm.controls['password'].value
    );
    this.router.navigate(['']);
  }

  goRegistration() {
    this.isRegistration.set(true)
  }

}

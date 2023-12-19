import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CORE_CONFIG } from '@tranchy/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})

/**
 * Basic Component
 */
export class LoginComponent implements OnInit {
  private coreConfig = inject(CORE_CONFIG);

  // Login Form
  loginForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
     this.loginForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
   onSubmit() {
    window.location.href = `${this.coreConfig.askApiBaseUrl}/bff/login?returnUrl=/agency-portal`;
  }

  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}

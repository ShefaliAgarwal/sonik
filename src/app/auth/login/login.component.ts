/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../@theme/services/auth.service';
import { AppToastrService } from '../../@theme/services/app-toastr.service';
import { NbToastrService } from '@nebular/theme';
// import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '../../auth.options';
// import { getDeepFromObject } from '../../helpers';

// import { NbAuthService } from '../../services/auth.service';
// import { NbAuthResult } from '../../services/auth-result';

@Component({
    selector: 'nb-login',
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

    public userForm: FormGroup;

    constructor(
        protected cd: ChangeDetectorRef,
        protected router: Router,
        private formBuilder: FormBuilder,
        private toaster: NbToastrService,
        private authService: AuthService,
        public appToastrService: AppToastrService) {
    }
    ngOnInit(): void {
        this.userForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    get user() { return this.userForm.controls; }

    login(): void {
        const body = {
            email: this.userForm.controls['email'].value,
            password: this.userForm.controls['password'].value,
        }
        this.authService.login(body).subscribe(data => {
            if (data) {
                this.toaster.success(data.message);
                this.router.navigate(['/pages/acquisition/overview']);
            }
            this.userForm.reset();
        }, error => {
            // this.router.navigate(['./auth']);
        });
    }
}
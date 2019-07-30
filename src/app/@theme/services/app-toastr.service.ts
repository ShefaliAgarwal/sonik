import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

@Injectable()
export class AppToastrService {
    types = {
        Default: NbToastStatus.DEFAULT,
        Danger: NbToastStatus.DANGER,
        Info: NbToastStatus.INFO,
        Primary: NbToastStatus.PRIMARY,
        Sucess: NbToastStatus.SUCCESS,
        Warning: NbToastStatus.WARNING,
    };

    constructor(public toastrService: NbToastrService) {

    }

    showToastr(type: NbToastStatus, message: string) {
        const config = {
            status: type,
            destroyByClick: true,
            duration: 5000,
            hasIcon: true,
            position: NbGlobalPhysicalPosition.TOP_RIGHT,
            preventDuplicates: false,
        };

        this.toastrService.show(
            '', message,
            config);
    }
}

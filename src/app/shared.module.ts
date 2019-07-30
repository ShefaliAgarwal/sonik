/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AcquisitionService } from './@theme/services/acquisition.service';
import { ThemeModule } from './@theme/theme.module';

@NgModule({
    declarations: [],
    imports: [
        ThemeModule,
    ],
    providers: [
        // AcquisitionService,
    ],
})
export class SharedModule {
}

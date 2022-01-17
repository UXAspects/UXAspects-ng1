import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertModule } from '@ux-aspects/ux-aspects';
import { DocumentationComponentsModule } from '../../components/components.module';
import { LandingPageComponent } from './landing.component';

const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    }
];

@NgModule({
    declarations: [
        LandingPageComponent
    ],
    imports: [
        AlertModule,
        CommonModule,
        DocumentationComponentsModule,
        RouterModule.forChild(routes)
    ]
})
export class LandingPageModule {}
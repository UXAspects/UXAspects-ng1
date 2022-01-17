import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertModule } from '@ux-aspects/ux-aspects';
import { DocumentationComponentsModule } from '../../components/components.module';
import { OverviewPageComponent } from './overview.component';

const routes: Routes = [
    {
        path: '',
        component: OverviewPageComponent
    }
];

@NgModule({
    declarations: [
        OverviewPageComponent
    ],
    imports: [
        AlertModule,
        CommonModule,
        DocumentationComponentsModule,
        RouterModule.forChild(routes)
    ]
})
export class OverviewPageModule {}
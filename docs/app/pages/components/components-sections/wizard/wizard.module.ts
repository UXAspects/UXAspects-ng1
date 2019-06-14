import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccessibilityModule, AccordionModule, CheckboxModule, FocusIfModule, MarqueeWizardModule, RadioButtonModule, TabsetModule, WizardModule } from '@ux-aspects/ux-aspects';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DocumentationComponentsModule } from '../../../../components/components.module';
import { DocumentationCategoryComponent } from '../../../../components/documentation-category/documentation-category.component';
import { DocumentationPage, ResolverService } from '../../../../services/resolver/resolver.service';
import { WrappersModule } from '../../../../wrappers/wrappers.module';
import { ComponentsMarqueeWizardNg1Component } from './marquee-wizard-ng1/marquee-wizard-ng1.component';
import { ComponentsVerticalWizardNg1Component } from './vertical-wizard-ng1/vertical-wizard-ng1.component';
import { ComponentsWizardNg1Component } from './wizard-ng1/wizard-ng1.component';
import { ComponentsWizardValidationNg1Component } from './wizard-validation-ng1/wizard-validation-ng1.component';

const SECTIONS = [
    ComponentsWizardNg1Component,
    ComponentsWizardValidationNg1Component,
    ComponentsVerticalWizardNg1Component,
    ComponentsMarqueeWizardNg1Component,
];

const ROUTES = [
    {
        path: '**',
        component: DocumentationCategoryComponent,
        data: {
            category: ResolverService.resolveCategoryData(DocumentationPage.Components, 'Wizard')
        }
    }
];

@NgModule({
    imports: [
        A11yModule,
        AccessibilityModule,
        AccordionModule,
        CheckboxModule,
        CommonModule,
        DocumentationComponentsModule,
        FocusIfModule,
        MarqueeWizardModule,
        ModalModule,
        RadioButtonModule,
        ReactiveFormsModule,
        RouterModule.forChild(ROUTES),
        TabsetModule,
        WizardModule,
        WrappersModule,
    ],
    exports: SECTIONS,
    declarations: SECTIONS,
    entryComponents: SECTIONS
})
export class ComponentsWizardModule {

    constructor(componentFactoryResolver: ComponentFactoryResolver, resolverService: ResolverService) {
        resolverService.registerResolver(componentFactoryResolver);
    }
}
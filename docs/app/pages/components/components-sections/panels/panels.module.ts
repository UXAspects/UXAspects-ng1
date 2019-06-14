import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccessibilityModule, AccordionModule, CheckboxModule, EboxModule, ItemDisplayPanelModule, RadioButtonModule, SidePanelModule, SparkModule, TabsetModule } from '@ux-aspects/ux-aspects';
import { DocumentationComponentsModule } from '../../../../components/components.module';
import { DocumentationCategoryComponent } from '../../../../components/documentation-category/documentation-category.component';
import { DocumentationPage, ResolverService } from '../../../../services/resolver/resolver.service';
import { WrappersModule } from '../../../../wrappers/wrappers.module';
import { ComponentsAccordionNg1Component } from './accordion-ng1/accordion-ng1.component';
import { ComponentsItemDisplayPanelNg1Component } from './item-display-panel-ng1/item-display-panel-ng1.component';
import { ComponentsItemDisplayPanelServiceNg1Component } from './item-display-panel-service-ng1/item-display-panel-service-ng1.component';
import { ComponentsModalInsetPanelNg1Component } from './modal-inset-panel-ng1/item-display-panel-ng1.component';
import { ComponentsSideInsetPanelNg1Component } from './side-inset-panel-ng1/side-inset-panel-ng1.component';


const SECTIONS = [
    ComponentsAccordionNg1Component,
    ComponentsItemDisplayPanelNg1Component,
    ComponentsItemDisplayPanelServiceNg1Component,
    ComponentsModalInsetPanelNg1Component,
    ComponentsSideInsetPanelNg1Component,
];

const ROUTES = [
    {
        path: '**',
        component: DocumentationCategoryComponent,
        data: {
            category: ResolverService.resolveCategoryData(DocumentationPage.Components, 'Panels')
        }
    }
];

@NgModule({
    imports: [
        AccordionModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(ROUTES),
        DocumentationComponentsModule,
        CheckboxModule,
        EboxModule,
        ItemDisplayPanelModule,
        RadioButtonModule,
        SidePanelModule,
        SparkModule,
        TabsetModule,
        WrappersModule,
        AccessibilityModule
    ],
    exports: SECTIONS,
    declarations: SECTIONS,
    entryComponents: SECTIONS
})
export class ComponentsPanelsModule {

    constructor(componentFactoryResolver: ComponentFactoryResolver, resolverService: ResolverService) {
        resolverService.registerResolver(componentFactoryResolver);
    }
}
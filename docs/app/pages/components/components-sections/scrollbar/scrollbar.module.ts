import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccessibilityModule, AccordionModule, CheckboxModule, FixedHeaderTableModule, InfiniteScrollModule, NumberPickerModule, TabsetModule, VirtualScrollModule } from '@ux-aspects/ux-aspects';
import { DocumentationComponentsModule } from '../../../../components/components.module';
import { DocumentationCategoryComponent } from '../../../../components/documentation-category/documentation-category.component';
import { DocumentationPage, ResolverService } from '../../../../services/resolver/resolver.service';
import { WrappersModule } from '../../../../wrappers/wrappers.module';
import { ComponentsCustomScrollbarNg1Component } from './custom-scrollbar-ng1/custom-scrollbar-ng1.component';
import { ComponentsInfiniteScrollLoadMoreNg1Component } from './infinite-scroll-load-more-ng1/infinite-scroll-load-more-ng1.component';
import { ComponentsInfiniteScrollNg1Component } from './infinite-scroll-ng1/infinite-scroll-ng1.component';

const SECTIONS = [
    ComponentsCustomScrollbarNg1Component,
    ComponentsInfiniteScrollNg1Component,
    ComponentsInfiniteScrollLoadMoreNg1Component,
];

const ROUTES = [
    {
        path: '**',
        component: DocumentationCategoryComponent,
        data: {
            category: ResolverService.resolveCategoryData(DocumentationPage.Components, 'Scrollbar')
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
        FormsModule,
        InfiniteScrollModule,
        NumberPickerModule,
        RouterModule.forChild(ROUTES),
        TabsetModule,
        VirtualScrollModule,
        WrappersModule,
        FixedHeaderTableModule
    ],
    exports: SECTIONS,
    declarations: SECTIONS,
    entryComponents: SECTIONS
})
export class ComponentsScrollbarModule {

    constructor(componentFactoryResolver: ComponentFactoryResolver, resolverService: ResolverService) {
        resolverService.registerResolver(componentFactoryResolver);
    }
}
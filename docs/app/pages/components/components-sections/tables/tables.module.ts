import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccessibilityModule, AccordionModule, CheckboxModule, ColumnSortingModule, FilterModule, FixedHeaderTableModule, HoverActionModule, LayoutSwitcherModule, MenuNavigationModule, RadioButtonModule, ReorderableModule, SelectionModule, SliderModule, SparkModule, TableModule, TabsetModule, TooltipModule } from '@ux-aspects/ux-aspects';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DocumentationComponentsModule } from '../../../../components/components.module';
import { DocumentationCategoryComponent } from '../../../../components/documentation-category/documentation-category.component';
import { DocumentationPage, ResolverService } from '../../../../services/resolver/resolver.service';
import { WrappersModule } from '../../../../wrappers/wrappers.module';
import { ComponentsColumnVisibilityNg1Component } from './column-visibility-ng1/column-visibility-ng1.component';
import { ComponentsCustomResponsiveTableNg1Component } from './custom-responsive-table-ng1/custom-responsive-table-ng1.component';
import { ComponentsDetailRowHeaderNg1Component } from './detail-row-header-ng1/detail-row-header-ng1.component';
import { ComponentsDetailRowResponsiveNg1Component } from './detail-row-responsive-ng1/detail-row-responsive-ng1.component';
import { ComponentsDynamicFiltersNg1Component } from './dynamic-filters-ng1/dynamic-filters-ng1.component';
import { ComponentsFiltersNg1Component } from './filters-ng1/filters-ng1.component';
import { ComponentsFixedHeaderTableNg1Component } from './fixed-header-table-ng1/fixed-header-table-ng1.component';
import { ComponentsGroupingNg1Component } from './grouping-ng1/grouping-ng1.component';
import { ComponentsHoverActionsNg1Component } from './hover-actions-ng1/hover-actions-ng1.component';
import { ComponentsIndicesNg1Component } from './indices-ng1/indices-ng1.component';
import { ComponentsLayoutSwitchingNg1Component } from './layout-switching-ng1/layout-switching-ng1.component';
import { ComponentsListHoverActionsNg1Component } from './list-hover-actions-ng1/list-hover-actions-ng1.component';
import { ComponentsMultipleColumnSortingNg1Component } from './multiple-column-sorting-ng1/multiple-column-sorting-ng1.component';
import { ComponentsMultipleSelectActionsNg1Component } from './multiple-select-actions-ng1/multiple-select-actions-ng1.component';
import { ComponentsMultipleSelectionRowNg1Component } from './multiple-selection-row-ng1/multiple-selection-row-ng1.component';
import { ComponentsPreviewPaneNg1Component } from './preview-pane-ng1/preview-pane-ng1.component';
import { ComponentsPreviewPaneWindowNg1Component } from './preview-pane-window-ng1/preview-pane-window-ng1.component';
import { ComponentsReorderableTableNg1Component } from './reorderable-table-ng1/reorderable-table-ng1.component';
import { ComponentsScrollableTableNg1Component } from './scrollable-table-ng1/scrollable-table-ng1.component';
import { ComponentsSingleColumnSortingNg1Component } from './single-column-sorting-ng1/single-column-sorting-ng1.component';
import { ComponentsSortDirectionToggleNg1Component } from './sort-direction-toggle-ng1/sort-direction-toggle-ng1.component';
import { ComponentsSortingNg1Component } from './sorting-ng1/sorting-ng1.component';
import { ComponentsTraditionalMultipleSelectActionsNg1Component } from './traditional-multiple-select-actions-ng1/traditional-multiple-select-actions-ng1.component';


const SECTIONS = [
    ComponentsDetailRowResponsiveNg1Component,
    ComponentsDetailRowHeaderNg1Component,
    ComponentsFiltersNg1Component,
    ComponentsDynamicFiltersNg1Component,
    ComponentsIndicesNg1Component,
    ComponentsGroupingNg1Component,
    ComponentsLayoutSwitchingNg1Component,
    ComponentsScrollableTableNg1Component,
    ComponentsListHoverActionsNg1Component,
    ComponentsHoverActionsNg1Component,
    ComponentsPreviewPaneNg1Component,
    ComponentsPreviewPaneWindowNg1Component,
    ComponentsReorderableTableNg1Component,
    ComponentsMultipleSelectActionsNg1Component,
    ComponentsTraditionalMultipleSelectActionsNg1Component,
    ComponentsMultipleSelectionRowNg1Component,
    ComponentsSortingNg1Component,
    ComponentsSortDirectionToggleNg1Component,
    ComponentsSingleColumnSortingNg1Component,
    ComponentsMultipleColumnSortingNg1Component,
    ComponentsColumnVisibilityNg1Component,
    ComponentsCustomResponsiveTableNg1Component,
    ComponentsFixedHeaderTableNg1Component,
];

const ROUTES = [
    {
        path: '**',
        component: DocumentationCategoryComponent,
        data: {
            category: ResolverService.resolveCategoryData(DocumentationPage.Components, 'Tables')
        }
    }
];

@NgModule({
    imports: [
        A11yModule,
        AccessibilityModule,
        AccordionModule,
        BsDropdownModule,
        ButtonsModule,
        CheckboxModule,
        ColumnSortingModule,
        CommonModule,
        DocumentationComponentsModule,
        FilterModule,
        FixedHeaderTableModule,
        FormsModule,
        HoverActionModule,
        LayoutSwitcherModule,
        MenuNavigationModule,
        RadioButtonModule,
        ReorderableModule,
        RouterModule.forChild(ROUTES),
        SelectionModule,
        SliderModule,
        SparkModule,
        TableModule,
        TabsetModule,
        TooltipModule,
        WrappersModule,
    ],
    exports: SECTIONS,
    declarations: SECTIONS,
    entryComponents: SECTIONS
})
export class ComponentsTablesModule {

    constructor(componentFactoryResolver: ComponentFactoryResolver, resolverService: ResolverService) {
        resolverService.registerResolver(componentFactoryResolver);
    }
}
import { Component, ViewEncapsulation } from '@angular/core';
import { BaseDocumentationSection } from '../../../../../components/base-documentation-section/base-documentation-section';
import { DocumentationSectionComponent } from '../../../../../decorators/documentation-section-component';
import { IPlayground } from '../../../../../interfaces/IPlayground';
import { IPlaygroundProvider } from '../../../../../interfaces/IPlaygroundProvider';
import { playgroundAdapter } from '../../../../../services/playground/adapters/legacy-playground-adapter';

@Component({
    selector: 'uxd-draggable-cards-list-view-ng1',
    templateUrl: './draggable-cards-list-view-ng1.component.html',
    styleUrls: ['./draggable-cards-list-view-ng1.component.less'],
    encapsulation: ViewEncapsulation.None
})
@DocumentationSectionComponent('ComponentsDraggableCardsListViewNg1Component')
export class ComponentsDraggableCardsListViewNg1Component extends BaseDocumentationSection implements IPlaygroundProvider {

    playground: IPlayground = playgroundAdapter({
        html: this.snippets.raw.draggableCardsListViewHtml,
        htmlAttributes: {
            'ng-controller': 'DraggableCardsListViewDemoCtrl as vm'
        },
        css: [this.snippets.raw.draggableCardsListViewCss],
        js: [this.snippets.raw.draggableCardsListViewJs]
    });

    constructor() {
        super(require.context('./snippets/', false, /\.(html|css|js|ts)$/));
    }
}

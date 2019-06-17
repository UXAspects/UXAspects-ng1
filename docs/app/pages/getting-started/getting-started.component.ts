import { Component } from '@angular/core';
import { AppConfiguration } from '../../services/app-configuration/app-configuration.service';

@Component({
    selector: 'uxd-getting-started',
    templateUrl: './getting-started.component.html',
    styleUrls: ['./getting-started.component.less']
})
export class GettingStartedPageComponent {

    version = this.appConfig.get('version');
    angularJs = require('!!raw-loader!./snippets/angularjs.js');
    stylesheetCss = require('!!raw-loader!./snippets/stylesheet.css');
    angularUpgradeTs = require('!!raw-loader!./snippets/angular-upgrade.txt');

    constructor(private appConfig: AppConfiguration) {}
}
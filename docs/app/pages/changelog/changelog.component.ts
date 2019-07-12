import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IChangeLog } from '../../interfaces/IChangeLog';
import { AppConfiguration } from '../../services/app-configuration/app-configuration.service';

@Component({
    selector: 'uxd-changelog-page',
    templateUrl: './changelog.component.html',
    styleUrls: ['./changelog.component.less']
})
export class ChangeLogPageComponent {

    logs: IChangeLog[];

    constructor(domSanitizer: DomSanitizer, appConfig: AppConfiguration) {

        this.logs = [
            {
                version: '2.0.0-beta.3',
                date: 'July 11th 2019',
                content: require('./logs/release-v2.0.0-beta.3.md')
            },
            {
                version: '2.0.0-beta.2',
                date: 'June 27th 2019',
                content: require('./logs/release-v2.0.0-beta.2.md')
            },
            {
                version: '2.0.0-beta.1',
                date: 'June 12th 2019',
                content: require('./logs/release-v2.0.0-beta.1.md')
            }
        ];

        this.logs.forEach(log => {
            const markdown = log.content.replace(/{{baseUrl}}/g, appConfig.baseUrl);
            log.content = domSanitizer.bypassSecurityTrustHtml(markdown) as string;
        });

    }
}
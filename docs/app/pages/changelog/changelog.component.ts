import { Component } from '@angular/core';
import { IChangeLog } from '../../interfaces/IChangeLog';

@Component({
    selector: 'uxd-changelog-page',
    templateUrl: './changelog.component.html',
    styleUrls: ['./changelog.component.less']
})
export class ChangeLogPageComponent {

    logs: IChangeLog[];

    constructor() {

        this.logs = [
            {
                version: '2.0.1',
                date: 'July 28th 2020',
                content: require('./logs/release-v2.0.1.md')
            },
            {
                version: '2.0.0',
                date: 'April 17th 2020',
                content: require('./logs/release-v2.0.0.md')
            }
        ];
    }
}
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'uxd-licenses-page',
    templateUrl: './licenses.component.html',
    styleUrls: ['./licenses.component.less']
})
export class LicensesPageComponent implements OnInit {

    externalLicenses: ExternalLicenseInfo[];

    ngOnInit() {
        this.externalLicenses = require('../../data/licenses.json');
    }
}

interface ExternalLicenseInfo {
    fileName: string;
    content: string;
}

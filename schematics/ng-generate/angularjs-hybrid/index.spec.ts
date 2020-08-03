import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { getFileContent } from '../../utility';
import { createTestApp } from '../../utility/test';
import { Schema } from './schema';

describe('ux-aspects-angularjs-hybrid schematic', () => {
  let runner: SchematicTestRunner;

  const baseOptions: Schema = {
    project: 'test-app'
  };

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', require.resolve('../../collection.json'));
  });

  it('should add hybrid configuration to the default AppModule', async () => {
    const app = await createTestApp(runner);
    const tree = await runner.runSchematicAsync('angularjs-hybrid', baseOptions, app).toPromise();
    verifyTree(tree);
  });

  it('should include a call to `initialNavigation` when RouterModule is imported', async () => {
    const app = await createTestApp(runner);
    app.overwrite(
      '/projects/test-app/src/app/app.module.ts',
      `import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ColorService, ColorServiceModule } from '@ux-aspects/ux-aspects';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ColorServiceModule,
    RouterModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
`
    );
    const tree = await runner.runSchematicAsync('angularjs-hybrid', baseOptions, app).toPromise();
    verifyTree(tree, true);
  });

  it('should add hybrid configuration to an AppModule with existing constructor', async () => {
    const app = await createTestApp(runner);
    app.overwrite(
      '/projects/test-app/src/app/app.module.ts',
      `import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ColorService, ColorServiceModule } from '@ux-aspects/ux-aspects';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ColorServiceModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public colorService: ColorService) {}
}
`
    );
    const tree = await runner.runSchematicAsync('angularjs-hybrid', baseOptions, app).toPromise();
    verifyTree(tree);
  });

  it('should add hybrid configuration to an AppModule with existing ngDoBootstrap', async () => {
    const app = await createTestApp(runner);
    app.overwrite(
      '/projects/test-app/src/app/app.module.ts',
      `import { BrowserModule } from '@angular/platform-browser';
import { DoBootstrap, NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap() {
    console.log('ngDoBootstrap');
  }
}
`
    );
    const tree = await runner.runSchematicAsync('angularjs-hybrid', baseOptions, app).toPromise();
    verifyTree(tree);
  });

  it('should add hybrid configuration to an AppModule with existing implements clause', async () => {
    const app = await createTestApp(runner);
    app.overwrite(
      '/projects/test-app/src/app/app.module.ts',
      `import { BrowserModule } from '@angular/platform-browser';
import { NgModule, OnInit } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule implements OnInit {
  ngOnInit() {
    console.log('ngOnInit');
  }
}
`
    );
    const tree = await runner.runSchematicAsync('angularjs-hybrid', baseOptions, app).toPromise();
    verifyTree(tree);

    const moduleContent = getFileContent(tree, '/projects/test-app/src/app/app.module.ts');
    expect(moduleContent).toContain(`import { NgModule, OnInit, DoBootstrap } from '@angular/core';`);
    expect(moduleContent).toContain(`export class AppModule implements OnInit, DoBootstrap`);
  });
});

function verifyTree(tree: UnitTestTree, hasRouter: boolean = false): void {
  const files = tree.files;

  expect(files).toContain('/projects/test-app/src/app/setup-hybrid.ts');

  const moduleContent = getFileContent(tree, '/projects/test-app/src/app/app.module.ts');
  expect(moduleContent).toContain(`import { setupHybrid } from './setup-hybrid';`);
  expect(moduleContent).toContain(`import { UpgradeModule } from '@angular/upgrade/static';`);
  expect(moduleContent).toMatch(/imports:\s*\[[^\]]*UpgradeModule/m);
  expect(moduleContent).not.toMatch(/bootstrap:\s*\[[^\]]*AppComponent/m);
  expect(moduleContent).toMatch(/entryComponents:\s*\[[^\]]*AppComponent/m);
  expect(moduleContent).toMatch(/export class AppModule.*implements.*DoBootstrap/);
  expect(moduleContent).toMatch(/constructor\([^)]*private upgrade: UpgradeModule/m);
  expect(moduleContent).toContain(`ngDoBootstrap() {
    setupHybrid(this.upgrade.injector);
    this.upgrade.bootstrap(document.body, ['app'], { strictDi: true });`);

  const angularConfig = JSON.parse(getFileContent(tree, '/angular.json'));
  const scripts = angularConfig.projects['test-app'].architect.build.options.scripts;
  expect(scripts).toContain('node_modules/jquery/dist/jquery.js');
  expect(scripts).toContain('node_modules/bootstrap/dist/js/bootstrap.js');
  expect(scripts).toContain('node_modules/@ux-aspects/ux-aspects-ng1/ng1/ux-aspects-ng1.js');

  const styles = angularConfig.projects['test-app'].architect.build.options.styles;
  expect(styles).toContain('node_modules/@ux-aspects/ux-aspects-ng1/styles/ux-aspects.css');

  const setupContent = getFileContent(tree, '/projects/test-app/src/app/setup-hybrid.ts');
  (hasRouter ? expect(setupContent) : expect(setupContent).not).toContain(`injector.get(Router).initialNavigation();`);
}

import { apply, applyTemplates, branchAndMerge, chain, mergeWith, move, Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addModuleImportToModule, getProjectFromWorkspace, getProjectMainFile } from '@angular/cdk/schematics';
import { dirname } from 'path';
import * as ts from 'typescript';
import { addDependency } from '../../ng-add/package-config';
import { addScriptImports, addStyleImportsAfter, replaceImport } from '../../utility/angular';
import { addSymbolToNgModuleMetadata, Change, findNode, findNodes, getAppModulePath, getDecoratorMetadata, getMetadataField, getWorkspace, InsertChange, insertImport, latestVersions, RemoveChange, ReplaceChange, updateWorkspace } from '../../utility/index';
import { Schema } from './schema';

const UX_ASPECTS_NG1_VERSION = '^2.0.0';
const ANGULARJS_VERSION = '~1.3.0';
const JQUERY_VERSION = '^3.2.1';
const JQUERY_UI_VERSION = '~1.12.1';

export default function (options: Schema): Rule {
    return chain([
        addDependencies(),
        addTemplateFiles(options),
        addScripts(options),
        addStyles(options),
        updateAppModule(options)
    ]);
}

function addDependencies(): Rule {
    return (tree: Tree, context: SchematicContext): Tree => {
        addDependency(tree, '@ux-aspects/ux-aspects-ng1', UX_ASPECTS_NG1_VERSION);
        addDependency(tree, '@angular/upgrade', latestVersions.Angular);
        addDependency(tree, 'angular', ANGULARJS_VERSION);
        addDependency(tree, 'jquery', JQUERY_VERSION);
        addDependency(tree, 'jquery-ui', JQUERY_UI_VERSION);
        context.addTask(new NodePackageInstallTask());
        return tree;
    };
}

function addTemplateFiles(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
        const workspace = getWorkspace(tree);
        const project = getProjectFromWorkspace(workspace, options.project);

        // Get the dir for the hybrid-setup.ts file
        const appModulePath = getAppModulePath(tree, getProjectMainFile(project));
        const dir = dirname(appModulePath);

        // Create hybrid-setup.ts from the template and move it to the target dir
        const templateContext = {
            ...options,
            router: hasRouter(tree, appModulePath, 'AppModule')
        };
        const templateSource = apply(url('./files'), [applyTemplates(templateContext), move(dir)]);
        const rule = branchAndMerge(chain([mergeWith(templateSource)]));

        return rule(tree, context);
    };
}

function addScripts(options: Schema): Rule {
    return (tree: Tree) => {
        const workspace = getWorkspace(tree);
        const project = getProjectFromWorkspace(workspace, options.project);

        addScriptImports(
            project,
            'node_modules/jquery/dist/jquery.js',
            'node_modules/jquery-ui/ui/version.js',
            'node_modules/jquery-ui/ui/widget.js',
            'node_modules/jquery-ui/ui/data.js',
            'node_modules/jquery-ui/ui/ie.js',
            'node_modules/jquery-ui/ui/scroll-parent.js',
            'node_modules/jquery-ui/ui/position.js',
            'node_modules/jquery-ui/ui/unique-id.js',
            'node_modules/jquery-ui/ui/widgets/mouse.js',
            'node_modules/jquery-ui/ui/widgets/sortable.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/angular/angular.js',
            'node_modules/@ux-aspects/ux-aspects-ng1/ng1/ux-aspects-ng1.js'
        );

        return updateWorkspace(workspace);
    };
}

function addStyles(options: Schema): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const workspace = getWorkspace(tree);
        const project = getProjectFromWorkspace(workspace, options.project);

        // use the UX Aspects no legacy styles instead of the default stylesheet
        replaceImport(
            project,
            'build',
            'styles',
            'node_modules/@ux-aspects/ux-aspects/styles/ux-aspects.css',
            'node_modules/@ux-aspects/ux-aspects/styles/ux-aspects-no-legacy.css');

        addStyleImportsAfter(
            project,
            'node_modules/@ux-aspects/ux-aspects/styles/ux-aspects-no-legacy.css',
            'node_modules/@ux-aspects/ux-aspects-ng1/styles/ux-aspects.css'
        );

        return updateWorkspace(workspace);
    };
}

function updateAppModule(options: Schema): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const workspace = getWorkspace(tree);
        const project = getProjectFromWorkspace(workspace, options.project);
        const appModulePath = getAppModulePath(tree, getProjectMainFile(project));
        const appModuleClassName = 'AppModule';
        const appModuleSource = ts.createSourceFile(
            appModulePath,
            tree.read(appModulePath)!.toString('utf-8'),
            ts.ScriptTarget.Latest,
            true
        );

        const changes: Change[] = [
            insertImport(appModuleSource, appModulePath, 'setupHybrid', './setup-hybrid'),
            ...addImplements(appModuleSource, appModuleClassName, 'DoBootstrap', '@angular/core'),
            addInjection(appModuleSource, appModuleClassName, 'upgrade', 'UpgradeModule'),
            addToMethod(
                appModuleSource,
                appModuleClassName,
                'ngDoBootstrap',
                `
    setupHybrid(this.upgrade.injector);
    this.upgrade.bootstrap(document.body, ['app'], { strictDi: true });
`
            ),
            ...removeFromBootstrapComponents(appModuleSource, 'AppComponent')
        ];

        const recorder = tree.beginUpdate(appModulePath);

        for (const change of changes) {
            if (change instanceof InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            } else if (change instanceof ReplaceChange) {
                const replaceChange = <any>change; // Workaround since the required fields are private in this one
                recorder.remove(replaceChange.pos, replaceChange.oldText.length);
                recorder.insertLeft(replaceChange.pos, replaceChange.newText);
            } else if (change instanceof RemoveChange) {
                const removeChange = <any>change; // Workaround since the required fields are private in this one
                recorder.remove(removeChange.pos, removeChange.toRemove.length);
            }
        }

        tree.commitUpdate(recorder);

        addModuleImportToModule(tree, appModulePath, 'UpgradeModule', '@angular/upgrade/static');

        return tree;
    };
}

/** Return true if the NgModule for the given class imports RouterModule. */
function hasRouter(tree: Tree, modulePath: string, className: string): boolean {
    const source = ts.createSourceFile(
        modulePath,
        tree.read(modulePath)!.toString('utf-8'),
        ts.ScriptTarget.Latest,
        true
    );

    const klass = getClassDeclaration(source, className);
    if (!klass || !klass.decorators) {
        return false;
    }

    // Get the @NgModule decorator
    const decorator = klass.decorators.find(
        decorator =>
            ts.isCallExpression(decorator.expression) &&
            ts.isIdentifier(decorator.expression.expression) &&
            decorator.expression.expression.getText() === 'NgModule'
    );
    if (!decorator) {
        return false;
    }

    // Find the `imports` property
    const metadataNodes = findNodes(decorator, ts.SyntaxKind.PropertyAssignment, undefined, true);
    const imports = metadataNodes.find(
        (metadataNode: ts.Node) =>
            ts.isPropertyAssignment(metadataNode) && metadataNode.name && metadataNode.name.getText() === 'imports'
    ) as ts.PropertyAssignment;
    if (!imports || !ts.isArrayLiteralExpression(imports.initializer)) {
        return false;
    }

    // Look for an import beginning with "RouterModule", e.g. "RouterModule.forRoot(...)"
    return imports.initializer.elements.findIndex((expr: ts.Expression) => expr.getText().startsWith('RouterModule')) !== -1;
}

/** Add injection to the constructor, creating the constructor if required. */
function addInjection(source: ts.SourceFile, className: string, paramName: string, paramType: string): Change {
    let change: Change;

    const klass = getClassDeclaration(source, className);

    const constructor = <ts.ConstructorDeclaration>(
        klass.members.find((member: ts.ClassElement) => member.kind === ts.SyntaxKind.Constructor)
    );

    if (constructor) {
        if (constructor.parameters.find(param => param.type !== undefined && param.type.getText() === paramType)) {
            throw new Error(`Injection of ${ paramType } already present in ${ className }`);
        }

        // Insert the new param at the front of the params list
        change = new InsertChange(source.fileName, constructor.parameters.pos, `private ${ paramName }: ${ paramType }`);
    } else {
        // Insert the constructor at the top of the class
        change = new InsertChange(
            source.fileName,
            klass.members.end,
            `
  constructor(private ${ paramName }: ${ paramType }) {}
`
        );
    }

    return change;
}

/** Add to the body of a method, creating the method if required. */
function addToMethod(source: ts.SourceFile, className: string, methodName: string, body: string): Change {
    let change: Change;

    const klass = getClassDeclaration(source, className);

    const method = <ts.MethodDeclaration>(
        klass.members.find((member: ts.ClassElement) => ts.isMethodDeclaration(member) && member.name && member.name.getText() === methodName)
    );

    if (method) {
        // Insert the content at the top of the existing method body
        change = new InsertChange(source.fileName, method.body!.getStart() + 1, body);
    } else {
        // Create the new function at the end of the class
        change = new InsertChange(
            source.fileName,
            klass.members.end,
            `
  ${ methodName }(): void {
    ${ body.trim() }
  }
`
        );
    }

    return change;
}

/** Add an identifier to the class' `implements` list and imports the symbol, if not already present. */
function addImplements(
    source: ts.SourceFile,
    className: string,
    interfaceName: string,
    interfaceSource: string
): Change[] {
    let changes: Change[] = [];

    const klass = getClassDeclaration(source, className);

    const implementsClause = klass.heritageClauses
        ? klass.heritageClauses.find((heritageClause: ts.HeritageClause) => heritageClause.token === ts.SyntaxKind.ImplementsKeyword)
        : null;
    if (implementsClause) {
        if (!findNode(implementsClause, ts.SyntaxKind.Identifier, interfaceName)) {
            // Add the interface symbol to the existing implements list
            changes = [
                new InsertChange(source.fileName, implementsClause.end, `, ${ interfaceName }`),
                insertImport(source, source.fileName, interfaceName, interfaceSource)
            ];
        }
    } else {
        // Insert a new implements list
        changes = [
            new InsertChange(source.fileName, klass.name!.end, ` implements ${ interfaceName }`),
            insertImport(source, source.fileName, interfaceName, interfaceSource)
        ];
    }

    return changes;
}

function removeFromBootstrapComponents(source: ts.SourceFile, bootstrapClassName: string): Change[] {
    let changes: Change[] = [];

    const decorators = getDecoratorMetadata(source, 'NgModule', '@angular/core');
    if (!decorators || decorators.length < 1) {
        throw new Error(`@NgModule decorator not found in ${ source.fileName }`);
    }

    // Look for a bootstrap field
    const properties = getMetadataField(decorators[0] as ts.ObjectLiteralExpression, 'bootstrap');
    if (properties && properties.length > 0) {
        // Check if the bootstrap field contains the requested class
        const bootstrapClass = findNode(properties[0], ts.SyntaxKind.Identifier, bootstrapClassName) as ts.Identifier;
        if (bootstrapClass) {
            // Remove the class from bootstrap and add it as an entryComponent
            changes = [
                new RemoveChange(source.fileName, bootstrapClass.pos, bootstrapClass.getText()),
                ...addSymbolToNgModuleMetadata(source, source.fileName, 'entryComponents', bootstrapClassName)
            ];
        }
    }

    return changes;
}

function getClassDeclaration(source: ts.SourceFile, className: string): ts.ClassDeclaration {
    const allClasses = findNodes(source, ts.SyntaxKind.ClassDeclaration);

    const classDecl = <ts.ClassDeclaration>(
        allClasses.find((node: ts.Node) => ts.isClassDeclaration(node) && node.name !== undefined && node.name.text === className)
    );
    if (!classDecl) {
        throw new Error(`Could not find class named ${ className }`);
    }

    return classDecl;
}

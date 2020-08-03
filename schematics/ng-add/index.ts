import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { addDependency } from './package-config';
import { NgAddOptions } from './schema';

const UX_ASPECTS_VERSION = '^2.1.0';

export default function (options: NgAddOptions): Rule {
    return (tree: Tree, context: SchematicContext) => {
        return chain([
            addDependencies(),
            setupProject(options)
        ])(tree, context);
    };
}

function addDependencies(): Rule {
    return (tree: Tree, _context: SchematicContext): Tree => {
        addDependency(tree, '@ux-aspects/ux-aspects', UX_ASPECTS_VERSION);
        return tree;
    };
}

function setupProject(options: NgAddOptions): Rule {
    return (tree: Tree, context: SchematicContext) => {
        // install task
        const installTaskId = context.addTask(new NodePackageInstallTask(), []);
        // Ensure installation is complete before running the project setup
        context.addTask(new RunSchematicTask('angularjs-hybrid', options), [installTaskId]);
        return tree;
    };
}

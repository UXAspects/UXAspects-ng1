import { Tree } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';

export function addDependency(tree: Tree, name: string, version: string): void {
  addPackageJsonDependency(tree, {
    name: name,
    version: version,
    type: NodeDependencyType.Default,
    overwrite: false
  });
}

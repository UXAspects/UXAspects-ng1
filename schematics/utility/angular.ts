import { WorkspaceProject } from '@angular-devkit/core/src/experimental/workspace';
import { getProjectTargetOptions } from '@angular/cdk/schematics';

export function addScriptImports(project: WorkspaceProject, ...paths: string[]): void {
  addImports(project, 'build', 'scripts', paths, null, true);
}

export function addStyleImports(project: WorkspaceProject, ...paths: string[]): void {
  addImports(project, 'build', 'styles', paths, null, false);
}

export function addStyleImportsAfter(project: WorkspaceProject, insertAfter: string, ...paths: string[]): void {
  addImports(project, 'build', 'styles', paths, insertAfter, false);
}

function addImports(
  project: WorkspaceProject,
  buildTarget: string,
  importType: 'scripts' | 'styles',
  paths: string[],
  insertAfter: string | null,
  allowPreExisting: boolean
): void {
  const targetOptions = getProjectTargetOptions(project, buildTarget);
  const imports = targetOptions[importType] as string[];

  if (!imports) {
    targetOptions[importType] = [...paths];
  } else {
    const uniquePaths = paths.filter(path => imports.indexOf(path) === -1);
    if (uniquePaths.length < paths.length && !allowPreExisting) {
      throw new Error(`One or more paths are already present`);
    }

    const index = insertAfter ? imports.indexOf(insertAfter) : -1;

    targetOptions[importType].splice(index + 1, 0, ...paths);
  }
}

export function replaceImport(
    project: WorkspaceProject,
    buildTarget: string,
    importType: 'scripts' | 'styles',
    oldPath: string,
    newPath: string): void {

    const targetOptions = getProjectTargetOptions(project, buildTarget);
    const imports = targetOptions[importType] as string[];

    if (!imports) {
        return;
    }

    const pathIndex = targetOptions[importType].indexOf(oldPath);

    if (pathIndex === -1) {
        return;
    }

    targetOptions[importType][pathIndex] = newPath;
}

import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';

export async function createTestApp(runner: SchematicTestRunner, appOptions = {}, tree?: Tree): Promise<UnitTestTree> {
  const workspaceTree = await runner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'workspace',
      {
        name: 'workspace',
        version: '8.0.0',
        newProjectRoot: 'projects'
      },
      tree
    )
    .toPromise();

  return runner
    .runExternalSchematicAsync('@schematics/angular', 'application', { name: 'test-app', ...appOptions }, workspaceTree)
    .toPromise();
}

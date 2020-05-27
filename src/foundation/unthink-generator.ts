import * as path from 'path';
import { UnthinkMiddleware, ResourceDefinition } from './resource-definition';

export interface UnthinkViewRenderer {
  (template: string, value?: unknown): string;
}

export interface UnthinkGeneratorBackend {
  generate(resourceDefinitions: ResourceDefinition<UnthinkMiddleware>[]): void;
}

export class UnthinkGenerator {
  private resourceDefinitions: ResourceDefinition<UnthinkMiddleware>[] = [];
  private generatorBackend: UnthinkGeneratorBackend;

  constructor(generatorBackend: UnthinkGeneratorBackend) {
    this.generatorBackend = generatorBackend;
  }

  add(resourceDefinition: ResourceDefinition<UnthinkMiddleware>): UnthinkGenerator {
    this.resourceDefinitions.push(resourceDefinition);
    return this;
  }

  printRouteTable(): void {
    const tab = '    ';

    console.log('Route Table:');

    for (const resd of this.resourceDefinitions) {
      const basePath = resd.basePath ?? '/';
      console.log(`${tab}Resource: ${resd.name} - ${basePath}`);

      for (const rd of resd.routes) {
        const prefix = rd.prefix ?? '';

        for (const m in rd.methods) {
          const fullPath = path.join(prefix, basePath, rd.path);
          console.log(`${tab}${tab}${m.toUpperCase()} ${rd.__routeType} ${fullPath}`);
        }
      }
    }

    console.log();
  }

  generate(): void {
    this.generatorBackend.generate(this.resourceDefinitions);
  }
}
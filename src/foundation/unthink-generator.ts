import * as path from 'path';
import { ResourceDefinition } from './resource-definition';

export interface UnthinkViewRenderer {
  (template: string, value?: unknown): string;
}

export interface UnthinkGeneratorBackend<ResourceMiddleware> {
  generate(resourceDefinitions: ResourceDefinition<ResourceMiddleware>[]): void;
}

export class UnthinkGenerator<ResourceMiddleware> {
  private resourceDefinitions: ResourceDefinition<ResourceMiddleware>[] = [];
  private generatorBackend: UnthinkGeneratorBackend<ResourceMiddleware>;

  constructor(generatorBackend: UnthinkGeneratorBackend<ResourceMiddleware>) {
    this.generatorBackend = generatorBackend;
  }

  add(resourceDefinition: ResourceDefinition<ResourceMiddleware>): UnthinkGenerator<ResourceMiddleware> {
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
    this.generatorBackend.generate(this.resourceDefinitions, );
  }
}
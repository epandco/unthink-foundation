import { ResourceDefinition } from './resource-definition';


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

  generate(): void {
    this.generatorBackend.generate(this.resourceDefinitions, );
  }
}
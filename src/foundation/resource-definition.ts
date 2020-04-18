import { DataResult, ViewResult } from './result';


/** Routes */

export type RouteMethod = 'get' | 'put' | 'post' | 'delete';
export type ResourceRouteHandler<Result, ResourceMiddleware> = ResourceRouteHandlerBase<Result> | ResourceRouteHandlerWithMiddleware<Result, ResourceMiddleware>
export type ResourceMethodMap<Result, ResourceMiddleware> = Partial<Record<RouteMethod, ResourceRouteHandler<Result, ResourceMiddleware>>>;

// Directly support results from https://www.npmjs.com/package/qs
// Type definition lifted from @types/express didn't see a need to alter
// should be usable across many backends
export interface Query {
  [key: string]: string | Query | (string | Query)[];
}

export interface RouteContext {
  query?: Query;
  params?: Record<string, string>;
  body?: object;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  local?: Record<string, unknown>;
}

export interface ResourceRouteHandlerBase<Result = unknown> {
  (context: RouteContext): Promise<Result>;
}

export interface ResourceRouteHandlerWithMiddleware<Result, ResourceMiddleware> {
  handler: ResourceRouteHandlerBase<Result>;
  middleware: ResourceMiddleware[];
}

export interface ResourceRouteDefinitionBase<Result, ResourceMiddleware> {
  path: string;
  prefix?: string;
  middleware?: ResourceMiddleware[];
  methods: ResourceMethodMap<Result, ResourceMiddleware>;
}

/** Resource definitions */
export type ResourceRouteDefinition<ResourceMiddleware> = ResourceDataRouteDefinition<ResourceMiddleware> | ResourceViewRouteDefinition<ResourceMiddleware>;

export interface ResourceDataRouteDefinition<ResourceMiddleware> extends ResourceRouteDefinitionBase<DataResult, ResourceMiddleware> {
  __routeType: 'DATA';
}

export interface ResourceViewRouteDefinition<ResourceMiddleware> extends ResourceRouteDefinitionBase<ViewResult, ResourceMiddleware> {
  __routeType: 'VIEW';
}

export interface ResourceDefinition<ResourceMiddleware> {
  name: string;
  basePath?: string;
  middleware?: ResourceMiddleware[];
  routes: ResourceRouteDefinition<ResourceMiddleware>[];
}

export interface ResourceConfig<ResourceMiddleware> {
  prefix?: string;
  middleware?: ResourceMiddleware[];
}

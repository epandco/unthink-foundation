import { DataResult, ViewResult } from './result';
import {
  ResourceConfig,
  ResourceDataRouteDefinition,
  ResourceDefinition,
  ResourceMethodMap,
  ResourceRouteHandler,
  ResourceViewRouteDefinition,
  UnthinkCommonMiddleware,
  UnthinkDataMiddleware,
  UnthinkMiddleware,
  UnthinkMiddlewareHandler, UnthinkViewMiddleware
} from './resource-definition';


export function data<ResourceMiddleware>(
  path: string,
  methods: ResourceMethodMap<DataResult, ResourceMiddleware>,
  config: ResourceConfig<ResourceMiddleware> = {}): ResourceDataRouteDefinition<ResourceMiddleware> {

  if (!config.prefix) {
    config.prefix = '/api';
  }

  return {
    path: path,
    methods: methods,
    prefix: config.prefix,
    middleware: config.middleware
  } as ResourceDataRouteDefinition<ResourceMiddleware>;
}

export function view<ResourceMiddleware>(
  path: string,
  handler: string | ResourceRouteHandler<ViewResult, ResourceMiddleware>,
  config: ResourceConfig<ResourceMiddleware> = {}): ResourceViewRouteDefinition<ResourceMiddleware> {

  let methodMap: ResourceMethodMap<ViewResult, ResourceMiddleware>;

  if (typeof handler === 'string') {
    methodMap = {
      'get': async (): Promise<ViewResult> => ViewResult.ok(handler)
    };
  } else {
    methodMap = {
      'get': handler
    };
  }

  return {
    path: path,
    methods: methodMap,
    prefix: config.prefix,
    middleware: config.middleware
  } as ResourceViewRouteDefinition<ResourceMiddleware>;
}

export function commonMiddleware(func: UnthinkMiddlewareHandler): UnthinkCommonMiddleware {
  return func as UnthinkCommonMiddleware;
}

export function dataMiddleware(func: UnthinkMiddlewareHandler): UnthinkDataMiddleware {
  return func as UnthinkDataMiddleware;
}

export function viewMiddleware(func: UnthinkMiddlewareHandler): UnthinkViewMiddleware {
  return func as UnthinkViewMiddleware;
}

export function unthinkResource(
  resourceDefinition: ResourceDefinition<UnthinkMiddleware>
): ResourceDefinition<UnthinkMiddleware> {
  return resourceDefinition;
}


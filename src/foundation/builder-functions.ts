import { DataResult, ViewResult } from './result';
import {
  ResourceConfig,
  ResourceMethodMap,
  ResourceRouteDefinition,
  ResourceRouteHandler,
  ResourceViewRouteDefinition
} from './resource-definition';


export function data<ResourceMiddleware>(
  path: string,
  methods: ResourceMethodMap<DataResult, ResourceMiddleware>,
  config: ResourceConfig<ResourceMiddleware> = {}): ResourceRouteDefinition<ResourceMiddleware> {

  if (!config.prefix) {
    config.prefix = '/api';
  }

  return {
    __routeType: 'DATA',
    path: path,
    methods: methods,
    prefix: config.prefix,
    middleware: config.middleware
  };
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
    __routeType: 'VIEW',
    path: path,
    methods: methodMap,
    prefix: config.prefix,
    middleware: config.middleware
  };
}
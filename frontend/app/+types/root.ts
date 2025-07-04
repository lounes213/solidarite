import type {
  MetaFunction,
  LinksFunction as RouterLinksFunction,
  ErrorBoundaryProps as RouterErrorBoundaryProps,
} from "react-router-dom";

export namespace Route {
  export type MetaArgs = Parameters<MetaFunction>[0];
  export type LinksFunction = RouterLinksFunction;
  export type ErrorBoundaryProps = RouterErrorBoundaryProps;
}
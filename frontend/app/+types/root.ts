import type {
  MetaFunction,
  LinksFunction,
  ErrorBoundaryProps,
} from "react-router-dom";

export namespace Route {
  export type MetaArgs = Parameters<MetaFunction>[0];
  export type LinksFunction = LinksFunction;
  export type ErrorBoundaryProps = ErrorBoundaryProps;
}
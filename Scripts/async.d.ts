declare module "async" {
    export function parallel(functions: Array<Function>, cb: Function);
    export function series(functions: Array<Function>, cb: Function);
}
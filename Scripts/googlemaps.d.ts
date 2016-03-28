declare module "googlemaps" {
    export function geocode(address: string, callback: Function, sensor:boolean, bounds:any, region:string, language:string);
}
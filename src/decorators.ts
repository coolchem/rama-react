


import {eventMetadata} from "./core/utils/dom";
export function skinPart(required:boolean = false):PropertyDecorator{

    return function (target: any, key: string):void {
        if(!target.skinParts)
            target.skinParts = {};

        target.skinParts[key] = {required:required};
    }
}

export function event(name:string):ClassDecorator
{
    return function (constructor:Function):void {
        
        if(!eventMetadata.get(constructor))
            eventMetadata.set(constructor,[]);
        
        var events:string[] = eventMetadata.get(constructor);
        
        if(events.indexOf(name) == -1)
            events.push(name);
    }
}
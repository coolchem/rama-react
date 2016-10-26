


import {REventInit} from "../core/event";
export class IndexChangeEventDetail
{

    oldIndex:number;
    newIndex:number;


    constructor(oldIndex:number, newIndex:number) {
        this.oldIndex = oldIndex;
        this.newIndex = newIndex;
    }
}

export class IndexChangeEventInit extends REventInit<IndexChangeEventDetail>
{
    static CHANGING:string = 'changing';
    static CHANGED:string = 'changed';


    constructor( bubbles:boolean = false,
                 cancelable:boolean = false,
                 oldIndex:number = -1,
                 newIndex:number = -1) {
        
        super(bubbles, cancelable, new IndexChangeEventDetail(oldIndex,newIndex));
    }
}
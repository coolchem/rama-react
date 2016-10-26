

import {PropertySetter} from "./PropertySetter";
import {trim} from "../utils/string-utils";
export class State
{
    propertySetters:PropertySetter[] = [];

    private _name:string;

    private _initialized:boolean;

    private _stateGroups:string[] = [];


    get stateGroups():string[] {
        return this._stateGroups;
    }

    get name():string {
        return this._name;
    }


    constructor(name:string,stateGroups:string) {

        this._name = name;

        if(stateGroups)
        {
            var tempStateGroups:string[] =  stateGroups.split(",");

            tempStateGroups.forEach((stateGroup:string)=>{

                this._stateGroups.push(trim(stateGroup));
            })
        }

    }

    initialize(){

        if(!this._initialized)
        {

            this._initialized = true;
        }

    }

    apply():void{

        for(var i = 0; i< this.propertySetters.length; i++)
        {
            var componentItem:PropertySetter = this.propertySetters[i];

            componentItem.target[componentItem.name] = componentItem.value;
        }

    }
}
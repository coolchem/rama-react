

import {UIElement} from "../UIElement";
export class PropertySetter
{
    private _target:UIElement = null;
    private _name:string = null;
    private _value:string = null;

    private  oldValue = null;


    get target():any {
        return this._target;
    }

    get name():string {
        return this._name;
    }

    get value():any {
        return this._value;
    }

    constructor(target:UIElement, name:string, value:any) {

        this._target = target;
        this._name = name;
        this._value = value;
    }

    apply():void{

        if(this._target)
        {
            this.oldValue = this._target.getAttribute(this._name);

            if(!this.oldValue)
            {
                this.oldValue = ""
            }
            this._target.setAttribute(this._name,this._value);
        }

    }

    remove():void{

        if(this._target)
        {
            this._target.setAttribute(this._name,this.oldValue);
        }

    }

}
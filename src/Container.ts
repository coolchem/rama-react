

import {Component} from "./Component";
import {UIElement} from "./core/UIElement";
import {GroupBase} from "./core/GroupBase";
import {skinPart} from "./decorators";

export abstract class Container extends Component
{
    private _tempChildren:UIElement[];

    @skinPart(false)
    contentGroup:GroupBase;

    getChildren():UIElement[]
    {
        if(this.contentGroup)
            return this.contentGroup.getChildren();

        return this._tempChildren;
    }

    setChildren(elements:UIElement[]):void
    {
        this._tempChildren = elements;

        if(this.contentGroup)
        {
            this.contentGroup.setChildren(this._tempChildren);
        }
    }


    protected partAdded(id:string, instance:any):void {
        super.partAdded(id, instance);

        if(instance === this.contentGroup)
        {
            this.contentGroup.setChildren(this._tempChildren);
        }
    }


    removeChild(element:UIElement):void {
        if(this.contentGroup)
            this.contentGroup.removeChild(element);
    }

    removeAllChildren():void {
        if(this.contentGroup)
            this.contentGroup.removeAllChildren();
    }

    appendChildAt(element:UIElement, index:number):void {
        if(this.contentGroup)
            this.contentGroup.appendChildAt(element, index);
    }

    appendChild(newChild:UIElement):void {

        if(this.contentGroup)
            this.contentGroup.appendChild(newChild);
    }
}
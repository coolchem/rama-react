
import {Skin} from "./Skin";
import {createElement} from "./core/utils/dom";
import {UIElement} from "./core/UIElement";

export abstract class Component extends UIElement
{

    private _skinClass:new()=>any;
    private _skinElement:Skin;

    skinParts:any;

    constructor(element?:Node|string) {

        var el:Node|string;
        if(!element)
        {
            el = "div";
        }
        super(el);
    }


    detached():void {
        this.detachSkin();
    }

    setSkinClass(value:new()=>any) {

        if(this._skinClass !== value)
        {
            this._skinClass = value;

            if(this._initialized)
                this.validateSkinChange();
        }
    }

    protected partAdded(id:string, instance:any):void {
        //Override this method to add functionality to various skin component
    };

    protected partRemoved(id:string, instance:any):void {
        //Override this method to add functionality to various skin component
    };


    protected createChildren():void {
        this.validateSkinChange();
    }

    protected validateSkinChange(){

        if (this._skinElement)
             this.detachSkin();

        this.attachSkin();
    }

    private attachSkin():void {

        if(this._skinClass)
        {
            this._skinElement = new this._skinClass() as Skin;
            this.initializeAndAppendElement(this._skinElement,0);
            this.findSkinParts();
            this.validateSkinState();
        }
    }


    protected validateState():void {
        this.validateSkinState();
    }

    protected validateSkinState():void{

        if(this._skinElement)
        {
            this._skinElement.setCurrentState(this.getCurrentState());
        }
    }

    private detachSkin():void {
        if(this._skinElement)
        {
            this.clearSkinParts();
            this.removeChild(this._skinElement);
        }
    }

    protected findSkinParts():void {
        if (this._skinElement) {
            for (var id in this.skinParts) {
                var skinPart = this.skinParts[id];
                var skinPartFound = false;

                var skinPartElement:UIElement = this._skinElement.getSkinPartByID(id);

                if (skinPartElement) {
                    skinPartFound = true;
                    this[id] = skinPartElement;
                    this.partAdded(id, skinPartElement)
                }

                if (skinPart.required === true && !skinPartFound) {
                    throw new ReferenceError("Required Skin part not found: " + id + " in the Attached skin");
                }
            }
        }
    }

    protected clearSkinParts():void{

        if (this._skinElement) {
            for (var id in this.skinParts) {
                var skinPart = this.skinParts[id];
                if(this[id] !== null)
                {
                    this.partRemoved(id, this[id]);
                }
            }
        }

    }


    appendChild(newChild:UIElement):void {

    }

    appendChildAt(element:UIElement,index:number):void {

    }
}
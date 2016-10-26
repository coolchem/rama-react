


import {GroupBase} from "./core/GroupBase";
import {UIElement} from "./core/UIElement";
import {IndexChangeEventInit} from "./events/IndexChangeEvent";


export class ViewStack extends GroupBase
{

    static ALL:string = "all";

    creationPolicy:string;
    hideClass:string;

    private _selectedIndex:number;
    
    private _tempChildren:Array<UIElement>;
    


    constructor(element?:Node|string) {

        super(!element?'div':element);
        this._selectedIndex = -1;
    }

    getSelectedIndex():number{
        return this._selectedIndex;
    }
    
    setSelectedIndex(value:number):void
    {
        if(value === this._selectedIndex)
            return;
        
        this.updateViewStack(value);
    }
    
    getSelectedChild():UIElement
    {
        return this._children[this._selectedIndex];
    }
    
    setSelectedChild(value:UIElement):void
    {
        var index:number = this._children.indexOf(value);
        
        if(index && index != -1)
        {
            this.updateViewStack(index);
        }
    }

    setChildren(elements:UIElement[]):void
    {

        if (this._initialized) {
            this.removeAllChildren();
            this.createChildren();
            return;
        }

        this._tempChildren = elements
    }

    protected createChildren():void {

        if(this.creationPolicy == ViewStack.ALL)
        {
            this._children = this._tempChildren;
            super.createChildren();
            return;
        }

        if(this._tempChildren && this._tempChildren.length > 0)
        {
            this.updateViewStack(0);
            
        }

    }

    appendChild(element:UIElement)
    {
        if(!(this.creationPolicy == ViewStack.ALL))
        {
            this.appendChildAt(element, this._tempChildren.length)
        }
        else
        {
            super.appendChild(element);
        }

    }
    
    appendChildAt(element:UIElement,index:number)
    {
        if(!(this.creationPolicy == ViewStack.ALL))
        {
            this._tempChildren.splice(index, 0, element);
        }
        else 
        {
            super.appendChildAt(element,index);
        }
       
    }
    
    protected updateViewStack(newIndex:number):void
    {
        var oldIndex:number = this._selectedIndex;
        
        var evt:CustomEvent = new CustomEvent(IndexChangeEventInit.CHANGING, new IndexChangeEventInit(true,true,oldIndex,newIndex));
        
        dispatchEvent(evt);
        
        if(!evt.defaultPrevented)
        {
            this._selectedIndex = newIndex;
            
            //check if child has been created
            
            var oldChild:UIElement = this._tempChildren[oldIndex];
            var newChild:UIElement = this._tempChildren[newIndex];
            
            if(oldChild)
            {
                if(this.hideClass)
                {
                    oldChild.toggleClasses([this.hideClass])
                }
                else
                {
                    (oldChild.getElementRef() as HTMLElement).style.display = "none";
                }
            }

            if(newChild)
            {
                if(newChild.isInitialized())
                {
                    if(this.hideClass)
                    {
                        newChild.toggleClasses([this.hideClass])
                    }
                    else
                    {
                        (newChild.getElementRef() as HTMLElement).style.display = "";
                    }
                }
                else
                {
                    super.appendChildAt(newChild, newIndex);
                }
            }
        }
    }
}
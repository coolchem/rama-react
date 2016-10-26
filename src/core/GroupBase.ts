

import {UIElement} from "./UIElement";

export abstract class GroupBase extends UIElement
{


    setChildren(elements:UIElement[]):void
    {

        if (this._initialized) {
            this.removeAllChildren();
            this._children = elements;
            this.createChildren();
            return;
        }

        this._children = elements
    }

    protected createChildren():void
    {
        if(this._children && this._children.length > 0)
        {
            var docFragment:DocumentFragment = document.createDocumentFragment();


            for(var i=0; i<this._children.length; i++)
            {
                var element:UIElement = this._children[i];

                element.parentElement = this;
                element.initialize();

                element.preAttach();
                docFragment.appendChild(element.getElementRef());
                element.attached();
            }

            this._element.appendChild(docFragment);
        }
    }
}
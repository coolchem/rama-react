
import {ViewBase} from "./core/ViewBase";
import {UIElement} from "./core/UIElement";

export abstract class Skin extends ViewBase
{

    getSkinPartByID(id:string):UIElement
    {
        var part:UIElement = this[id];

        return part ? part: null;
    }
}
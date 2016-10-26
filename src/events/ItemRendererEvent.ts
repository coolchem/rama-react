

import {REventInit} from "../core/event";


export class ItemRendererEventDetail
{
    renderer;
    index:number;
    constructor(renderer,index)
    {
        this.renderer = renderer;
        this.index = index;
    }
}
export class ItemRendererEventInit extends REventInit<ItemRendererEventDetail>
{
    
    static ITEM_RENDERER_ADDED:string = "rendererAdded";
    static ITEM_RENDERER_REMOVED:string = "rendererRemoved";
    
    constructor(renderer, index:number) {
        
        super(false,true,new ItemRendererEventDetail(renderer,index))
    }
}


import {GroupBase} from "./core/GroupBase";
import {ClassFactory} from "./core/ClassFactory";
import {ArrayCollection} from "./core/collections/ArrayCollection";
import {ItemRendererEventInit} from "./events/ItemRendererEvent";
import {CollectionEventKind, CollectionEvent} from "./core/collections/events/CollectionEvent";
import {UIElement} from "./core/UIElement";
import {REvent} from "./core/event";
import {event} from "./decorators";

@event("rendererAdded")
@event("rendererRemoved")
export class DataGroup extends GroupBase
{
    constructor(element?:Node|string)
    {
        super(!element?'div':element);
    }
    
    private indexToRenderer = [];
    
    private _itemRenderer:ClassFactory;
    
    setItemRenderer(itemRenderer: any | ClassFactory)
    {
        if(!(itemRenderer instanceof ClassFactory))
        {
            this._itemRenderer = new ClassFactory(itemRenderer)
        }
        else 
        {
            this._itemRenderer = itemRenderer as ClassFactory;
        }

        this.setDataProviderFn();
    }
    
    getItemRenderer():ClassFactory
    {
        return this._itemRenderer;
    }
    
    private _dataProvider:ArrayCollection<any>;
    
    getDataProvider():ArrayCollection<any>
    {
        return this._dataProvider;
    }
    
    setDataProvider(value:ArrayCollection<any>):void
    {
        if(value === this._dataProvider)
            return;

        this._dataProvider = value;
        this.setDataProviderFn();
        dispatchEvent(new Event("dataProviderChanged"));
    }

    initialized():void
    {
        super.initialized();
        this.setDataProviderFn();
    }

    getItemRendererAtIndex(index):UIElement{

        return this._children[index];
    }


    getItemRendererForItem(item){

        if(this._dataProvider)
        {
            this._children.forEach(function(renderer:any){
                if(renderer.data === item)
                {
                    return renderer;
                }

            })
        }

        return null;
    }

    private removeAllItemRenderers() {

        this.removeAllChildren();
        this.indexToRenderer = [];

    }

    private collectionChangeListener:(event:REvent)=>any = (event:CollectionEvent)=>{
        this.dataProvider_collectionChangeHandler(event);
    };

    private addDataProviderListener() {
        if (this._dataProvider)
            this._dataProvider.addEventListener(CollectionEvent.COLLECTION_CHANGE, this.collectionChangeListener);
    }

    private removeDataProviderListener() {
        if (this._dataProvider)
            this._dataProvider.removeEventListener(CollectionEvent.COLLECTION_CHANGE, this.collectionChangeListener);
    }

    protected dataProvider_collectionChangeHandler(event) {
        switch (event.kind) {
            case CollectionEventKind.ADD:
            {
                // items are added
                this.adjustAfterAdd(event.items, event.location);
                break;
            }

            case CollectionEventKind.REPLACE:
            {
                // items are replaced
                this.adjustAfterReplace(event.items, event.location);
                break;
            }

            case CollectionEventKind.REMOVE:
            {
                // items are removed
                this.adjustAfterRemove(event.items, event.location);
                break;
            }

            case CollectionEventKind.MOVE:
            {
                // one item is moved
                this.adjustAfterMove(event.items[0], event.location, event.oldLocation);
                break;
            }

            case CollectionEventKind.REFRESH:
            {
                // from a filter or sort...let's just reset everything
                this.removeDataProviderListener();
                this.setDataProviderFn();
                break;
            }

            case CollectionEventKind.RESET:
            {
                // reset everything
                this.removeDataProviderListener();
                this.setDataProviderFn()
                break;
            }

            case CollectionEventKind.UPDATE:
            {

                break;
            }
        }
    }

    private setDataProviderFn() {
        if (this._initialized) {
            this.removeAllItemRenderers();
            this.createItemRenderers();
            this.addDataProviderListener();
        }
    }
    
    private removeRendererAt(index) {
        var renderer = this.indexToRenderer[index];
        if (renderer) {
            var item;

            if (renderer.data && this._itemRenderer != null)
                item = renderer.data;
            else
                item = renderer;
            this.itemRemoved(item, index);
        }
    }
    
    private itemRemoved(item, index) {
        // Remove the old renderer at index from indexToRenderer[], from the
        // DataGroup, and clear its data property (if any).

        var oldRenderer = this.indexToRenderer[index];

        if (this.indexToRenderer.length > index)
            this.indexToRenderer.splice(index, 1);

        /*        dispatchEvent(new RendererExistenceEvent(
         RendererExistenceEvent.RENDERER_REMOVE, false, false, oldRenderer, index, item));*/

        if (oldRenderer && oldRenderer.data && oldRenderer !== item)
            oldRenderer.data = null;

        var child = oldRenderer;
        if (child)
        {
            this.removeChild(child);
            var evt = new CustomEvent(ItemRendererEventInit.ITEM_RENDERER_REMOVED, new ItemRendererEventInit(child, index));
            this.dispatchEvent(evt);
        }

    }

    
    private createRendererForItem(item) {
        if (this._itemRenderer != null) {
            var renderer = this._itemRenderer.newInstance();
            
            if(renderer.setData)
                renderer.setData(item);

            renderer.data = item;
            return renderer
        }
        return null;
    }

    private createItemRenderers() {
        if (!this._dataProvider) {
            this.removeAllItemRenderers();
            return;
        }

        var dataProviderLength = this._dataProvider.length;

        // Remove the renderers we're not going to need
        for (var index = this.indexToRenderer.length - 1; index >= dataProviderLength; index--)
            this.removeRendererAt(index);

        // Reset the existing renderers
        for (index = 0; index < this.indexToRenderer.length; index++) {
            var item = this._dataProvider.getItemAt(index);
            var renderer = this.indexToRenderer[index];

            this.removeRendererAt(index);
            this.itemAdded(item, index);
        }

        // Create new renderers
        for (index = this.indexToRenderer.length; index < dataProviderLength; index++)
            this.itemAdded(this._dataProvider.getItemAt(index), index);

    }

    itemAdded(item, index) {
        var myItemRenderer = this.createRendererForItem(item);
        this.indexToRenderer.splice(index, 0, myItemRenderer);
        this.appendChildAt(myItemRenderer, index);
        var evt = new CustomEvent(ItemRendererEventInit.ITEM_RENDERER_ADDED, new ItemRendererEventInit(myItemRenderer,index));
        this.dispatchEvent(evt);
    }
    
    private adjustAfterAdd(items, location) {
        var length = items.length;
        for (var i = 0; i < length; i++) {
            this.itemAdded(items[i], location + i);
        }

        // the order might have changed, so we might need to redraw the other
        // renderers that are order-dependent (for instance alternatingItemColor)
        this.resetRenderersIndices();
    }

    private adjustAfterRemove(items, location) {
        var length= items.length;
        for (var i = length - 1; i >= 0; i--) {
            this.itemRemoved(items[i], location + i);
        }
        
        this.resetRenderersIndices();
    }
    
    private adjustAfterMove(item, location, oldLocation) {
        this.itemRemoved(item, oldLocation);
        this.itemAdded(item, location);
        this.resetRenderersIndices();
    }
    
    private adjustAfterReplace(items, location) {
        var length= items.length;
        for (var i= length - 1;i >= 0; i-- )
        {
            this.itemRemoved(items[i].oldValue, location + i);
        }

        for (i = length - 1; i >= 0; i--) {
            this.itemAdded(items[i].newValue, location);
        }
    }
    
    private resetRenderersIndices() {
        if (this.indexToRenderer.length == 0)
            return;
        var indexToRendererLength = this.indexToRenderer.length;
        for (var index = 0; index < indexToRendererLength; index++)
            this.resetRendererItemIndex(index);
    }

    private resetRendererItemIndex(index)
    {
        var renderer = this.indexToRenderer[index];
        if (renderer)
            renderer.itemIndex = index;
    }
    
    
}
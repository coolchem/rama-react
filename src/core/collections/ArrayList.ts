

import {UIEventDispatcher} from "../UIEventDispatcher";
import {CollectionEvent} from "./events/CollectionEvent";
import {CollectionEventKind} from "./events/CollectionEvent";
import {ModelEventDispatcher} from "../ModelEventDispatcher";

export class ArrayList<T> extends ModelEventDispatcher{

    private _dispatchEvents:number = 0;

    private _source:Array<T>= null;


    getSource():Array<T> {
        return this._source;
    }

    setSource(value:Array<T>) {

        var i;
        var len;
        this._source = value ? value : [];

        if (this._dispatchEvents == 0) {

            var event = new CollectionEvent(CollectionEvent.COLLECTION_CHANGE,CollectionEventKind.RESET);
            this.dispatchEvent(event);
        }
    }

    get length():number
    {
        if (this._source)
            return this._source.length;
        else
            return 0;
    }


    constructor(source?:Array<T>) {

        super();
        this.disableEvents();
        this.setSource(source);
        this.enableEvents();
    }

    addItem(item):void {

        this.addItemAt(item, this.length);
    };

    addItemAt(item, index):void {

        if (index < 0 || index > this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                "this collection of length " + this.length;
            throw new RangeError(message);
        }

        this._source.splice(index, 0, item);
        this.internalDispatchEvent(CollectionEventKind.ADD, item, index);
    }

    addAll(addList:T[]):void {

        this.addAllAt(addList, this.length);
    }

    addAllAt(addList:T[], index:number):void {

        var length = addList.length;
        for (var i = 0; i < length; i++) {
            this.addItemAt(addList[i], i + index);
        }
    }

    getItemIndex(item:T):number {
        return this._source.indexOf(item);
    };

    removeItem(item:T):boolean {
        var index = this.getItemIndex(item);
        var result:boolean = index >= 0;
        if (result)
            this.removeItemAt(index);

        return result;

    }

    removeItemAt(index:number) {

        if (index < 0 || index >= this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                "this collection of length " + this.length;
            throw new RangeError(message);
        }

        var removed = this._source.splice(index, 1)[0];

        this.internalDispatchEvent(CollectionEventKind.REMOVE, removed, index);
        return removed;
    };

    removeAll():void {

        if (this.length > 0) {
            this._source.splice(0, this.length);
            this.internalDispatchEvent(CollectionEventKind.RESET);
        }

    }

    toArray():Array<T>{

        return this._source.concat();
    }

    toString():string{

        return this._source.toString();

    }

    getItemAt(index:number) {

        if (index < 0 || index >= this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                "this collection of length " + this.length;
            throw new RangeError(message);
        }

        return this._source[index];
    };

    setItemAt(item:T, index:number) {
        if (index < 0 || index >= this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                "this collection of length " + this.length;
            throw new RangeError(message);
        }

        var oldItem = this._source[index];
        this._source[index] = item;

        if (this._dispatchEvents == 0) {
            var hasCollectionListener = this.hasEventListener(CollectionEvent.COLLECTION_CHANGE);
            if (hasCollectionListener) {

                var event:CollectionEvent = new CollectionEvent(CollectionEvent.COLLECTION_CHANGE);
                event.kind = CollectionEventKind.REPLACE;
                event.location = index;

                var updateInfo:any = {};
                updateInfo.oldValue = oldItem;
                updateInfo.newValue = item;
                updateInfo.property = index;
                event.items.push(updateInfo);
                this.dispatchEvent(event);
            }
        }
        return oldItem;
    }

    refresh() {
        var refreshEvent = new CollectionEvent(CollectionEvent.COLLECTION_CHANGE);
        refreshEvent.kind = CollectionEventKind.REFRESH;
        this.dispatchEvent(refreshEvent);
    }

    forEach(fn:(item:T)=>void,context:any){

        for(var i = 0; i < this.length; i++)
        {
            fn.call(context, this._source[i]);
        }

    }


    protected internalDispatchEvent(kind:string, item?:T, location?:number) {
        if (this._dispatchEvents == 0) {
            if (this.hasEventListener(CollectionEvent.COLLECTION_CHANGE)) {

                var event:CollectionEvent = new CollectionEvent(CollectionEvent.COLLECTION_CHANGE,kind,location);
                event.items.push(item);
                this.dispatchEvent(event);
            }

        }
    }


    protected enableEvents() {
        this._dispatchEvents++;
        if (this._dispatchEvents > 0)
            this._dispatchEvents = 0;
    }

    protected disableEvents() {
        this._dispatchEvents--;
    }
}
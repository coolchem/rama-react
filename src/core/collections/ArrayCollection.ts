
import {ModelEventDispatcher} from "../ModelEventDispatcher";
import {ArrayList} from "./ArrayList";
import {CollectionEvent} from "./events/CollectionEvent";
import {CollectionEventKind} from "./events/CollectionEvent";


/**
 * ArrayCollection is one of two collection types which is used as a model.
 * 
 * it Dispatches events based on type of action being taken on the collection.
 */
export class ArrayCollection<T> extends ModelEventDispatcher
{

    private _sortFunction:(item1:T,item2:T)=>number;

    private _filterFunction:(item:T)=>boolean;


    /**
     * 
     * @param value
     */
    set sortFunction(value:(item1:T,item2:T)=>number)
    {
        this._sortFunction = value;
    }

    get sortFunction():(item1:T,item2:T)=>number
    {
        return this._sortFunction
    }

    set filterFunction(value:(item:T)=>boolean)
    {
        this._filterFunction = value;
    }

    get filterFunction():(item:T)=>boolean
    {
        return this._filterFunction
    }

    get length():number
    {
        if (this._localIndex)
        {
            return this._localIndex.length;
        }
        else if (this._list)
        {
            return this._list.length;
        }
        else
        {
            return 0;
        }
    }

    private _localIndex:Array<T>;
    private _list:ArrayList<T>;

    setSource(source:Array<T>)
    {
        if(this._list && this._list.getSource() === source)
            return;

        this._list = new ArrayList<T>(source);
        this.internalRefresh(false);
        this._list.addEventListener(CollectionEvent.COLLECTION_CHANGE, (event:CollectionEvent)=>{
            this.dataProvider_collectionChangeHandler(event)
        });
    }

    getSource():Array<T>
    {
        if(this._list)
            return this._list.getSource();
        return null;
    }

    constructor(source?:Array<T>, filterFunc?:(item:T)=>any,sortFunction?:(item1:T,item2:T)=>number) {
        super();

        this._filterFunction = filterFunc;
        this._sortFunction = sortFunction;

        this.setSource(source);
    }


    addItem(item:T) {

        this.addItemAt(item, this.length);
    };

    addItemAt(item:T, index:number) {

        if (index < 0 || index > this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                "this collection of length " + this.length;
            throw new RangeError(message);
        }

        var listIndex = index;
        if (this._localIndex && this._sortFunction)
        {
            listIndex = this._list.length;
        }
        else if (this._localIndex && this._filterFunction != null)
        {
            if (listIndex == this._localIndex.length)
                listIndex = this._list.length;
            else
                listIndex = this._list.getItemIndex(this._localIndex[index]);
        }

        this._list.addItemAt(item, listIndex);
    };

    addAll(addList:Array<T>) {

        this.addAllAt(addList, this.length);
    }

    addAllAt(addList:Array<T>, index:number) {

        var length = addList.length;
        for (var i = 0; i < length; i++) {
            this.addItemAt(addList[i], i + index);
        }
    };

    getItemIndex(item:T):number {
        var i;

        if (this._localIndex)
        {
            var len = this._localIndex.length;
            for (i = 0; i < len; i++)
            {
                if (this._localIndex[i] == item)
                    return i;
            }

            return -1;
        }

        return this._list.getItemIndex(item);
    };

    removeItem(item:T) {
        var index = this.getItemIndex(item);
        var result = index >= 0;
        if (result)
            this.removeItemAt(index);

        return result;

    };

    removeItemAt(index:number):T {

        if (index < 0 || index >= this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                "this collection of length " + this.length;
            throw new RangeError(message);
        }
        var listIndex = index;
        if (this._localIndex)
        {
            var oldItem = this._localIndex[index];
            listIndex = this._list.getItemIndex(oldItem);
            this._localIndex.splice(index, 1);
        }
        return this._list.removeItemAt(listIndex);
    };

    removeAll() {

        var len = this.length;
        if (len > 0)
        {
            if (this._localIndex)
            {
                for (var i = len - 1; i >= 0; i--)
                {
                    this.removeItemAt(i);
                }
            }
            else
            {
                this._list.removeAll();
            }
        }

    };

    toArray(){

        var ret;
        if (this._localIndex)
        {
            ret = this._localIndex.concat();
        }
        else
        {
            ret = this._list.toArray();
        }
        return ret;
    };

    toString(){

        if (this._localIndex)
        {
            return this._localIndex.toString();
        }
        else
        {
            if (this._list && this._list.toString)
                return this._list.toString();
            else
                this.toString();
        }

    };


    getItemAt(index:number) {

        if (index < 0 || index >= this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                "this collection of length " + this.length;
            throw new RangeError(message);
        }
        if (this._localIndex)
        {
            return this._localIndex[index];
        }
        else if (this._list)
        {
            return this._list.getItemAt(index);
        }

        return null;
    };

    setItemAt(item:T, index:number) {
        if (index < 0 || index >= this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                "this collection of length " + this.length;
            throw new RangeError(message);
        }

        var listIndex = index;
        if (this._localIndex)
        {
            var oldItem = this._localIndex[index];
            listIndex = this._list.getItemIndex(oldItem);
            this._localIndex[index] = item;
        }
        return this._list.setItemAt(item, listIndex);
    };

    refresh() {

        this.internalRefresh(true);
    };

    forEach(fn:(item:T)=>void,context?:any){

        for(var i = 0; i < this.length; i++)
        {
            fn.call(context, this.getItemAt(i));
        }

    }

    protected dataProvider_collectionChangeHandler(event:CollectionEvent) {

        var newEvent:CollectionEvent = new CollectionEvent(CollectionEvent.COLLECTION_CHANGE);
        for(var propName in newEvent)
        {
            if(event.hasOwnProperty(propName))
                newEvent[propName] = event[propName];
        }
        this.dispatchEvent(newEvent);
    }

    private internalRefresh(dispatch)
    {
        if (this._sortFunction || this._filterFunction)
        {
            if (this._list)
            {
                this._localIndex = this._list.toArray();
            }
            else
            {
                this._localIndex = [];
            }

            if (this._filterFunction != null)
            {
                var tmp = [];
                var len = this._localIndex.length;
                for (var i = 0; i < len; i++)
                {
                    var item = this._localIndex[i];
                    if (this._filterFunction(item))
                    {
                        tmp.push(item);
                    }
                }
                this._localIndex = tmp;
            }
            if (this._sortFunction)
            {
                this._localIndex.sort(this._sortFunction);
                dispatch = true;
            }
        }
        else if (this._localIndex)
        {
            this._localIndex = null;
        }

        if (dispatch)
        {
           this._list.refresh()
        }
    }
}
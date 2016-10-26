

export abstract class UIEventDispatcher implements EventTarget
{
    private eventListenersDictionary = {};

    protected _element:Node;

    constructor(element?:Node)
    {
        this.__setElementRef(element)
    }

    __setElementRef(node:Node){
        this._element = node;
        this[0] = node;
    }

    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void
    {
        this._element.addEventListener(type,listener,useCapture);

        if(this.eventListenersDictionary[type] === undefined || this.eventListenersDictionary[type] === null)
        {
            this.eventListenersDictionary[type] = [];
        }

        (listener as any).useCapture = useCapture;

        this.eventListenersDictionary[type].push(listener);
    }
    dispatchEvent(evt: Event): boolean{

        this._element.dispatchEvent(evt);

        return !evt.defaultPrevented;
    }
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void
    {
        this._element.removeEventListener(type, listener,useCapture);

        if(this.eventListenersDictionary[type] !== undefined && this.eventListenersDictionary[type] !== null)
        {
            var index = this.eventListenersDictionary[type].indexOf(listener);
            if(index > -1)
            {
                this.eventListenersDictionary[type].splice(index, 1)
            }

            if(this.eventListenersDictionary[type].length <= 0)
            {
                this.eventListenersDictionary[type] = null;
            }

        }
    }

    hasEventListener(type:string):boolean
    {

        return this.eventListenersDictionary[type] !== undefined && this.eventListenersDictionary[type] !== null;
    }

    removeAllEventListeners():void
    {
        for(var type in this.eventListenersDictionary)
        {

            if(this.eventListenersDictionary[type] !== null)
            {

                for (var i = this.eventListenersDictionary[type].length - 1; i >= 0; i -= 1) {

                    var item = this.eventListenersDictionary[type][i];

                    this.removeEventListener(type, item, item.useCapture);

                }
            }
        }
    }

}


export class REventInit<D> implements CustomEventInit
{

    bubbles:boolean;
    cancelable:boolean;
    detail:D;


    constructor(bubbles?:boolean, cancelable?:boolean, detail?:D) {
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.detail = detail;
    }
}

export class REvent
{
    private _type:string;


    get type():string {
        return this._type;
    }

    constructor(eventName:string){

        this._type = eventName;
    }

}

import {REventInit} from "../../event";
import {REvent} from "../../event";
export const CollectionEventKind = {
    ADD:"add",
    MOVE:"move",
    REMOVE:"remove",
    REPLACE:"replace",
    EXPAND:"expand",
    REFRESH:"refresh",
    RESET:"reset",
    UPDATE:"update"

};

export class CollectionEvent extends REvent
{
    static COLLECTION_CHANGE:"collectionChange";

    kind:string;
    location:number;
    oldLocation:number;
    items:any[];

    constructor(eventName:string,kind?:string, location?:number,
                oldLocation?:number, items?:any[]) {
        super(eventName);

        this.kind = kind;
        this.location = location;
        this.oldLocation = oldLocation;

        this.items = items ? items : [];
    }
}



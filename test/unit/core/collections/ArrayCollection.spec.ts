

import {ArrayCollection} from "../../../../src/core/collections/ArrayCollection";
import {throws} from "assert";
import {CollectionEvent} from "../../../../src/core/collections/events/CollectionEvent";
import {CollectionEventKind} from "../../../../src/core/collections/events/CollectionEvent";
describe('ArrayCollection Spec', ()=> {

    var ac:ArrayCollection<string>;

    function filterFunction(item:string):boolean
    {
        return !(item == "c" || item == "e");
    }

    function sortFunction(item1:string,item2:string):number
    {
        return item1.localeCompare(item2)
    }


    beforeEach(()=>{

        ac = new ArrayCollection(["c","b","d","a","e"])

    });


    describe("set filterFunction",()=>{

        it("should filter when refresh is called after setting",()=>{

            ac.filterFunction = filterFunction;
            ac.refresh();

            expect(ac.length).toEqual(3);

            //making sure source array is not affected
            expect(ac.getSource().length).toEqual(5);
        });
    });

    describe("setSortFunction",()=>{

        it("should sort when refresh is called after setting",()=>{

            ac.sortFunction = sortFunction;
            ac.refresh();

            expect(ac.getItemIndex("c")).toEqual(2);
            expect(ac.getSource().indexOf("c")).toEqual(0);


        });

    });

    describe("getItemAt",()=>{

        beforeEach(()=>{

            ac = new ArrayCollection(["c","b","d","a","e"])

        });

        it("should throw index out of bound error",()=>{

            function throwErrorLowerBound():void
            {
                ac.getItemAt(-1);
            }

            function throwErrorHigherBound():void
            {
                ac.getItemAt(ac.length);
            }

            expect(throwErrorHigherBound).toThrowError();
            expect(throwErrorLowerBound).toThrowError();
        });

        it("should get item from sorted or filtered (modified) Collection if the Collection is sorted or Filtered",()=>{

            ac.filterFunction = filterFunction;
            ac.refresh();

            expect(ac.getItemAt(0)).toEqual("b");

            ac.filterFunction = null;
            ac.sortFunction = sortFunction;
            ac.refresh();

            expect(ac.getItemAt(0)).toEqual("a");


        });

        it("should get item from source if list collection is not modified",()=>{
            expect(ac.getItemAt(0)).toEqual("c");
        });

    });

    describe("getItemIndex",()=>{

        beforeEach(()=>{

            ac = new ArrayCollection(["c","b","d","a","e"])

        });

        it("should return -1 if item not found in the list",()=>{

            expect(ac.getItemIndex("f")).toEqual(-1);
        });

        it("should return index from modified array if the Collection is modified",()=>{
            ac.filterFunction = filterFunction;
            ac.refresh();

            expect(ac.getItemIndex("c")).toEqual(-1);

            expect(ac.getItemIndex("b")).toEqual(0);

            ac.filterFunction = null;
            ac.sortFunction = sortFunction;
            ac.refresh();

            expect(ac.getItemIndex("a")).toEqual(0);
        });

        it("should return index from source for unmodified",()=>{
            expect(ac.getItemIndex("c")).toEqual(0);
        });
    });

    describe("addItemAt",()=>{

        beforeEach(()=>{

            ac = new ArrayCollection(["c","b","d","a","e"])

        });

        it("should throw index out of bound error",()=>{

            function throwErrorLowerBound():void
            {
                ac.addItemAt("humm",-1);
            }

            function throwErrorHigherBound():void
            {
                ac.addItemAt("humm",ac.length+1);
            }

            expect(throwErrorHigherBound).toThrowError();
            expect(throwErrorLowerBound).toThrowError();

        });

        it("should ignore the index if the Collection is Sorted and add item to the end",()=>{
            ac.sortFunction = sortFunction;
            ac.refresh();

            ac.addItemAt("humm",2);

            expect(ac.getSource().indexOf("humm")).toEqual(5);
        });

        it("should add item to the end of source list for filtered list length equals index ",()=>{

            ac.filterFunction = filterFunction;
            ac.refresh();

            ac.addItemAt("humm",3);

            expect(ac.getSource().indexOf("humm")).toEqual(5);

        });

        it("should add item to beginning or before the index of the item in the source list ",()=>{

            ac.filterFunction = filterFunction;
            ac.refresh();

            ac.addItemAt("humm",2);
            expect(ac.getSource().indexOf("humm")).toEqual(3);

        });
    });


    describe("removeItemAt",()=>{

        beforeEach(()=>{

            ac = new ArrayCollection(["c","b","d","a","e"])

        });


        it("should throw index out of bound error",()=>{
            it("should throw index out of bound error",()=>{

                function throwErrorLowerBound():void
                {
                    ac.removeItemAt(-1);
                }

                function throwErrorHigherBound():void
                {
                    ac.removeItemAt(ac.length);
                }

                expect(throwErrorHigherBound).toThrowError();
                expect(throwErrorLowerBound).toThrowError();

            });
        });

        it("should find item from the modified array, if modified,  and remove item from source list",()=>{
            ac.filterFunction = filterFunction;
            ac.refresh();

            ac.removeItemAt(1);


            expect(ac.getSource().length).toEqual(4);

            expect(ac.length).toEqual(2);
            expect(ac.getSource().indexOf("d")).toEqual(-1);

        });
    });

    describe("setItemAt",()=>{


        beforeEach(()=>{

            ac = new ArrayCollection(["c","b","d","a","e"])

        });

        it("should throw index out of bound error",()=>{
            function throwErrorLowerBound():void
            {
                ac.setItemAt("humm",-1);
            }

            function throwErrorHigherBound():void
            {
                ac.setItemAt("humm",ac.length);
            }

            expect(throwErrorHigherBound).toThrowError();
            expect(throwErrorLowerBound).toThrowError();

        });
        it("should find item from the modified array, if modified,  and set item to end if index > modified list length",()=>{

            ac.filterFunction = filterFunction;
            ac.refresh();

            ac.setItemAt("humm",2);

            expect(ac.getSource()[3]).toEqual("humm");
        });
    });
    describe("refresh",()=>{

        it("should dispatch Refresh event",(done)=>{

            function handleRefresh(event:CollectionEvent):void
            {
                expect(event.kind).toEqual(CollectionEventKind.REFRESH);
                done()
            }

            ac.addEventListener(CollectionEvent.COLLECTION_CHANGE,handleRefresh);
            ac.refresh();
        });
    });



});
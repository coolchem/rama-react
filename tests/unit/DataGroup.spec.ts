

import {TestDataGroup} from "./core/test-views";
import {DataGroup} from "../../src/DataGroup";
import {ArrayCollection} from "../../src/core/collections/ArrayCollection";
import {DOMElement} from "../../src/core/DOMElement";
import {Group} from "../../src/Group";

describe('DataGroup Spec', () => {

    describe("Setting initial properties",()=>{

        it("should set the ItemRenderer",()=>{

            var view = new TestDataGroup();

            view.initialize();

            var dataGroup:DataGroup = view.getChildren()[0] as DataGroup;

            expect(dataGroup.getItemRenderer()).toBeDefined();
        });

        it("should create ItemRenderers when DataProvider is set From node",()=>{

            var view = new TestDataGroup();

            view.initialize();

            var dataGroup:DataGroup = view.getChildren()[0] as DataGroup;

            expect(dataGroup.getChildren().length == 2).toEqual(true);
        })
    });

    describe("setDataProvider",()=>{

        var dataProvider:ArrayCollection<string>;

        beforeEach(()=>{

            dataProvider = new ArrayCollection(["test1","test2"]);

        });


        it("should create ItemRenderers when the DataProvider is set",()=>{

            var dataGroup:DataGroup = new DataGroup();
            dataGroup.initialize();

            dataGroup.setItemRenderer(Group);

            dataGroup.setDataProvider(dataProvider);

            expect(dataGroup.getChildren().length == 2).toBe(true);


        });

        it("should create new ItemRenderers when new item is added to the dataProvider",()=>{

            var dataGroup:DataGroup = new DataGroup();
            dataGroup.initialize();

            dataGroup.setItemRenderer(Group);

            dataGroup.setDataProvider(dataProvider);

            expect(dataGroup.getChildren().length == 2).toBe(true);


            dataProvider.addItem("test3");

            expect(dataGroup.getChildren().length == 3).toBe(true);
        });

        it("should remove itemRenderers when new item is removed from the dataProvider",()=>{

            var dataGroup:DataGroup = new DataGroup();
            dataGroup.initialize();

            dataGroup.setItemRenderer(Group);

            dataGroup.setDataProvider(dataProvider);

            expect(dataGroup.getChildren().length == 2).toBe(true);
            
            dataProvider.removeItem("test2");

            expect(dataGroup.getChildren().length == 1).toBe(true);
        })
    })

});
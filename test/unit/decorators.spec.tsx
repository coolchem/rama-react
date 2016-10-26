
import {skinPart} from "../../src/decorators";
import {ViewBase} from "../../src/core/ViewBase";
import {DataGroup} from "../../src/DataGroup";
import {ArrayCollection} from "../../src/core/collections/ArrayCollection";
import {Group} from "../../src/Group";
import {rama} from "../../src/index"


describe('decorators Spec', () => {


    describe("skinPart decorator",()=>{


        it("should add skinpart",()=>{


            class TesComp2{

                @skinPart(false)
                part1:HTMLElement;

                @skinPart()
                part2:HTMLElement;
            }


            var testComp:any = new TesComp2();

            expect(testComp.skinParts["part2"]).toBeDefined();
            expect(testComp.skinParts["part1"]).toBeDefined();
        });

    });

    describe("event decorator",()=>{


        it("should add handler to the target with the event name",()=>{


            class TestEventDecorator extends ViewBase
            {

                dataGroup:DataGroup;

                protected dataProvider:ArrayCollection<string> = new ArrayCollection(["test1","test2"]);

                attached():void {
                    super.attached();
                }

                private rendererAddedHandler = (event:Event):void =>{

                    this.dispatchEvent(new CustomEvent("success"));
                };

                render(){
                    return <div>
                        <DataGroup id="dataGroup" rendererAdded={this.rendererAddedHandler} itemRenderer={Group} dataProvider={this.dataProvider} />
                    </div>
                }
            }


            var testComp:any = new TestEventDecorator();
            testComp.initialize();

            expect(testComp.dataGroup.hasEventListener("rendererAdded")).toBe(true);

        });

        it("should call the handler when the event is dispatched on the target",(done)=>{


            class TestEventDecorator extends ViewBase
            {

                dataGroup:DataGroup;

                dataProvider:ArrayCollection<string> = new ArrayCollection(["test1","test2"]);

                attached():void {
                    super.attached();
                }

                private rendererAddedHandler = (event:Event):void =>{

                    done();
                };

                render(){
                    return <div>
                        <DataGroup id="dataGroup" rendererAdded={this.rendererAddedHandler} itemRenderer={Group} dataProvider={this.dataProvider} />
                    </div>
                }
            }


            var testComp:any = new TestEventDecorator();
            testComp.initialize();
            testComp.dataProvider.addItem("test6");

        });


    });
});
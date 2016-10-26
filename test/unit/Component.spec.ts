

import {Skin} from "../../src/Skin";
import {createElement} from "../../src/core/utils/dom";
import {Component} from "../../src/Component";
import {skinPart} from "../../src/decorators";
import {UIElement} from "../../src/core/UIElement";
import {TestSkin} from "./skins";
import {TestSkin2} from "./skins";
import {DOMElement} from "../../src/core/DOMElement";
import {TestComponentAsRootNode, TestViewWithComponentAsRoot} from "./test-components";


class TestComp extends Component
{

}

class TestCompRequiredSkinParts extends Component
{

    @skinPart(true)
    testComp:UIElement
}



describe('Component Spec', () => {

    describe("createChildren",()=>{

        it("should attachSkin if skinClass is set",()=>{

            var testComp:Component = new TestComp();
            testComp.setSkinClass(TestSkin);
            testComp.initialize();

            expect(testComp.getChildren().length).toBe(1);
            expect(testComp.getChildren()[0] instanceof Skin).toBe(true);

        });

    });


    describe("setSkinClass",()=>{

        it("should attachSkin if component is initialized",()=>{
            var testComp:Component = new TestComp();
            testComp.initialize();
            testComp.setSkinClass(TestSkin);

            expect(testComp.getChildren().length).toBe(1);
            expect(testComp.getChildren()[0] instanceof Skin).toBe(true);
        });
    });


    describe("detachedCallback",()=>{

        it("should detach the skin if skin is attached",()=>{
            
            var testComp:Component = new TestComp();
            testComp.setSkinClass(TestSkin);

            var divContainer:UIElement = new DOMElement("div");
            divContainer.appendChild(testComp);
            divContainer.initialize();
            divContainer.removeChild(testComp);
            
            expect(testComp.getChildren().length).toEqual(0);

        });
    });

    describe("validateSkinChange",()=>{


        it("should detachSkin and attach new skin if skin is already attached",()=>{

            var testComp:Component = new TestComp();
            testComp.setSkinClass(TestSkin);
            testComp.initialize();

            testComp.setSkinClass(TestSkin2);

            expect(testComp.getChildren()[0] instanceof TestSkin2).toBe(true);

        });
    });

    describe("setCurrentState",()=>{


        it("should pass the component state to skin state",()=>{

            var testComp:Component = new TestComp();
            testComp.setSkinClass(TestSkin);
            testComp.initialize();

            expect(testComp.getCurrentState()).toEqual("");
            testComp.setCurrentState("testState");

            expect(testComp.getChildren()[0].getCurrentState()).toEqual("testState");

        });

        it("should not affect the state of skin when the component is root node in a view",()=>{

            var testView:TestViewWithComponentAsRoot = new TestViewWithComponentAsRoot();
            testView.initialize();

            testView.setCurrentState("testViewState");

            expect(testView.testRootNodeComp.getCurrentState()).toEqual("testState");
            expect(testView.testRootNodeComp.getCurrentSkinState()).toEqual("testState");

        });
    });

    describe("attachSkin",()=>{

        it("should throw error if required skin parts not found",()=>{
            var throws = function(){
                var testComp:Component = new TestCompRequiredSkinParts();
                testComp.setSkinClass(TestSkin);
                testComp.initialize();
            };

            expect(throws).toThrowError();

        });

        it("should call part added with reference to registered skin parts",(done)=>{

            class TestPartAdded extends Component
            {

                @skinPart(true)
                testComp:HTMLDivElement;


                protected partAdded(id:string, instance:any):void {
                    super.partAdded(id, instance);

                    expect(this.testComp === instance).toBe(true);
                    expect(id).toEqual("testComp");

                    done()
                }
            }

            var testComp:Component = new TestPartAdded();
            testComp.setSkinClass(TestSkin2);
            testComp.initialize();
        });
    });

    describe("detachSkin",()=>{

        it("should call partRemoved with reference to registered skinParts",(done)=>{

            class TestPartRemoved extends Component
            {

                @skinPart(true)
                testComp:HTMLDivElement;


                protected partRemoved(id:string, instance:any):void {
                    super.partRemoved(id, instance);


                    expect(this.testComp === instance).toBe(true);
                    expect(id).toEqual("testComp");

                    done()
                }
            }

            var testComp:Component = new TestPartRemoved();
            testComp.setSkinClass(TestSkin2);

            var divContainer:UIElement = new DOMElement("div");
            divContainer.appendChild(testComp);
            divContainer.initialize();

            divContainer.removeChild(testComp);



        });


    });



});
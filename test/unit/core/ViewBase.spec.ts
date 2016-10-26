
import {UIElement} from "../../../src/core/UIElement";
import {ViewBase} from "../../../src/core/ViewBase";
import {
    TestView,
    MyTestView,
    TestViewTransclude,
    TestComp,
    TestViewWithStates,
    TestCustomElementRootNodeView, TestParentView
} from "./test-views";

describe('ViewBase Spec', () => {


    describe("instance Creation and Initialization",()=>{

        it("should not render anything if render returns null",()=>{

            class TestViewNullRender extends ViewBase
            {
                
                render() {
                    return null;
                }
            }
            var view:ViewBase = new TestViewNullRender();
            view.initialize();
            expect(view.getChildren().length).toEqual(0);
        });

        it("should not render anything if render function returns undefined",()=>{

            class TestViewUndefinedRender extends ViewBase
            {

                render() {
                    return undefined;
                }
            }
            var view:ViewBase = new TestViewUndefinedRender();
            view.initialize();
            expect(view.getChildren().length).toEqual(0);
        });
        
        it("should create child elements",()=>{

            var view:ViewBase = new TestView();
            view.initialize();
            expect(view.getChildren()).toBeDefined();
            expect(view.getChildren().length).toEqual(2);

        });

        it("should create the custom element",()=>{

            var view:ViewBase = new TestView();

            view.initialize();

            expect(view.getChildren()[1] instanceof TestComp).toBe(true);

        });

        it("should transclude content",()=>{


            var view:TestViewTransclude = new TestViewTransclude();
            view.initialize();
            expect(view.testComp.customElements.length).toEqual(1);
            expect(view.testComp.customElements[0].getElementRef() instanceof HTMLDivElement).toBe(true);
        });

        it("should parse dom events and attach event listeners",(done)=>{

            
            var view:MyTestView = new MyTestView();
            view.initialize();


            view.addEventListener("yay",(event:Event)=>{
                done();
            });
            
            view.myDiv.dispatchEvent(new CustomEvent("click"));

        });

        it("should not throw error if one view is child of another view",()=>{


            function throws(){
                var view:TestParentView = new TestParentView();
                view.initialize(); 
            }
            expect(throws).not.toThrowError();

        });

        it("should let children set from outside should override the child views children",()=>{


            var view:TestParentView = new TestParentView();
            view.initialize();

            expect(view.testChildView.getChildren().length).toEqual(2);
            expect(view.testChildView.getChildren()[0].getElementRef() instanceof HTMLDivElement).toBe(true);


        });

        it("should set the attributes set from outside onto the root element",()=>{


            var view:TestParentView = new TestParentView();
            view.initialize();

            expect(view.testChildView.getAttribute("class")).toEqual("testClass");


        });


    });

    describe("setCurrentState",()=>{

        it("should  apply state change to properties successfully",()=>{

            var testView:TestViewWithStates = new TestViewWithStates();
            testView.initialize();

            testView.setCurrentState("state1");

            var testComp:TestComp = testView.getChildren()[0] as TestComp;
            var div1:UIElement = testView.getChildren()[1];

            expect(testComp.getAttribute("my-attr")).toEqual("what1");


            testView.setCurrentState("state2");

            expect(testComp.getAttribute("my-attr")).toEqual("what");
            expect(div1.getAttribute("class")).toEqual("humm");

            testView.setCurrentState("state1");

            expect(div1.getAttribute("class")).toEqual("")


        });

        it("should apply state change to state groups successfully",()=>{

            var testView:TestViewWithStates = new TestViewWithStates();
            testView.initialize();

            testView.setCurrentState("state2");

            var div1:UIElement = testView.getChildren()[2];
            var div2:UIElement = (testView.getChildren()[3]).getChildren()[0];

            expect(div1.getAttribute("class")).toEqual("group1");
            expect(div2.getAttribute("class")).toEqual("group2");

            testView.setCurrentState("state3");

            expect(div1.getAttribute("class")).toEqual("group1");
            expect(div2.getAttribute("class")).toEqual("group");

            testView.setCurrentState("state4");

            expect(div1.getAttribute("class")).toEqual("group");
            expect(div2.getAttribute("class")).toEqual("group2");


        })
    })
});
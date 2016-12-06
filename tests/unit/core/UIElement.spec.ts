
import {UIElement} from "../../../src/core/UIElement";
import {DOMElement} from "../../../src/core/DOMElement";


describe('UIElement Spec', () => {


    describe("UIElement constructor",()=>{


        it("should create element is node type is passed during construction",()=>{

            var el = new DOMElement("div");
            expect(el.getElementRef() instanceof HTMLDivElement).toBe(true);
        });

    });

    describe("interface methods",()=>{

        var el:UIElement;

        beforeEach(()=>{
            el = new DOMElement("div");
            el.initialize();
        });

        it("should return the reference to html node",()=>{
            var node:Node = document.createElement("div");
            el = new DOMElement(node);
            expect(el.getElementRef() === node).toBe(true);
            expect(el[0] === node).toBe(true);
        });

        it("should be able to append UIElement",()=>{

            var node:Node = document.createElement("div");
            el.appendChild(new DOMElement(node));
            expect(el.getChildren().length).toEqual(1);
            expect(el.getChildren()[0].getElementRef() === node).toBe(true);
            expect(el.getElementRef().childNodes.item(0) === node).toBe(true);
        });

        it("should be able to append UIElement at a given position",()=>{

            var node:Node = document.createElement("div");
            el.appendChild(new DOMElement(document.createElement("div")));
            el.appendChildAt(new DOMElement(node),0);

            expect(el.getChildren().length).toEqual(2);
            expect(el.getChildren()[0].getElementRef() === node).toBe(true);
            expect(el.getElementRef().childNodes.item(0) === node).toBe(true);
        });

        it("should be able to remove an element",()=>{

            var childEl1:UIElement = new DOMElement(document.createElement("div"));

            el.appendChild(childEl1);

            el.removeChild(childEl1);

            expect(el.getChildren().length).toEqual(0);

        });

        it("should be able to remove all Children",()=>{
            var childEl1:UIElement = new DOMElement(document.createElement("div"));

            el.appendChild(childEl1);

            el.removeAllChildren();

            expect(el.getChildren().length).toEqual(0);
        });

        it("should create children set from setChildren",()=>{
            var childEl1:UIElement = new DOMElement(document.createElement("div"));
            var childEl2:UIElement = new DOMElement(document.createElement("div"));

            var children:UIElement[] = [childEl1,childEl2];

            el.setChildren(children);

            el.initialize();

            expect(el.getElementRef().childNodes.item(0) === childEl1.getElementRef()).toBe(true);
            expect(el.getElementRef().childNodes.item(1) === childEl2.getElementRef()).toBe(true);
        });
    });

    describe("Lifecycle methods",()=>{

        var el:UIElement;

        beforeEach(()=>{
            el = new DOMElement(document.createElement("div"));
            el.initialize();
        });


        it("should call preInitialize before initializing element",(done)=>{

            class TestElement extends UIElement
            {

                protected preInitCalled:boolean;
                protected preInitialize():void {
                    super.preInitialize();
                    this.preInitCalled = true;
                }


                initialize():void {
                    super.initialize();
                    expect(this.preInitCalled).toBe(true);
                    done();
                }
            }
            var el:TestElement = new TestElement(document.createElement("div"));
            el.initialize();
        });

        it("should call initialized after initializing element",(done)=>{

            class TestElement1 extends UIElement
            {

                protected preInitCalled:boolean;

                protected preInitialize():void {
                    super.preInitialize();
                    this.preInitCalled = true;
                }

                protected initialized():void {
                    super.initialized();
                    expect(this.preInitCalled).toBe(true);
                    done();
                }
            }
            var el:TestElement1 = new TestElement1(document.createElement("div"));
            el.initialize();
        });


        it("should call initialize on child UIElement before adding",(done)=>{

            class TestElement2 extends UIElement
            {

                protected preInitCalled:boolean;

                protected preInitialize():void {
                    super.preInitialize();
                    this.preInitCalled = true;
                }

                protected initialized():void {
                    super.initialized();
                    expect(this.preInitCalled).toBe(true);
                    done();
                }
            }
            var el:TestElement2 = new TestElement2(document.createElement("div"));

            var parentElement:UIElement = new DOMElement(document.createElement("div"));
            parentElement.appendChild(el);
            parentElement.initialize();

        });

        it("should call preAttach and attached in while appending Child",(done)=>{

            class TestElement3 extends UIElement
            {


                preAttachCalled:boolean;

                preAttach():void {
                    super.preAttach();
                    this.preAttachCalled = true;

                }


                attached():void {
                    super.attached();
                    expect(this.preAttachCalled).toBe(true);
                    done();
                }
            }
            var el:TestElement3 = new TestElement3(document.createElement("div"));

            var parentElement:UIElement = new DOMElement(document.createElement("div"));
            parentElement.appendChild(el);
            parentElement.initialize();

        });

        it("should call preDetach and detached in order when child UIElement is being removed",(done)=>{
            class TestElement4 extends UIElement
            {


                preDetachCalled:boolean;

                preDetach():void {
                    this.preDetachCalled = true;

                }


                detached():void {
                    expect(this.preDetachCalled).toBe(true);
                    done();
                }
            }
            var el:TestElement4 = new TestElement4(document.createElement("div"));

            var parentElement:UIElement = new DOMElement(document.createElement("div"));
            parentElement.appendChild(el);
            parentElement.initialize();
            parentElement.removeChild(el);
        });

    })
});
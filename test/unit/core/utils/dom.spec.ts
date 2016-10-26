


import {createVNode} from "../../../../src/core/utils/dom";
import {createElement} from "../../../../src/core/utils/dom";
import {UIElement} from "../../../../src/core/UIElement";
import {PropertySetter} from "../../../../src/core/support_classes/PropertySetter";
import {VNode} from "../../../../src/core/utils/dom";
import {GroupBase} from "../../../../src/core/GroupBase";


class TestComp extends GroupBase
{

    attributes:any = {};
    constructor() {
        super(document.createElement("li"));
    }

    customElements:UIElement[];

    setCustomContent(elements:UIElement[]):void
    {
        this.customElements = elements;
    }

    setAttribute(name?:string, value?:string):void {
        super.setAttribute(name, value);
        this.attributes[name] = value;
    }
}

describe("dom Spec",()=>{


   describe("createVNode",()=>{

       it("should return an Vnode for intrinsic element",()=>{

           var vnode = createVNode("div");
           expect(typeof vnode.type === "string").toBe(true);
           expect(vnode.type).toEqual("div");
       });

       it("should return an Vnode for custom element",()=>{

           class Test{
           }
           var vnode = createVNode(Test);
           expect(vnode.type === Test).toBe(true);
       });

       it("should return an Vnode with properties",()=>{

           var vnode = createVNode("div",{humm:"interesting",humm1:"interesting1"});

           expect(vnode.props["humm"]).toEqual("interesting");
           expect(vnode.props["humm1"]).toEqual("interesting1");
       });

       it("should return an Vnode with state managed properties",()=>{

           var vnode = createVNode("div",{
               humm__stateName:"interesting",
               humm__stateName1:"interesting1"});

           expect(vnode.stateManagedProps["stateName"]["humm"]).toEqual("interesting");
           expect(vnode.stateManagedProps["stateName1"]["humm"]).toEqual("interesting1");
       });

       it("should return an Vnode with children",()=>{

           class Test{
           }

           var vnode = createVNode("div",{
               humm__stateName:"interesting",
               humm__stateName1:"interesting1"},"child1",Test);

           expect(vnode.children.length).toEqual(2);
           expect(vnode.children[0]).toEqual("child1");
           expect(vnode.children[1]).toEqual(Test);
       })

   });

    describe("createElement",()=>{

        it("should return an instance of UIElement",()=>{

            var element = createElement("humm");
            expect(element instanceof UIElement).toBe(true);
        });

        it("should return an instance of UIElement with text node is tag is of type string",()=>{

            var vnode:VNode = {type:"div"};
            expect(createElement(vnode) instanceof UIElement).toBe(true);
        });

        it("should create a html node if vnode type string",()=>{
            var vnode:VNode = {type:"ul"};

            var el:UIElement = createElement(vnode);

            expect(el.getElementRef() instanceof HTMLUListElement).toBe(true)
        });

        it("should create and return instance of custom component",()=>{


            var vnode:VNode = {type:TestComp};

            var el:UIElement = createElement(vnode);

            expect(el.getElementRef() instanceof HTMLLIElement).toBe(true)
        });

        it("should throw an error if custom component is not an instance of UIElement",()=>{

            class InvalidComponent{

            }

            var vnode:VNode = {type:InvalidComponent};

            function throws(){
                createElement(vnode);
            }

            expect(throws).toThrowError();


        });

        it("should call setAttribute all the properties on Vnode.props",()=>{
            var vnode:VNode = {type:TestComp,props:{humm:"interesting"}};

            var el:TestComp = createElement(vnode) as TestComp;
            var elRef:Element = el.getElementRef() as Element;

            expect(elRef.getAttribute("humm")).toEqual("interesting");
            expect(el.attributes["humm"]).toEqual("interesting");

        });

        it("should create children in the VNode",()=>{

            var vnode:VNode = {type:TestComp,props:{humm:"interesting"},children:["child1",{type:"button"}]};

            var el:TestComp = createElement(vnode) as TestComp;

            expect(el.getChildren().length).toEqual(2);

            expect(el.getChildren()[0].getElementRef() instanceof Text).toBe(true);
            expect(el.getChildren()[1].getElementRef() instanceof HTMLButtonElement).toBe(true);

        });

        it("should do transculsion if setFunctionName on parent element Matches vnode type",()=>{

            var vnode:VNode = {type:TestComp,
                children:[
                    {type:"customContent",
                        children:[{type:"img"},{type:"button"}]}
                ]};

            var el:TestComp = createElement(vnode) as TestComp;

            expect(el.customElements.length).toEqual(2);
            expect(el.customElements[0].getElementRef() instanceof HTMLImageElement).toBe(true);
            expect(el.customElements[1].getElementRef()  instanceof HTMLButtonElement).toBe(true);

        });

        it("should register references to the refs object is ref Object is defined",()=>{
            var vnode:VNode = {type:TestComp,props:{humm:"interesting"},children:[
                {type:"button",props:{
                    id:"myButton"
                }},

                {type:"button",props:{
                    id:"myButton1"
                }}]};

            var refs:{[id:string]:UIElement} = {};
            var el:TestComp = createElement(vnode,refs) as TestComp;
            expect(refs["myButton"].getElementRef() instanceof HTMLButtonElement);
            expect(refs["myButton1"].getElementRef() instanceof HTMLButtonElement);


        });

        it("should update stateManagedProperties if it is defined ",()=>{
            var vnode:VNode = {type:TestComp,props:{humm:"interesting"},children:[
                {type:"button",stateManagedProps:{state1:{
                  humm:"interesting"
                },
                state2:{
                    humm:"interesting2"
                }}},

                {type:"button",stateManagedProps:{state1:{
                    humm:"interesting"
                },
                    state2:{
                        humm:"interesting2"
                    }}}]};

            var stateManagedProperties:{[stateName:string]:Array<PropertySetter>} = {};
            var el:TestComp = createElement(vnode,null,stateManagedProperties) as TestComp;

            expect(stateManagedProperties["state1"].length).toEqual(2);
            expect(stateManagedProperties["state2"].length).toEqual(2);

            expect(stateManagedProperties["state1"][0] instanceof PropertySetter).toBe(true);



        });
    });


});
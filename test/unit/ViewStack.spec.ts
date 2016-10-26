
import {ViewStack} from "../../src/ViewStack";
import {DOMElement} from "../../src/core/DOMElement";
import {UIElement} from "../../src/core/UIElement";


describe('ViewStack Spec', () => {


    
    describe("viewStack initialization",()=>{

        var viewStack:ViewStack;

        var child1:DOMElement;
        var child2:DOMElement;
        var child3:DOMElement;
        var child4:DOMElement;

        var children:Array<UIElement>;

        beforeEach(function () {

            viewStack = new ViewStack();

            child1 = new DOMElement("div");
            child1.setAttribute("id","0");
            
            child2 = new DOMElement("div");
            child2.setAttribute("id","1");

            child3 = new DOMElement("div");
            child3.setAttribute("id","2");

            child4 = new DOMElement("div");
            child4.setAttribute("id","3");

            children = [child1,child2,child3,child4];


            viewStack.setChildren(children);
            viewStack.initialize();

        });

        it("should not append a child if child is never selected",()=>{

            expect(viewStack.getChildren().length == 1).toBe(true);
        });

        it("should append all children if creation policy is 'All'",()=>{

            viewStack = new ViewStack();
            viewStack.setChildren(children);
            viewStack.creationPolicy = ViewStack.ALL;
            viewStack.initialize();

            expect(viewStack.getChildren().length == 4).toBe(true);
        });

        it("should set first Child as selected by default",()=>{

            expect(viewStack.getSelectedIndex() == 0).toBe(true);
            expect(viewStack.getChildren().length == 1).toBe(true);
            expect(child1.isInitialized()).toBe(true);
        });

        it("should not initialize a child added after initialization",()=>{

            var child5:DOMElement = new DOMElement("div");
            child5.setAttribute("id","4");
            
            viewStack.appendChild(child5);

            expect(child5.isInitialized()).toBe(false);
        });
        
    });

    describe("setSelectedIndex",()=>{

        var viewStack:ViewStack;

        var child1:DOMElement;
        var child2:DOMElement;
        var child3:DOMElement;
        var child4:DOMElement;

        var children:Array<UIElement>;

        beforeEach(function () {

            viewStack = new ViewStack();

            child1 = new DOMElement("div");
            child1.setAttribute("id","0");
            
            child2 = new DOMElement("div");
            child2.setAttribute("id","1");

            child3 = new DOMElement("div");
            child3.setAttribute("id","2");

            child4 = new DOMElement("div");
            child4.setAttribute("id","3");

            children = [child1,child2,child3,child4];

            viewStack.setChildren(children);
            viewStack.initialize();

        });

        it("should select and append a new child",()=>{

            viewStack.setSelectedIndex(3);
            expect(viewStack.getChildren().length == 2).toBe(true);
            expect(child4.isInitialized()).toBe(true);
        });

        it("should be able to select a child added after initialization",()=>{

            var child5:DOMElement = new DOMElement("div");
            child5.setAttribute("id","4");

            viewStack.appendChild(child5);

            expect(child5.isInitialized()).toBe(false);

            viewStack.setSelectedIndex(4);

            expect(viewStack.getChildren().length == 2).toBe(true);
            expect(child5.isInitialized()).toBe(true);
        });

    });

});

import {rama} from "../../../src/index"

import {ViewBase} from "../../../src/core/ViewBase";
import {UIElement} from "../../../src/core/UIElement";
import {Skin} from "../../../src/Skin";
import {VNode} from "../../../src/core/utils/dom";
import {DataGroup} from "../../../src/DataGroup";
import {ArrayCollection} from "../../../src/core/collections/ArrayCollection";
import {DOMElement} from "../../../src/core/DOMElement";


export class TestComp extends UIElement
{


    constructor() {
        super(document.createElement("li"));
    }

    customElements:UIElement[];

    setCustomContent(elements:UIElement[]):void
    {
        this.customElements = elements;
    }
    render():VNode{
        return null
    }

}

export class MyTestView extends ViewBase
{

    myDiv:DOMElement;

    handleClick():void
    {
        console.log("hahahahahaha");
        this.dispatchEvent(new Event("yay"));
    }
    render() {
        return <div>
            <div  onclick={(event:Event)=>{this.handleClick()}} id="myDiv"></div>
            <TestComp />
        </div>;
    }
}

export class TestView extends ViewBase
{

    render():VNode {
        return <div>
            <div id="myDiv"></div>
            <TestComp />
        </div>;
    }
}

export class TestCustomElementRootNodeView extends ViewBase
{

    render():VNode {
        return <TestComp />;
    }
}

export class TestViewTransclude extends ViewBase
{

    testComp:TestComp;

    render():VNode {
        return <div>
            <TestComp id="testComp">
                <customContent>
                    <div id="myDiv"></div>
                </customContent>
            </TestComp>
        </div>;
    }
}

export class TestViewWithStates extends ViewBase
{

    render():VNode {
        return <div>
            <states>
                <state name="state1"/>
                <state name="state2" stateGroups="group1,group2"/>
                <state name="state3" stateGroups="group1"/>
                <state name="state4" stateGroups="group2"/>
            </states>

            <TestComp id="1" my-attr="what" my-attr__state1="what1"/>
            <div id="2" class__state2="humm"></div>
            <div id="3" class="group" class__group1="group1"></div>
            <r-group>
                <div id="4" class="group" class__group2="group2"></div>
            </r-group>
        </div>;
    }
}

export class TestItemRenderer extends UIElement
{

    constructor() {
        super("a");
    }
    
    setData(data:any):void
    {
        console.log("yay Data: " + data);
    }
}
export class TestDataGroup extends ViewBase
{

    dataGroup:DataGroup;
    
    protected dataProvider:ArrayCollection<string> = new ArrayCollection(["test1","test2"]);

    attached():void {
        super.attached();
    }

    render(){
        return <div>
                <DataGroup id="dataGroup" itemRenderer={TestItemRenderer} dataProvider={this.dataProvider} />
            </div> 
    }
}

export class TestChildView extends ViewBase
{

    render(){

        return <button>Hello There</button>
    }
}

export class TestParentView extends ViewBase
{
    testChildView:TestChildView;
    
    onClickHandler = ()=>{
        
    };
    render(){

        return <div>
            <TestChildView onclick={this.onClickHandler} class="testClass" id="testChildView">
                <div id="test1"></div>
                <div id="test2"></div>
            </TestChildView>
            <button>Hi There</button>
        </div>
    }
}

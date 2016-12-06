

import {rama} from "../../src/index"
import {Skin} from "../../src/Skin";
import {View} from "../../src/View";
import {Container} from "../../src/Container";
import {skinPart} from "../../src/decorators";
import {DOMElement} from "../../src/core/DOMElement";


export class TestComponentAsRootNode extends Container
{
    
    protected initialized():void {
        
        super.initialized();
        
        this.setCurrentState("testState")
        
    }


    getCurrentSkinState():string
    {
        return this._children[0].getCurrentState();
    }
}

export class TestComponentAsRootNodeSkin extends Skin
{

    render() {
        return <div>
            <states>
                <state name="testState"/>
            </states>
        </div>;
    }
}

export class TestViewWithComponentAsRoot extends View
{

    testDiv:DOMElement;
    testRootNodeComp:TestComponentAsRootNode;


    initialized():void {
        super.initialized();
        this.setCurrentState("testViewState");
        this.testRootNodeComp = this.rootElement as TestComponentAsRootNode;
    }

    render() {
        return <TestComponentAsRootNode skinClass={TestComponentAsRootNodeSkin}>

            <states>
                <state name="testViewState"/>
            </states>
            
            <div id="contentGroup" class="testClass" class__testViewState="testClass1" ></div>

        </TestComponentAsRootNode>;
    }
}
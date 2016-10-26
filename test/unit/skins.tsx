

import {rama} from "../../src/index"
import {Skin} from "../../src/Skin";
import {VNode} from "../../src/core/utils/dom";


export class TestSkin extends Skin
{

    render() {
        return <div>
            <states>
                <state name="testState"/>
            </states>
            <div id="humm"></div>
        </div>;
    }
}

export class TestSkin2 extends Skin
{


    render() {

        return <div id="testComp"></div>;
    }
}
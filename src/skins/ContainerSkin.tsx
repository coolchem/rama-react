

import {Skin} from "../Skin";
import {Group} from "../Group";

import {rama} from "../index"
import {VNode} from "../core/utils/dom";

export class ContainerSkin extends Skin
{

    render():VNode {
        return <Group id="contentGroup"/>
    }
}
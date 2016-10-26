

import {Skin} from "../Skin";
import {Group} from "../Group";

import {rama} from "../index"

export class ContainerSkin extends Skin
{

    render() {
        return <Group id="contentGroup"/>
    }
}
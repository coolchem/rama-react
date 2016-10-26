

import {ViewBase} from "./core/ViewBase";
import {VNode} from "./core/utils/dom";

export abstract class View extends ViewBase
{
    abstract render();
}
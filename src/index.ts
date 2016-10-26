
import {createVNode as createElementFunction} from "./core/utils/dom";
import {UIElement} from "./core/UIElement";
import {DOMElement} from "./core/DOMElement";


export var rama:{createElement:Function} = {createElement:createElementFunction};

export var render = function (elementClass:new()=>any, node:HTMLElement) {

    node.innerHTML = "";
    var element:UIElement =  new elementClass() as UIElement;
    element.initialize();

    var domElement:DOMElement = new DOMElement(node);
    domElement.appendChild(element);
};

export * from "./core/utils/dom"
export * from "./core/UIElement"
export * from "./core/UIEventDispatcher"
export * from "./core/ModelEventDispatcher"
export * from "./core/UIElement"
export * from "./core/collections/ArrayCollection";
export * from "./core/collections/ArrayList";
export * from "./core/collections/Dictionary";

export * from "./decorators"

export * from "./View"
export * from "./Skin"
export * from "./Group"
export * from "./Component"
export * from "./Container"

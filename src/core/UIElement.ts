
import "./pollyfills";
import {titleCase} from "./utils/string-utils";
import {UIEventDispatcher} from "./UIEventDispatcher";


export abstract class UIElement extends UIEventDispatcher
{

    protected _initialized:boolean;

    protected _children:Array<UIElement>;

    public parentElement:UIElement;

    protected _currentState:string;

    getCurrentState():string
    {
        return this._currentState
    }

    setCurrentState(value:string):void
    {
        if(this._currentState !== value)
        {
            this._currentState = value;
            this.validateState();
        }
    }

    constructor(element?:Node|string)
    {

        var el:Node = element as Node;
        if(typeof element === "string")
        {
            el = document.createElement(element as string);
        }
        super(el);

        this._initialized = false;
        this._children = [];
        this._currentState = "";
    }


    //if overriding please make sure super is called
    initialize():void
    {
        if (this._initialized)
            return;


        this.__preInitialize();

        this.preInitialize();

        this.createChildren();
        this.childrenCreated();

        this._initialized = true;

        this.initialized();
    }

    protected __preInitialize():void
    {

    }

    /*
    * Life cycle methods
    *
    * */

    protected preInitialize():void
    {

    }

    protected initialized():void
    {

    }

    preAttach():void
    {

    }

    attached():void
    {

    }

    preDetach():void
    {

    }

    detached():void
    {

    }

    /*
    *
    * Public methods
    *
    * */
    
    getElementRef():Node|Element {
        return this._element;
    }

    setChildren(elements:UIElement[]):void
    {

        //abstract implemneted in child classes
    }

    getChildren():Array<UIElement>
    {
        return this._children
    }

    appendChild(element:UIElement):void {
        this.appendChildAt(element, this._children.length)
    }

    appendChildAt(element:UIElement,index:number):void {

        if(index === -1)
        {
            index = 0;
        }

        this.initializeAndAppendElement(element,index);
    }
    
    protected initializeAndAppendElement(element:UIElement,index:number):void
    {
        element.parentElement = this;
        element.initialize();

        element.preAttach();

        if(this._children.length <= 0 || index > this._children.length-1)
        {
            this._element.appendChild(element.getElementRef())
        }
        else
        {
            var refChild = this._children[index].getElementRef();
            this._element.insertBefore(element.getElementRef(), refChild)
        }

        element.attached();
        this._children.splice(index, 0, element);
    }

    removeChild(element:UIElement):void {

        element.preDetach();
        this._children.splice(this._children.indexOf(element), 1);
        this._element.removeChild(element.getElementRef());
        element.detached();
    };

    removeAllChildren():void {

        while (this._children.length > 0) {
            this.removeChild(this._children[0]);
        }
    }

    setAttribute(name?: string, value?: any): void{
        //finding and calling set function which matches attribute-name
        var functionName = "set" + titleCase(name);

        if(this[functionName])
        {
            this[functionName](value);
        }
        else 
        {
            this[name] = value;
        }

        //adding eventListener if the attributename starts with on

        var searchPattern = new RegExp('^on');
        if (searchPattern.test(name)) {

            this.addEventListener(name.substring(2),value);
        }

        if(this._element instanceof Element && (typeof value === 'string'))
        {
            (this._element as Element).setAttribute(name, value);
        }

    }

    getAttribute(name: string): string{

        if(this._element instanceof Element)
        {
            return (this._element as Element).getAttribute(name);
        }
        return null;
    }
    
    isInitialized():boolean
    {
        return this._initialized;
    }


    protected createChildren():void
    {
       //abstract
    }

    protected childrenCreated():void
    {

    }

    protected validateState():void
    {

    }

    hasClass(name:string):boolean {
        if (!this.getAttribute) return false;
        return ((" " + (this.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").
        indexOf( " " + name + " " ) > -1);
    }

    removeClasses(names:string[]) {

        if (names) {
            names.forEach((cssClass)=> {
                this.setAttribute('class', this.trim(
                    (" " + (this.getAttribute('class') || '') + " ")
                        .replace(/[\n\t]/g, " ")
                        .replace(" " + this.trim(cssClass) + " ", " "))
                );
            }, this);
        }
    }

    addClasses(names:string[]) {

        if (names) {
            var existingClasses = (' ' + (this.getAttribute('class') || '') + ' ')
                .replace(/[\n\t]/g, " ");

            names.forEach((cssClass)=> {
                cssClass = this.trim(cssClass);
                if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
                    existingClasses += cssClass + ' ';
                }
            });

            this[0].setAttribute('class', this.trim(existingClasses));
        }
    }

    toggleClasses(names:string[]) {

        if (names) {
            names.forEach((className:string)=>{
                var classCondition = !this.hasClass(className);
                if(classCondition)
                    this.addClasses([className]);
                else
                    this.removeClasses([className])
            });
        }
    }

    protected trim( text ) {
        return text == null ?
            "" :
            ( text + "" ).replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "" );
    }


}
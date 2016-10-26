
import {ModelEventDispatcher} from "../../../src/core/ModelEventDispatcher";
import {REvent} from "../../../src/core/event";
describe('ModelEventDispatcher Spec', ()=> {

    var eventEmitter:ModelEventDispatcher;
    var throws;

    beforeEach(function (done) {
        eventEmitter = new ModelEventDispatcher();
        throws = null;
        done();
    });


    describe("addEventListener",()=>{


        it('it should addEventListener to an event sucessfully', function(done) {

            eventEmitter.addEventListener("event", function(data){});
            expect(eventEmitter.hasEventListener("event")).toBe(true);
            done();
        });
    });


    describe("dispatchEvent",()=>{

        it('it should successfully publish event of type string to all the handlers', function(done) {

            var handler1Called = false;
            var handler2Called = false;

            var noOfhandlersCalled = 0;

            var handler1 = function(data){
                noOfhandlersCalled++;
                handler1Called = true;
                if(handler1Called && handler2Called)
                    completeTest();

            };

            var handler2 = function(data){
                noOfhandlersCalled++;
                handler2Called = true;
                if(handler1Called && handler2Called)
                    completeTest();
            };

            eventEmitter.addEventListener("event", handler1);
            eventEmitter.addEventListener("event", handler2);

            eventEmitter.dispatchEvent(new REvent("event"));

            function completeTest(){

                expect(noOfhandlersCalled).toEqual(2);
                done();
            }

        });

        it('it should successfully call all the handlers with correct event', function(done) {

            var event:REvent = new REvent("event");
            eventEmitter.addEventListener("event", function(data){

                expect(data).toEqual(event);
                done();

            });

            eventEmitter.dispatchEvent(event);

        });

        it('it should successfully call all the handlers with correct arguments is event is dispatched with parameters', function(done) {
            
            eventEmitter.addEventListener("event", function(data:string,value:number){

                expect(data === "4").toBe(true);
                expect(value === 5).toBe(true);
                done();

            });

            eventEmitter.dispatchEvent("event","4",5);

        });

        it('should call the handler with right context if the context is passed while registering', function(done) {

            var handlerContext ={};
            var handler = function(){

                expect(this).toEqual(handlerContext);
                done();
            };

            eventEmitter.addEventListener("action",handler,handlerContext);
            eventEmitter.dispatchEvent(new REvent("action"));

        });

        it('should call the handler with undefined context if no context is passed while subscribing', function(done) {


            var handler = function(){

                expect(this).toEqual(undefined);
                done();
            };

            eventEmitter.addEventListener("action",handler);
            eventEmitter.dispatchEvent(new REvent("action"));

        });
    });


    describe("removeEventListener",()=>{


        it('it should remove an handler for an event if it is registered', function(done) {

            var handler1 = function(data){};

            var handler2 = function(data){};

            eventEmitter.addEventListener("event", handler1);
            eventEmitter.addEventListener("event", handler2);

            expect(eventEmitter.hasEventListener("event")).toBe(true);

            eventEmitter.removeEventListener("event",handler1);

            expect(eventEmitter.hasEventListener("event")).toBe(true);

            eventEmitter.removeEventListener("event",handler2);

            expect(eventEmitter.hasEventListener("event")).toBe(false);

            done();
        });
    });

    describe("removeAllEventListeners",()=>{

        it('it should remove all handlers for an event', function(done) {

            var handler1 = function(data){

            };

            var handler2 = function(data){
            };


            eventEmitter.addEventListener("event", handler1);
            eventEmitter.addEventListener("event", handler2);

            expect(eventEmitter.hasEventListener("event")).toBe(true);

            eventEmitter.removeAllEventListeners("event");

            expect(eventEmitter.hasEventListener("event")).toBe(false);

            done();
        });
    });

});

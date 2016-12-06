

import {UIEventDispatcher} from "../../../src/core/UIEventDispatcher";

class TestEventDispatcher extends UIEventDispatcher
{

    constructor() {
        super(document.createElement("event-dispatcher"));
    }
}
describe('UIEventDispatcher Spec', () => {

    var ed:UIEventDispatcher;
    beforeEach(()=>{

        ed = new TestEventDispatcher();
    });
    describe("addEventListener",()=>{


        it("should successfully add the listener",()=>{
            ed.addEventListener("humm",(event:Event)=>{});

            expect(ed.hasEventListener("humm")).toBe(true);
        });

    });

    describe("removeEventListener",()=>{

        it("should successfully remove the listener",()=>{
            var listner = (event:Event)=>{};
            ed.addEventListener("humm",listner);

            expect(ed.hasEventListener("humm")).toBe(true);

            ed.removeEventListener("humm",listner);
            expect(ed.hasEventListener("humm")).toBe(false);
        });
    });


    describe("dispatchEvent",()=>{

        beforeEach(()=>{

            ed = new TestEventDispatcher();
        });

        it("should successfully dispatch native event",(done)=>{

            var listener = (event:Event)=>{

                done();
            };

            ed.addEventListener("humm",listener);

            ed.dispatchEvent(new Event("humm"));

        });

        it("should return value for events defaultPrevented",()=>{

            var listener = (event:Event)=>{
                event.preventDefault();
            };

            ed.addEventListener("humm",listener);

            expect(ed.dispatchEvent(new CustomEvent("humm"))).toBe(true);
        });

    });

    describe("removeAllEventListeners",()=>{

        it("should successfully removeAllEventLiners",()=>{

            var listener = (event:Event)=>{};

            ed.addEventListener("humm",listener);

            ed.addEventListener("humm2",listener);

            ed.removeAllEventListeners();

            expect(ed.hasEventListener("humm")).toBe(false);
            expect(ed.hasEventListener("humm2")).toBe(false);
        });
    })
});
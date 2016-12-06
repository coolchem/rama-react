
import {Skin} from "../../src/Skin";
import {createElement} from "../../src/core/utils/dom";
import {TestSkin} from "./skins";


describe('Skin Spec', () => {


    describe("getSkinPartByID",()=>{

        it("should return null if no element with provided id found",()=>{

            var skin:Skin = new TestSkin();
            skin.initialize();
            var part = skin.getSkinPartByID("test");
            expect(part).toBeNull();
        });

        it("should return HTMLElement with provided",()=>{
            var skin:Skin = new TestSkin();
            skin.initialize();
            var part = skin.getSkinPartByID("humm");
            expect(part).not.toBeNull();

            expect(skin.getSkinPartByID("humm").getElementRef() instanceof HTMLDivElement).toBe(true);
        })
    });

});
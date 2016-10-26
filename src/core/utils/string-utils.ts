
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;

export function titleCase(string) {

    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function camelCase(name) {
    return name.
    replace(SPECIAL_CHARS_REGEXP,function (_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    }).
    replace(MOZ_HACK_REGEXP, 'Moz$1');
}

export function trim( text ) {
    return text == null ?
        "" :
        ( text + "" ).replace( rtrim, "" );
}


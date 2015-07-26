var allModule = require("../../src/js/all");

describe("sumDigits", function () {

    "use strict";

    it("must be a function", function () {
        expect(allModule.sum).toEqual(jasmine.any(Function));
    });

    it("must return sum of 2 digits", function () {
        expect(allModule.sum(2, 4)).toBe(6);
    });

    it("must throw error if its arguments not a numbers", function () {

        expect(function () {
            allModule.sum(2, "");
        }).toThrowError(/wrong.+arguments.+finite number/);

        expect(function () {
            allModule.sum("", 2);
        }).toThrowError(/wrong.+arguments.+finite number/);

        expect(function () {
            allModule.sum(4, {});
        }).toThrowError(/wrong.+arguments.+finite number/);

        expect(function () {
            allModule.sum(0, NaN);
        }).toThrowError(/wrong.+arguments.+finite number/);

        expect(function () {
            allModule.sum(0, Infinity);
        }).toThrowError(/wrong.+arguments.+finite number/);

    });

});

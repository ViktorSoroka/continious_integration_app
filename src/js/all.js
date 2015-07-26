'use strict';
/*jshint unused: false*/
exports.sum = function (num1, num2) {

    if (typeof num1 !== 'number' || typeof num2 !== 'number' || !/^\d+$/.test(num1) || !/^\d+$/.test(num2)) {
        throw new Error('Something is wrong with arguments. It must me be finite number');
    }

    return num1 + num2;

};

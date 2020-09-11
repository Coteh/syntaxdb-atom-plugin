'use babel';

import sinon from 'sinon';
import chai from 'chai';
import { expect } from 'chai';
import {
    percentEncode,
    InvalidPercentEncodedStringError,
} from '../lib/util/PercentEncoder';

describe('PercentEncoder', () => {
    describe('percentEncode', () => {
        it('should percent encode a character', () => {
            expect(percentEncode('Something cool!')).to.equal(
                'Something cool%21',
            );
        });
        it('should percent encode all reserved characters', () => {
            // Forward slash (/) currently not considered a reserved character
            expect(percentEncode("!#$%&'()*+,:;=?@[]")).to.equal(
                '%21%23%24%25%26%27%28%29%2a%2b%2c%3a%3b%3d%3f%40%5b%5d',
            );
        });
        it('should not alter an empty string', () => {
            expect(percentEncode('')).to.equal('');
        });
        it('should not alter a string without any reserved characters', () => {
            expect(percentEncode('Hello World')).to.equal('Hello World');
        });
        it('should not throw an error if attempting to percent encode a null string', () => {
            expect(() => percentEncode(null)).to.throw(
                InvalidPercentEncodedStringError,
            );
        });
        it('should not throw an error if attempting to percent encode an undefined string', () => {
            expect(() => percentEncode(undefined)).to.throw(
                InvalidPercentEncodedStringError,
            );
        });
    });
});

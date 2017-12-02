var gatherStylesheetsWithPredicates = require('../../../lib/util/fonts/gatherStylesheetsWithPredicates');
var expect = require('../../unexpected-with-plugins');
var AssetGraph = require('../../../');

describe('gatherStylesheetsWithPredicates', function () {
    expect = expect.clone().addAssertion('<string> to produce result satisfying <array>', function (expect, subject, value) {
        return new AssetGraph({root: __dirname + '/../../../testdata/util/fonts/gatherStylesheetsWithPredicates/' + subject + '/'})
            .loadAssets('index.html')
            .populate()
            .then(function (assetGraph) {
                return expect(gatherStylesheetsWithPredicates(assetGraph, assetGraph.findAssets({type: 'Html'})[0]), 'to satisfy', value);
            });
    });

    it('should follow inline HtmlStyle relations', function () {
        return expect('inlineHtmlStyle', 'to produce result satisfying', [
            { text: '\n        .a { font-weight: 500; }\n    ', predicates: {} }
        ]);
    });

    it('should support the media attribute when following an inline HtmlStyle', function () {
        return expect('inlineHtmlStyleWithMediaAttribute', 'to produce result satisfying', [
            { text: '\n        .a { font-weight: 500; }\n    ', predicates: { 'mediaQuery:3d-glasses': true } }
        ]);
    });

    it('should follow non-inline HtmlStyle relations', function () {
        return expect('htmlStyle', 'to produce result satisfying', [
            { text: '.a { font-weight: 500; }\n', predicates: {} }
        ]);
    });

    it('should support the media attribute when following a non-inline HtmlStyle', function () {
        return expect('htmlStyleWithMediaAttribute', 'to produce result satisfying', [
            { text: '.a { font-weight: 500; }\n', predicates: { 'mediaQuery:3d-glasses': true } }
        ]);
    });

    it('should list a stylesheet twice when it is being included multiple times', function () {
        return expect('sameStylesheetIncludedTwice', 'to produce result satisfying', [
            { text: '.a { font-weight: 600; }\n', predicates: {} },
            { text: '.b { font-weight: 500; }\n', predicates: {} },
            { text: '.a { font-weight: 600; }\n', predicates: { 'mediaQuery:3d-glasses': true } }
        ]);
    });

    it('should pick up a media list attached to a CssImport', function () {
        return expect('cssImportWithMedia', 'to produce result satisfying', [
            { text: '.a { font-weight: 600; }\n', predicates: { 'mediaQuery:projection': true } },
            { text: '\n        @import "a.css" projection;\n    ', predicates: {} }
        ]);
    });

    it('should stack up the incoming media following HtmlStyle -> CssImport', function () {
        return expect('cssImportWithMediaWithExistingIncomingMedia', 'to produce result satisfying', [
            { text: '.a { font-weight: 600; }\n', predicates: { 'mediaQuery:3d-glasses': true, 'mediaQuery:projection': true } },
            { text: '\n        @import "a.css" projection;\n    ', predicates: { 'mediaQuery:3d-glasses': true } }
        ]);
    });

    it('should not break when there is a cyclic CssImport', function () {
        return expect('cyclicCssImport', 'to produce result satisfying', [
            { text: '@import "";\n\n.a { font-weight: 600; }\n', predicates: {} }
        ]);
    });

    it('should not break when there are unloaded Css assets', function () {
        return expect('unloadedCssAssets', 'to produce result satisfying', [
            { text: '@import "notfoundeither.css";\n', predicates: {} }
        ]);
    });
});
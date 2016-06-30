var expect = require('../unexpected-with-plugins');
var AssetGraph = require('../../lib/');

describe('JavascriptWebWorker', function () {
    it('should pick up new Worker(...) as a relation', function () {
        return new AssetGraph({root: __dirname + '/../../testdata/relations/JavaScriptWebWorker/'})
            .loadAssets('index.html')
            .populate()
            .queue(function (assetGraph) {
                expect(assetGraph, 'to contain asset', {fileName: 'worker.js'});
            });
    });

    it('should pick up importScripts() and self.importScripts as relations', function () {
        return new AssetGraph({root: __dirname + '/../../testdata/relations/JavaScriptWebWorker/'})
            .loadAssets('index.html')
            .populate()
            .queue(function (assetGraph) {
                expect(assetGraph, 'to contain assets', 'JavaScript', 5);
                assetGraph.findRelations({to: { fileName: 'foo.js' }})[0].detach();
                expect(assetGraph.findRelations({type: 'JavaScriptWebWorker'})[0].to.text, 'to contain', 'importScripts(\'bar.js\');');
            });
    });
});

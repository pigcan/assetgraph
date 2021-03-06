const pathModule = require('path');
const expect = require('../../unexpected-with-plugins');
const AssetGraph = require('../../../lib/AssetGraph');

describe('relations/HtmlVideo', function() {
  it('should handle a test case with existing <video> tags', async function() {
    const assetGraph = new AssetGraph({
      root: pathModule.resolve(
        __dirname,
        '../../../testdata/relations/Html/HtmlVideo/'
      )
    });
    await assetGraph.loadAssets('index.html').populate({
      followRelations: () => false
    });

    expect(assetGraph, 'to contain relations', 'HtmlVideo', 4);
    expect(assetGraph, 'to contain relations', 'HtmlVideoPoster', 2);

    assetGraph.findAssets({ type: 'Html' })[0].url =
      'http://example.com/foo/bar.html';
    assetGraph.findRelations().forEach(function(relation) {
      relation.hrefType = 'relative';
    });

    expect(assetGraph.findRelations(), 'to satisfy', [
      { href: '../movie1.mp4' },
      { href: '../movie1.jpg' },
      { href: '../movie2.png' },
      { href: '../movie2.mov' },
      { href: '../movie2.wmv' },
      { href: '../movie2.flc' }
    ]);
  });
});

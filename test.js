var sozluk = require("./"),
    url    = require('./lib/url');

describe('url', function(){

  it('returns URL for given topic titles', function(){

    expect(url('çığ-öşü', 0)).to.equal('http://eksisozluk.com/%C3%A7%C4%B1%C4%9F-%C3%B6%C5%9F%C3%BC?p=0');

  });

});

it('returns entries with title, date and author fields', function(done){

  sozluk('finike portakalı', function(error, result){

    expect(error).to.not.exist;

    expect(result.title).to.equal('finike portakalı');

    expect(result.entries.length).to.equal(6);

    expect(result.entries[0].author).to.equal('ote');

    expect(result.entries[0].ts).to.equal(+(new Date("2004-10-02T10:57:08")));

    expect(result.entries[5].author).to.equal('mysterious');

    expect(result.entries[0].content)
      .to.equal("finike'de ve finike çevresinde yetiştirilen iri, sulu washington portakalı.");

    done();

  });

});

it('returns first 10 entries by default', function(done){

  sozluk('kalkan', function(error, result){

    expect(error).to.not.exist;

    expect(result.title).to.equal('kalkan');

    expect(result.entries.length).to.equal(10);

    expect(result.entries[9].author).to.equal('set');

    done();

  });

});

it('returns entries in a specified range', function(done){

  sozluk({ title: 'kalkan', from: 15, to: 37 }, function(error, result){

    expect(error).to.not.exist;

    expect(result.title).to.equal('kalkan');
    expect(result.entries.length).to.equal(23);

    expect(result.entries[0].author).to.equal('putperest');
    expect(result.entries[22].author).to.equal('janissarie');

    done();

  });

});

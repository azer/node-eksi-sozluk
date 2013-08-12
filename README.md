## eksi-sozluk [![Build Status](https://travis-ci.org/azer/node-eksi-sozluk.png?branch=master)](https://travis-ci.org/azer/node-eksi-sozluk)

NodeJS client to query Eksi Sozluk

### Install

```bash
$ npm install eksi-sozluk
```

### Command-line

![](https://dl.dropbox.com/s/rc2wrv02gpkirj0/eksi.png)

### API

```js

sozluk = require('eksi-sozluk')

sozluk('finike portakalı', function(error, result){

    result.title
    // => finike portakalı

    result.entries.length
    // => 6

    result.entries[0].content
    // => finike'de ve finike çevresinde yetiştirilen iri, sulu washington portakalı.

});

```

#### More Options


```js
sozluk({ title: 'finike portakalı', from: 25, to: 75 }, function(error, result){
    
    result.entries.length
    // => 50
    
})
```

To fetch specific pages:

```js
sozluk.page('finike', 3, function(error, result){
    
    result.entries.length
    // => 10
    
})
```

To get the number of the pages a topic has:

```js
sozluk.pageCount('finike', function(error, result){
    
    result
    // => 7
    
})
```

#### Suggestions

```js
sozluk.suggestions('linux', function(error, results){

    results[1]
    // => linux oyunları

    results[3]
    // => linux ile windows karşılaştırması
});
```



![](http://distilleryimage2.s3.amazonaws.com/3e14d1ae8e4711e2af7822000a1fb04e_6.jpg)

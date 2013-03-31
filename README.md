## eksi-sozluk

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

![](http://distilleryimage2.s3.amazonaws.com/3e14d1ae8e4711e2af7822000a1fb04e_6.jpg)

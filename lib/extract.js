var debug = require('debug')('eksi-sozluk:extract'),
    strip = require("strip");

module.exports = {
  entries : entries,
  title   : title
};


function entries(body){
  var start, end, content, author, authorStart, authorEnd, date, dateStart, dateEnd, entries;

  entries = [];
  start   = body.indexOf('<div class="content">');
  end     = body.indexOf('</div>', start);

  while(~start){

    authorStart = body.indexOf('<address>', start);
    authorEnd   = body.indexOf('</address>', end);
    dateStart   = body.indexOf('<time datetime="', start);
    dateEnd     = body.indexOf('">', dateStart);

    content = strip(body.slice(start, end));
    author  = strip(body.slice(authorStart, authorEnd));
    date    = body.slice(dateStart + 16, dateEnd);

    debug('Extracted entry by %s: %s', author, content.slice(0, 25));

    entries.push({ author: author, content: content, ts: +(new Date(date)) });

    start = body.indexOf('<div class="content">', end);
    end   = body.indexOf('</div>', start);

  }

  return entries;
}

function title(body){
  var start, end;

  start = body.indexOf('<h1 id="title">');
  end   = body.indexOf('</h1>', start);

  return body.slice(start, end).replace(/<[^<]+>/g, '').replace(/\n\s+\*/g,'').trim();
}

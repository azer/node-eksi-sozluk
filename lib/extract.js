var debug = require('debug')('eksi-sozluk:extract'),
    strip = require("strip");

module.exports = {
  entries   : entries,
  title     : title,
  pageCount : pageCount
};

function entries(body){

  var start, end, content,
      author, authorStart, authorEnd,
      id, idStart, idEnd,
      date, dateStart, dateEnd, entries;

  entries = [];
  start   = body.indexOf('<div class="content">');
  end     = body.indexOf('</div>', start);

  while(~start){

    authorStart = body.indexOf('data-author="', start) + 13;
    authorEnd   = body.indexOf('"', authorStart);
    dateStart   = body.indexOf('<time datetime="', start);
    dateEnd     = body.indexOf('">', dateStart);
    idStart     = body.indexOf('data-id="', start) + 9;
    idEnd       = body.indexOf('"', idStart);

    content = strip(body.slice(start, end), { formatLinks: true }).replace(/\]\(\/\?q\=/g, '](/');
    author  = body.slice(authorStart, authorEnd);
    date    = body.slice(dateStart + 16, dateEnd);
    id      = body.slice(idStart, idEnd);

    debug('Extracted entry by %s: %s', author, content.slice(0, 25));

    entries.push({ id:id, author: author, content: content, ts: +(new Date(date)) });

    start = body.indexOf('<div class="content">', end);
    end   = body.indexOf('</div>', start);

  }

  return entries;
}

function pageCount(body){
  var start, end;

  start = body.indexOf('data-pagecount="');

  if(start == -1) return 1;

  start += 16;
  end = body.indexOf('"', start);

  return parseInt(body.slice(start, end));
}

function title(body){
  var start, end;

  start = body.indexOf('<h1 id="title">');
  end   = body.indexOf('</h1>', start);

  return body.slice(start, end).replace(/<[^<]+>/g, '').replace(/\n\s+\*/g,'').trim();
}

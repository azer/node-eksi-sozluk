var debug = require('./debug')('extract'),
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
  start   = body.indexOf('<article>');
  end     = body.indexOf('</div>', start);

  while(~start){

    authorStart = body.indexOf('data-author="', start) + 13;
    authorEnd   = body.indexOf('"', authorStart);
    dateStart   = body.indexOf('<time datetime="', start) + 16;
    dateEnd     = body.indexOf('"', dateStart);
    idStart     = body.indexOf('data-id="', start) + 9;
    idEnd       = body.indexOf('"', idStart);

    content = strip(body.slice(start, end), { formatLinks: true }).replace(/\]\(\/\?q\=/g, '](/');
    author  = body.slice(authorStart, authorEnd);
    date    = body.slice(dateStart, dateEnd);
    id      = body.slice(idStart, idEnd);

    debug('Extracted entry by %s: %s', author, date, content.slice(0, 25));

    entries.push({ id:id, author: author, content: content, ts: +(new Date(date)) });

    start = body.indexOf('<article>', end);
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

  start = body.indexOf('data-title="') + 12;
  end   = body.indexOf('"', start);

  return body.slice(start, end);
}

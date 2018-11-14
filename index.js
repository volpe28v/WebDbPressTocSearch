var client = require('cheerio-httpcli');

if (process.argv.length < 3){
  console.log("node index.js keyword");
  return;
}

var yellow  = '\u001b[33m';
var reset   = '\u001b[0m';

var keyword = process.argv[2];
var keywordReg = new RegExp('(' + keyword + ')', "gi");
console.log("keyword: " + keyword);

var backnumber_url = 'https://gihyo.jp/magazine/wdpress/backnumber'

client.fetch(backnumber_url, {})
.then(function(result){
  var urls = [];
  var promises = [];
  result.$('.magazineList01 .data a').each(function(){
    var url = 'https://gihyo.jp' + result.$(this).attr('href');
    urls.push(url);
    promises.push(client.fetch(url, {}));
  });

  return Promise.all(promises);
})
.then(function(results){
  var tocs = results.map(function(result){
    var title = result.$('title').text();
    var toc = result.$('#toc').text();
    return { title: title, body: toc };
  });

  tocs.forEach(function(toc){
    var foundLines = [];
    toc.body.split("\n").forEach(function(line){
      if (line.match(keywordReg)){
        foundLines.push(line.trim());
      }
    });

    if (foundLines.length > 0){
      console.log("\n・" + toc.title);
      console.log("\t" + foundLines.join("\n\t").replace(keywordReg, yellow + '$1' + reset));
    }
  });
});

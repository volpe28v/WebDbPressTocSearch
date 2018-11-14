var client = require('cheerio-httpcli');

if (process.argv.length < 3){
  console.log("node index.js keyword");
  return;
}

var yellow  = '\u001b[33m';
var reset   = '\u001b[0m';

var keyword = process.argv[2];
var keyword_reg = new RegExp('(' + keyword + ')', "gi");

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
  var found_tocs = results.map(function(result){
    var title = result.$('title').text();
    var toc = result.$('#toc').text();

    var found_lines = [];
    toc.split("\n").forEach(function(line){
      if (line.match(keyword_reg)){
        found_lines.push(line.trim());
      }
    });

    return { title: title, found_lines: found_lines };
  }).filter(function(toc){
    return toc.found_lines.length > 0;
  });


  // 結果表示
  console.log("検索キーワード: " + keyword);
  console.log("ヒットした書籍数: " + found_tocs.length + " 冊");
  found_tocs.forEach(function(toc){
    console.log("\n・" + toc.title);
    console.log("\t" + toc.found_lines.join("\n\t").replace(keyword_reg, yellow + '$1' + reset));
  });
});

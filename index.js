var gihyo = require('./gihyo');

if (process.argv.length < 3){
  console.log("node index.js keyword [number_of_books]");
  return;
}

var keyword = process.argv[2];
var page = process.argv[3] || 1;
var PAGE_NUMBER = 20;

console.log("searching...");

var search_requests = [];
for(var i = 0; i < page; i += PAGE_NUMBER){
  search_requests.push(gihyo.search(keyword, i));
}

Promise.all(search_requests)
.then(function(results){
  var found_tocs = Array.prototype.concat.apply([], results);
  out_console(keyword, found_tocs);
});

function out_console(keyword, found_tocs){
  var keyword_reg = new RegExp('(' + keyword + ')', "gi");
  var green   = '\u001b[32m';
  var yellow  = '\u001b[33m';
  var reset   = '\u001b[0m';

  console.log("検索キーワード: " + keyword);
  console.log("ヒットした書籍数: " + found_tocs.length + " 冊");
  found_tocs.forEach(function(toc){
    console.log("\n" + green + "・" + toc.title + reset);
    console.log("\t" + toc.found_lines.join("\n\t").replace(keyword_reg, yellow + '$1' + reset));
  });
}

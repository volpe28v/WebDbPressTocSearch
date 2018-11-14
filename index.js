var gihyo = require('./gihyo');

if (process.argv.length < 3){
  console.log("node index.js keyword");
  return;
}

var keyword = process.argv[2];

gihyo.search(keyword)
.then(function(found_tocs){
  out_console(keyword, found_tocs);
});

function out_console(keyword, found_tocs){
  var keyword_reg = new RegExp('(' + keyword + ')', "gi");
  var yellow  = '\u001b[33m';
  var reset   = '\u001b[0m';

  console.log("検索キーワード: " + keyword);
  console.log("ヒットした書籍数: " + found_tocs.length + " 冊");
  found_tocs.forEach(function(toc){
    console.log("\n・" + toc.title);
    console.log("\t" + toc.found_lines.join("\n\t").replace(keyword_reg, yellow + '$1' + reset));
  });
}

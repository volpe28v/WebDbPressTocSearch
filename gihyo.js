var client = require('cheerio-httpcli');

var backnumber_url = 'https://gihyo.jp/magazine/wdpress/backnumber?start='

module.exports.search = function(keyword, page = 0){
  var keyword_reg = new RegExp('(' + keyword + ')', "gi");

  return new Promise(function(resolve, reject){
    client.fetch(backnumber_url + page, {})
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

        resolve(found_tocs);
      })
      .catch(function(err){
      });
  });
}

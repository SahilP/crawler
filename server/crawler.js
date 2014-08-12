urlSources = new Meteor.Collection('urlSources');
crawlerLog = new Meteor.Collection('crawlerLog');


var cheerio = Meteor.require('cheerio');
var request = Meteor.require('request');
var Fiber = Npm.require('fibers');




    var InsertUrl = function(url, urlLink, urlText) {
        urlSources.insert({
            url: url,
            link: urlLink,
            text: urlText,
            keywords: urlText.split(" "),
            score: 0
        });
    };

    var InsertCrawled = function(url) {
        crawlerLog.insert({
            toCrawl: url,
            crawled: ""
        });
    };

    function crawlManual(url) {


        var dbUrl = crawlerLog.findOne({"toCrawl": url});
        console.log(dbUrl);
        if (crawlerLog.find().count() === 0) 
            InsertCrawled(url);
        else if (dbUrl == undefined)
            InsertCrawled(url);
    };

    function crawlAdmin() {
            //console.log("hello");
            var toCrawl = crawlerLog.find({ "crawled": ""}).count();
            var toCrawlurl = crawlerLog.find({ "crawled": ""}).fetch();


    
            for(i = 0; i < toCrawl; i++) {     


                var currentUrl = toCrawlurl[i].toCrawl;
                var currentId = toCrawlurl[i]._id;

                crawlerLog.update(
                {_id: currentId},
                {$set: {crawled: currentUrl}});

                getList(currentUrl);


            };
     


    }


    function autoCreate() {


        var tofindUrl = urlSources.find({ }).fetch();
        var tofindCount = urlSources.find().count();
        var test = crawlerLog.findOne({ "toCrawl": "http://www.example.com", note:{"exists": true}});
        console.log(tofindUrl);


        



       
        for (i = 0; i < tofindCount; i++) {


            var currentId = tofindUrl[i]._id;
            var currentLink = tofindUrl[i].link;

            var checkUrl = crawlerLog.findOne({ "toCrawl": "http://www.example.com", note:{"exists": true}});




            // console.log("autoCreate");
  
            // console.log(checkUrl);

            // console.log(currentLink);
            // console.log(currentId);

            
            
        };

    };

   


    function getList(url) {
        request(url, function(error, response, html) {
            Fiber(function() {
	            $ = cheerio.load(html);
	            if (!error && response.statusCode == 200) {

	            	databaseUrl = urlSources.findOne({ url: url, note:{"$exists": true}});

	            	if (databaseUrl != true) {


	            	    var urlData = {}
	        	        var links = $('a');



	    	            $(links).each(function(i, link) {
		                    var urlLink = ($(link).attr('href'));
		                    var urlText = ($(link).text());

	                    	InsertUrl(url, urlLink, urlText);
	                    	//console.log(urlLink);
	                    	//console.log(urlText);
	                	});

	            	}
	                //console.log(html);

	            }
	        }).run();
        });

    };




    Meteor.methods({
        'inputUrl': function(inputUrl) {
            //getList(inputUrl);
            crawlManual(inputUrl);

            autoCreate();
            crawlAdmin();
           


        }
    });
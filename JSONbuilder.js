var request = require('request');

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

request('http://housing.uoregon.edu/dining/todaysmenu.php?d=1335078000&lid=1', function (error, response, body) {
    if (!error && response.statusCode == 200) {

        var window = require('jsdom').jsdom(body, null, {
            FetchExternalResources: false,
            ProcessExternalResources: false,
            MutationEvents: false,
            QuerySelector: false
        }).createWindow();

        var $ = require('jquery').create(window);

		var menu = new Object();
		var currentSection = "";

        $(".minorheader,.text").each(function (index) {
			try {
				var itemClass = $(this).attr("class")
				var itemText = $(this).html();

				if (itemClass == "minorheader") {
					currentSection = toTitleCase(itemText);
					menu[currentSection] = [];
				}

				if (itemClass == "text" && currentSection != "") {
					console.log(menu, menu[currentSection]);
					menu[currentSection].push(itemText);
				} 
        	} catch (e) {
				console.log("Parse error!", e)
			}

			console.log(index, itemClass, itemText);
        });
		delete menu["default"];
		console.log(menu);

    } else {
    	console.log("Error getting page.");
    }
});
describe("jRender", function() {
	describe("jRender init", function() {
		it("should instantiate an instance of jRender", function() {
			var jrender = jRender({
				"$schema" : "http://json-schema.org/draft-04/schema#",
				"title" : "File System",
				"type" : "object",
				"properties" : {
					"storage" : {
						"type" : "string"
					}
				}
			}, "File System");
			expect( jrender instanceof jRender).toBeTruthy();
		});
	});
});

/*(function() {
	var jasmineEnv = jasmine.getEnv();
	jasmineEnv.updateInterval = 250;
	var htmlReporter = new jasmine.HtmlReporter();
	jasmineEnv.addReporter(htmlReporter);

	var currentWindowOnload = window.onload;
	window.onload = function() {
		if (currentWindowOnload) {
			currentWindowOnload();
		}

		document.querySelector('.version').innerHTML = jasmineEnv.versionString();
		execJasmine();
	};

	function execJasmine() {
		jasmineEnv.execute();
	}

})();*/

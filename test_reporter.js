describe("jRender", function() {
	describe("__detectSelfReferencing__", function(){
		it("should detect if there's a self reference", function(){
			var path = "#/definitions/nfs-name/self";
			var ref = "#/definitions";
			expect(jRender.UTILS["__detectSelfReferencing__"](path, ref)).toBeTruthy();
			
			ref = "#";
			expect(jRender.UTILS["__detectSelfReferencing__"](path, ref)).toBeTruthy();
			
			ref = "#/Product";
			expect(jRender.UTILS["__detectSelfReferencing__"](path, ref)).toBeFalsy();
		});
	});
	describe("__updatePath__", function(){
		it("update current path with ref path", function(){
			var path = "#/#_items/nfs-name/self";
			var ref = "#/definitions/nfs-name";
			expect(jRender.UTILS["__updatePath__"](path, ref)).toEqual("#/definitions/nfs-name/self");
			
			path = "#/#_items/nfs-name";
			ref = "#/definitions/nfs-name/self/root";
			expect(jRender.UTILS["__updatePath__"](path, ref)).toEqual("#/definitions/nfs-name/self");
		});
	});
	describe("jRender init", function() {
		it("should instantiate an instance of jRender", function() {
			var jrender = jRender({
				"$schema" : "http://json-schema.org/draft-04/schema#",
				"title" : "File System",
				"type" : "object",
				"properties" : {
					"storage" : {
						"type" : "string",
					}
				}
			});
			expect( jrender instanceof jRender).toBeTruthy();
		});
	});

	describe("jRender getRefSchema", function() {
		it("should get the schema specified in $ref", function() {
			var json = {
				"$schema" : "http://json-schema.org/draft-04/schema#",
				"title" : "File System",
				"type" : "object",
				"properties" : {
					"storage" : {
						"type" : "object",
						"$ref" : "#/definitions/nfs"
					}
				},
				"definitions" : {
					"nfs" : {
						"properties" : {
							"type" : {
								"type" : "string"
							}
						}
					}
				}
			};
			var jrender = jRender(json);
			var ref_path_parts = "#/definitions/nfs".split("/");
			var ref_schema = jrender.getRefSchema(ref_path_parts);

			var expected_ref_schema = {
				"properties" : {
					"type" : {
						"type" : "string"
					}
				}
			};

			expect(ref_schema).toEqual(expected_ref_schema);
		});
	});

	describe("jRender create form of type object", function() {
		it("should throw an error if the type is not specified and neither is items or properties defined", function() {
			var json = {
				"$schema" : "http://json-schema.org/draft-04/schema#",
				"title" : "File System",
				"definitions" : {
					"nfs" : {
						"properties" : {
							"type" : {
								"type" : "string"
							}
						}
					}
				}
			};
			expect(function() {
				jRender(json)
			}).toThrow(new Error("Cannot determine type of form"));
		});

		it("should create a form with the root as '#' for a json schema of type object", function() {
			var json = {
				"$schema" : "http://json-schema.org/draft-04/schema#",
				"title" : "File System",
				"type" : "object",
				"properties" : {
					"storage" : {
						"type" : "object",
						"properties" : {
							"type" : {
								"type" : "string"
							},
							"remotePath" : {
								"type" : "string"
							}
						}
					}
				}
			};

			var jrender = jRender(json);
			expect(jrender.forms["#"]).toBeTruthy();
			expect(jrender.forms["#"] instanceof jRender.UTILS["Form"]).toBeTruthy();

			var form_html = '<div><input placeholder="type"><input placeholder="remotePath"></div>';

			expect($(jrender.forms["#"].html).html()).toEqual(form_html);
		});
		it("should recognize an object type even if the type is not explicitly provided", function() {
			var json = {
				"$schema" : "http://json-schema.org/draft-04/schema#",
				"title" : "File System",
				"properties" : {
					"storage" : {
						"type" : "object",
						"properties" : {
							"type" : {
								"type" : "string"
							},
							"remotePath" : {
								"type" : "string"
							}
						}
					}
				}
			};
			var jrender = jRender(json);
			expect(jrender.forms["#"]).toBeTruthy();
			expect(jrender.forms["#"] instanceof jRender.UTILS["Form"]).toBeTruthy();
		});
		it("should create a form with the given title for a json schema of type object with a property referencing a definition", function() {
			var json = {
				"$schema" : "http://json-schema.org/draft-04/schema#",
				"title" : "File System",
				"type" : "object",
				"properties" : {
					"storage" : {
						"$ref" : "#/definitions/nfs"
					}
				},
				"definitions" : {
					"nfs" : {
						"properties" : {
							"type" : {
								"type" : "string"
							}
						}
					}
				}
			};
			var jrender = jRender(json);
			expect(jrender.forms["storage"]).toBeTruthy();
			expect(jrender.forms["storage"] instanceof jRender.UTILS["Form"]).toBeTruthy();

			var form_html = '<div><div><input placeholder="type"></div></div>';

			expect($(jrender.forms["#"].html).html()).toEqual(form_html);
		});
	});
	describe("jRender create form of type array", function() {
		var jrender;
		var json;
		beforeEach(function() {
			json = {
				"$schema" : "http://json-schema.org/draft-04/schema#",
				"title" : "Product set",
				"type" : "array",
				"items" : {
					"title" : "Product",
					"type" : "object",
					"properties" : {
						"id" : {
							"description" : "The unique identifier for a product",
							"type" : "number"
						},
						"name" : {
							"type" : "string"
						}
					}
				}
			};

			jrender = jRender(json);
		});
		it("should create a button if the schema is of type array", function() {
			expect(jrender.forms["#"]).toBeTruthy();
			expect(jrender.forms["#"] instanceof jRender.UTILS["Button"]).toBeTruthy();
			expect($(jrender.forms["#"].html).html()).toEqual("<button>Add Product</button>");
		});
		it("should recognize an array type even if the type is not explicitly provided", function() {
			var json = {
				"$schema" : "http://json-schema.org/draft-04/schema#",
				"title" : "Product set",
				"items" : {
					"title" : "Product",
					"type" : "object",
					"properties" : {
						"id" : {
							"description" : "The unique identifier for a product",
							"type" : "number"
						},
						"name" : {
							"type" : "string"
						}
					}
				}
			};
			var jrender = jRender(json);
			expect(jrender.forms["#"]).toBeTruthy();
			expect(jrender.forms["#"] instanceof jRender.UTILS["Button"]).toBeTruthy();
		});
		it("should create a form for items without a title with the *parent_name*_items", function() {
			var json = {
				"$schema" : "http://json-schema.org/draft-04/schema#",
				"title" : "Product set",
				"type" : "array",
				"items" : {
					"type" : "object",
					"properties" : {
						"id" : {
							"description" : "The unique identifier for a product",
							"type" : "number"
						},
						"name" : {
							"type" : "string"
						}
					}
				}
			};
			var jrender = jRender(json);
			expect(jrender.forms["#"]).toBeTruthy();
			expect(jrender.forms["#_items"]).toBeTruthy();
		});
	})
});

(function() {
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

})();

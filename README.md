jRender
=======

HTML form renderer for [JSON Schema (v4)](http://json-schema.org/)

jRender handles $ref specified in JSON Schema v4. It also handles cyclic and self referencing.

To include jRender in your project, first clone the repository with:

<pre><code>git clone https://github.com/vu2srk/jRender.git
</code></pre> 

And then add the following lines to your code : 

<pre><code>&ltscript src="lib/jquery.js" type="text/javascript"&gt&lt/script&gt
&ltscript src="jRender.js" type="text/javascript"&gt&lt/script&gt
</code></pre> 

###Examples ######

<pre><code>var personal_details_schema = {
	type : "object",
	title :"Personal Details",
	properties : {
		"First Name" : {
			"type" : "string"
		},
		"Last Name" : {
			"type" : "string"
		},
		"Address" : {
			"type" : "array",
			"items" : {
				"$ref" : "#/definitions/address_object"
			}
		},
		"Age" : {
			"type" : "string"
		},
		"Interests" : {
			"enum" : ["Sports", "Music", "Movies", "Food", "Fashion", "Technology", "Business"]
		},
		"Gender" : {
			"type" : "boolean",
			"format" : "Male/Female"
		}
	},
	"definitions" : {
		"address_object" : {
			"properties" : {
				"Door No." : {
					"type" : "string"
				},
				"Street Name" : {
					"type" : "string"
				},
				"City" : {
					"type" : "string"
				},
				"Country" : {
					"type" : "string"
				},
				"PIN" : {
					"type" : "string"
				}
			}
		}
	}
};
</code></pre> 

<pre><code>var json_to_render = personal_details_schema;

options = {
	"method" : "",
	"action" : "",
	"root" : "Personal Details",
	"hook" : "#hello_div",
	"render-options" : {
		"render-types" : {
			"enum" : "checkbox",
			"boolean" : "radio"
		}
	}
};

jrender = jRender(json_to_render, options);
</code></pre> 

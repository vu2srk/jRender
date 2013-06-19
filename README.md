jRender
=======

HTML form renderer for [JSON Schema (v4)](http://json-schema.org/)

jRender handles $ref specified in JSON Schema v4. It also handles cyclic and self referencing.

To include jRender in your project, first clone the repository with:

<pre><code>git clone https://github.com/vu2srk/jRender.git
</code></pre> 

And then add the following lines to your code : 

<pre><code><script src="lib/jquery.js" type="text/javascript"></script>
<script src="jRender.js" type="text/javascript"></script>
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

####Output #####

<form method="" action="" name="Personal Details"><div id="hello_div">

    	<div name="Personal Details" class="indent"><h4>Personal Details</h4><div><input placeholder="First Name"></div><div><input placeholder="Last Name"></div><div><button>Address</button></div><div><input placeholder="Age"></div><div><div><h4>Interests</h4><input type="checkbox" name="Interests" value="Sports">Sports<br><input type="checkbox" name="Interests" value="Music">Music<br><input type="checkbox" name="Interests" value="Movies">Movies<br><input type="checkbox" name="Interests" value="Food">Food<br><input type="checkbox" name="Interests" value="Fashion">Fashion<br><input type="checkbox" name="Interests" value="Technology">Technology<br><input type="checkbox" name="Interests" value="Business">Business<br></div></div><div><div><h4>Gender</h4><input type="radio" name="Gender" value="Male">Male<br><input type="radio" name="Gender" value="Female">Female<br></div></div></div></div></form>


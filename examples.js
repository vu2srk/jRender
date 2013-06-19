var personal_details_schema = {
	type : "object",
	title : "Personal Details",
	properties : {
		"First Name" : {
			"type" : "string"
		},
		"Last Name" : {
			"type" : "string"
		},
		"Address" : {

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
	}
};

var personal_details_schema_ref = {
	type : "object",
	title : "Personal Details",
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
		"Interested In" : {
			"enum" : ["Sports", "Music", "Movies", "Food", "Fashion", "Technology", "Business"]
		},
		"Gender" : {
			"type" : "boolean",
			"format" : "Male/Female"
		}
	},
	definitions : {
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

var personal_details_schema_self_ref = {
	type : "object",
	title : "Personal Details",
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
		"Interested In" : {
			"enum" : ["Sports", "Music", "Movies", "Food", "Fashion", "Technology", "Business"]
		},
		"Gender" : {
			"type" : "boolean",
			"format" : "Male/Female"
		},
		"Child" : {
			"$ref" : "#"
		}
	},
	definitions : {
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

var personal_details_schema_cyclic = {
	type : "object",
	title : "Personal Details",
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
		"Interested In" : {
			"enum" : ["Sports", "Music", "Movies", "Food", "Fashion", "Technology", "Business"]
		},
		"Gender" : {
			"type" : "boolean",
			"format" : "Male/Female"
		},
		"Child" : {
			"$ref" : "#"
		}
	},
	definitions : {
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
				},
				"Contact Person" : {
					"$ref" : "#/definitions/contact_person"
				}
			}
		},
		"contact_person" : {
			"properties" : {
				"First Name" : {
					"type" : "string"
				},
				"Last Name" : {
					"type" : "string"
				},
				"Address" : {
					"$ref" : "#/definitions/address_object"
				}
			}
		}
	}
};

var json_to_render = personal_details_schema;

$(document).ready(function() {
	var json_to_render = personal_details_schema;
	
	var hook = "#simple_example_output";
	var enum_render = "checkbox";
	var boolean_render = "radio";

	var options = {
		"method" : "",
		"action" : "",
		"root" : "Personal Details",
		"hook" : hook,
		"render-options" : {
			"render-types" : {
				"enum" : enum_render,
				"boolean" : boolean_render
			}
		}
	};
	
	
	jrender = jRender(json_to_render, options);
	
	hook = "#advanced_example_output";
	enum_render = "select";
	boolean_render = "radio";
	options = {
		"method" : "",
		"action" : "",
		"root" : "Personal Details",
		"hook" : hook,
		"render-options" : {
			"render-types" : {
				"enum" : enum_render,
				"boolean" : boolean_render
			}
		}
	};
	json_to_render = personal_details_schema_ref;
	jrender = jRender(json_to_render, options);
	
	hook = "#self_referencing_output";
	enum_render = "checkbox";
	boolean_render = "radio";
	options = {
		"method" : "",
		"action" : "",
		"root" : "Personal Details",
		"hook" : hook,
		"render-options" : {
			"render-types" : {
				"enum" : enum_render,
				"boolean" : boolean_render
			}
		}
	};
	json_to_render = personal_details_schema_self_ref;
	jrender = jRender(json_to_render, options);
	
	hook = "#cyclic_referencing_output";
	enum_render = "checkbox";
	boolean_render = "radio";
	options = {
		"method" : "",
		"action" : "",
		"root" : "Personal Details",
		"hook" : hook,
		"render-options" : {
			"render-types" : {
				"enum" : enum_render,
				"boolean" : boolean_render
			}
		}
	};
	json_to_render = personal_details_schema_cyclic;
	jrender = jRender(json_to_render, options);
})



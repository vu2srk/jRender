(function(window) {

	var jRender = function(json, form_root) {
		return new jRender.fn.init(json, form_root);
	};
	
	var __in_process__ = {};

	jRender.ARRAY = "array";
	jRender.OBJECT = "object";
	jRender.INPUT = "input";

	jRender.fn = jRender.prototype = {
		init : function(json, form_root) {

			if ( typeof (json) === "undefined")
				json = {};

			this.schema = json;
			this.root_type = json.type || this.getFormType(json);
			this.root = form_root || json.title;
			if (!this.root){
				throw new Error("Please provide a root form title");
			}
			this.form_order = [];
			this.forms = {};
			this.parse(this.root, this.schema);
		},

		getRefSchema : function(ref_path_parts) {
			var ref_schema = null;

			//assuming that index 0 is going to be # everytime
			ref_schema = this.schema;
			for (var i = 1; i < ref_path_parts.length; i++) {
				ref_schema = ref_schema[ref_path_parts[i]];
			}
			return ref_schema;
		},

		getFormType : function(_fragment) {
			var type;
			
			if (_fragment.type)
				return _fragment.type;

			if (_fragment.items) {
				type = jRender.ARRAY;
			} else if (_fragment.properties) {
				type = jRender.OBJECT;
			} else if (_fragment.$ref) {
				var ref_path_parts = _fragment.$ref.split("/");
				_fragment = this.getRefSchema(ref_path_parts);
				type = this.getFormType(_fragment);
			}

			if (!type || (type).trim() == "") {
				throw new Error("Cannot determine type of form");
			}

			return type;
		},
		
		__createButtonToHandleRef__ : function(root, _fragment, _is_headless){
			var button_for_render = new Button(root);
			this.form_order.push(root + "_button");
			this.forms[root + "_button"] = button_for_render;
			//this.__addButtonHandler__(button_for_render, _fragment);
			return button_for_render;
		},

		parse : function(root, _fragment) {
			var type = this.getFormType(_fragment);
			var _is_ref = false;
			
			var $ref = _fragment.$ref || null;
			var next_root;
	
			while($ref){
				var ref_path_parts = $ref.split("/");
				_fragment = this.getRefSchema(ref_path_parts);
				$ref = _fragment.$ref || (_fragment.items && _fragment.items.$ref) || null;
			}
			
			if (type == jRender.ARRAY && !_fragment.items){
				throw new Error("Please check schema. Array has no items");
			}
			
			if (type == jRender.OBJECT && !_fragment.properties){
				throw new Error("Please check schema. Object has no properties");
			}
			
			if (type != this.getFormType(_fragment)){
				throw new Error("Type mismatch");
			}
			
			if (type == jRender.ARRAY){
				
				if (this.getFormType(_fragment))
				return this.__createButtonToHandleRef__(root, _fragment, true);
				
			} else if (type == jRender.OBJECT){
				if (!__in_process__[root]){
					__in_process__[root] = true;
					this.forms[root] = new Form(root);
					for (prop in _fragment.properties){
						next_root = prop;
						this.forms[root].fields.push(this.parse(next_root, _fragment.properties[prop]));
					}
					__in_process__[root] = false;
				} else {
					return this.__createButtonToHandleRef__(root, _fragment);
				}
				
			} else {
				return new Field(root, _fragment.type);
			}
		},

		display : function(hook) {
			$(hook).append(this.forms["#"].html.clone(true));
		}
	};

	var Button = function(button_text, button) {
		if (!button) {
			var div = jQuery("<div>");
			button = jQuery("<button>").html("Add " + button_text);
			div.append(button);
		}
		this.html = div || button;
	};

	var Form = function(name) {
		this.name = name;
		this.fields = [];
	};

	var Field = function(name, type, options) {
		this.name = name;
		this.type = type;
		if (options)
			this.options = options;
	};

	jRender.UTILS = {
		"Form" : Form,
		"Button" : Button,
		"Field" : Field
	};

	jRender.fn.init.prototype = jRender.prototype;

	window.jRender = jRender;

})(window);

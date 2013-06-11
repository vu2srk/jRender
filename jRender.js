(function(window) {

	var jRender = function(json, options) {
		return new jRender.fn.init(json, options);
	};
	
	var _in_process = {};

	jRender.ARRAY = "array";
	jRender.OBJECT = "object";
	jRender.INPUT = "input";

	jRender.fn = jRender.prototype = {
		init : function(json, options) {

			if ( typeof (json) === "undefined")
				json = {};

			this.schema = json;
			this.root_type = json.type || this.getFormType(json);
			this.root = options.root || json.title;
			if (!this.root){
				throw new Error("Please provide a root form title");
			}
			
			this.form_sections = {};
			
			//if the root form is an array and no forms have been created;
			var main_form = this.parse(this.root, this.schema);
			if (!this.form_sections[this.root]){
				this.form_sections[this.root] = new FormSection(this.root);
				this.form_sections[this.root].fields.push(main_form);
			}
			
			this.draw(this.root, options.hook);
		},
		
		draw : function(root, hook){
			var fields = this.form_sections[root].fields;
			var form_section_div = this.form_sections[root].html;
			var title = jQuery("<h4>").html(root);
			form_section_div.append(title);
			for (var i=0; i<fields.length; i++){
				var field_div = jQuery("<div>");
				if (fields[i] instanceof FormSection){
					this.draw(fields[i].name, field_div);
				} else {
					field_div.append(fields[i].html);
				}
				form_section_div.append(field_div);
			}
			$(hook).append(form_section_div);
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
		
		_createButtonToHandleRef : function(root, _fragment, type){
			var button_for_render = new Button(_fragment.title || root);
			var me = this;
			var _buttonClickHandler = function(){
				me.form_sections[root] = new FormSection(root);
				me.form_sections[root].fields.push(me.parse(root, _fragment));
				me.draw(root, this.parentNode);
				if (type == jRender.OBJECT){
					this.parentNode.children[0].remove();
				}
			};
			button_for_render.addEventHandler("click", _buttonClickHandler);
			return button_for_render;
		},
		
		validate : function(type, _fragment){
			if (type == jRender.ARRAY && !_fragment.items){
				throw new Error("Please check schema. Array has no items");
			}
			
			if (type == jRender.OBJECT && !_fragment.properties){
				throw new Error("Please check schema. Object has no properties");
			}
			
			if (type != this.getFormType(_fragment)){
				throw new Error("Type mismatch");
			}
		},

		parse : function(root, _fragment) {
			
			var type = this.getFormType(_fragment);
			var _is_ref = false;
			
			var $ref = _fragment.$ref || (_fragment.items && _fragment.items.$ref) || null;
			var _fragment_from_ref;
			var next_root;
			
			if($ref){
				var ref_path_parts = $ref.split("/");
				_fragment_from_ref = this.getRefSchema(ref_path_parts);
			}
			
			if (type == jRender.ARRAY){
				
				this.validate(type, _fragment);
				return this._createButtonToHandleRef(root, _fragment_from_ref || _fragment.items, type);
				
			} else if (type == jRender.OBJECT){
				if (!_in_process[root]){
					_in_process[root] = true;
					if($ref){
						_fragment = _fragment_from_ref;
						this.parse(root, _fragment);
					}
					this.validate(type, _fragment);
					this.form_sections[root] = new FormSection(root);
					for (prop in _fragment.properties){
						next_root = prop;
						this.form_sections[root].fields.push(this.parse(next_root, _fragment.properties[prop]));
					}
					_in_process[root] = false;
					return this.form_sections[root];
				} else {

					return this._createButtonToHandleRef(root, _fragment, type);
				}
				
			} else {
				return new Field(root, _fragment.type);
			}
		}
	};
	
	var DOMElement = function(){
		
	};
	
	DOMElement.prototype = {
		setHTML : function(){
			
		}
	};

	var Button = function(button_text) {
		this.name = button_text;
		this.setHTML();
	};
	
	Button.prototype = new DOMElement;
	
	Button.prototype.setHTML = function(){
		var html = jQuery("<button>");
		html.html(this.name);
		this.html = html;
	}
	
	Button.prototype.addEventHandler = function(event, handler){
		this.html.on(event, handler);
	}

	var FormSection = function(name) {
		this.name = name;
		this.fields = [];
		this.setHTML();
	};
	
	FormSection.prototype = new DOMElement;
	
	FormSection.prototype.setHTML = function(){
		var html = jQuery("<div>");
		html.attr("name", this.name)
		html.addClass("indent");
		this.html = html;
	}

	var Field = function(name, type, options) {
		this.name = name;
		this.type = type;
		if (options)
			this.options = options;
		this.setHTML();
	};
	
	Field.prototype = new DOMElement;
	
	Field.prototype.setHTML = function(){
		var html = jQuery("<input>").attr("placeholder", this.name);
		this.html = html;
	}

	jRender.UTILS = {
		"Form" : FormSection,
		"Button" : Button,
		"Field" : Field
	};

	jRender.fn.init.prototype = jRender.prototype;

	window.jRender = jRender;

})(window);

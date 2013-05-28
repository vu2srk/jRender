(function(window) {
	var jRender = function(json) {
		return new jRender.fn.init(json);
	}

	jRender.fn = jRender.prototype = {
		init : function(json) {
			this.schema = json;
			this.root = this.schema.title;
			this.forms = {};
			this.createForms(json);
		},

		getRefSchema : function(ref) {
			var ref_path_parts = ref.split("/");
			var ref_schema = null;

			//assuming that index 0 is going to be # everytime
			ref_schema = this.schema;
			for (var i = 1; i < ref_path_parts.length; i++) {
				ref_schema = ref_schema[ref_path_parts[i]];
			}
			return ref_schema;
		},

		createForms : function(json, prop_name, type) {
			json.type && ( type = json.type);

			var form = null;

			var ref = json.$ref || (json.items && json.items.$ref) || null;
			var ref_schema = null;

			if (ref && ref != "#") {
				ref_schema = this.getRefSchema(ref);
				!type && ( type = ref_schema.type);
			}
			var title = (ref_schema && ref_schema.title) || prop_name || json.title;

			if (ref && ref == "#") {
				type = type || this.schema.type;
				title = this.root;
			}

			if (type == "array") {

				form = jQuery("<div>");
				if (!this.forms[title])
					this.forms[title] = {};
				if (this.forms[title] && !this.forms[title].button) {
					var button = this.renderButton((json.items && json.items.title) || title);
					this.forms[title].button = button;
				} else {
					button = this.forms[title].button.clone(true).html("Add " + prop_name);
				}
				form.append(button);
				if (ref != "#")
					this.forms[title].html = this.createForms((ref_schema || json.items), prop_name, json.items.type);
				return form;

			} else if (type == "object") {
				if (ref != "#") {
					form = jQuery("<div>");
					var h4 = jQuery("<h4>").html(title);
					form.append(h4);
					this.forms[title] = {};

					var properties = (ref_schema && ref_schema.properties) || json.properties;
					for (var prop in properties) {
						form.append(this.createForms(properties[prop], prop));
					}

					this.forms[title].html = form;
					return form;
				} else {
					var me = this;
					var button = null;
					form = jQuery("<div>");
					if (!this.forms[title])
						this.forms[title] = {};
					if (this.forms[title] && !this.forms[title].button) {
						button = this.renderButton((json.items && json.items.title) || title);
						this.forms[title].button = button;
					} else {
						button = this.forms[title].button.clone().html("Add " + prop_name);
						button.on("click", function() {
							var parent = this.parentNode;
							$(parent).empty();
							$(parent).append(me.forms[title].html.clone(true).addClass("indent"));
						});
					}
					form.append(button);
					return form;
				}
			} else {

				form = jQuery("<input>");
				form.attr("placeholder", title);
				return form;

			}
		},

		renderButton : function(title) {
			var me = this;

			var button = jQuery("<button>").html("Add " + title);
			button.on("click", function() {
				$(this.parentNode).append(me.forms[title].html.clone(true).addClass("indent"));
			});

			return button;
		}
	}

	jRender.fn.init.prototype = jRender.prototype;

	window.jRender = jRender;

})(window);

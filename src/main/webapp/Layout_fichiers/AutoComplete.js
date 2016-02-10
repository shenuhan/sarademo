function AutoComplete(id, options) {

	/*
	 * this.inputField = jQuery("input#" + id);
	 * 
	 * On ne peut utiliser la ligne précédente car dans certains cas Tapestry
	 * génère des ids en ajoutant un credential à la fin de l'id, préfixé par le
	 * caractère ":" qui est alors mal interprété par le css selector de jQuery.
	 */
	this.inputField = jQuery("input[id='" + id + "']");
	this.options = options;
}

AutoComplete.prototype = {
	initialize : function() {
		var self = this;
		this.inputField.autocomplete(this.options);
		this.inputField.autocomplete("option", "source", function (request, response) {jQuery.post(self.options['source'], request, response);});
		this.inputField.on("autocompletechange", function(event, ui) {
			if (ui.item == null) {
				jQuery(this).val("");
				jQuery(this).autocomplete("search");
				self.selectedValue = null;
			}
		});
		this.inputField.on("autocompleteresponse", function( event, ui ) {
			if (ui.content.length == 0) {
				self.selectedValue = null;
			}
		});
		this.inputField.on("autocompleteselect", function(event, ui) {
			self.selectedValue = ui.item;
			/* MANTIS 17629 */
			/* On lance la recherche après la sélection de l'item et non plus après la perte du focus */
			if (!self.selectedValue) {
				jQuery(this).val("");
			}
			else {
				jQuery(this).val(self.selectedValue.value);
			}
			jQuery(this).trigger("autocompletefocusout");
			
		});
		/* MANTIS 17629 */
		this.inputField.on("keyup", function(event) {
			if(jQuery(this).val() == "") {
				self.selectedValue = null;
				jQuery(this).trigger("autocompletefocusout");
			}
		});
		this.inputField.on("focusout", function(event) {
			if (!self.selectedValue) {
				jQuery(this).val("");
			}
			/* MANTIS 17629 */
			/* jQuery(this).trigger("autocompletefocusout"); */
		});
	}
};

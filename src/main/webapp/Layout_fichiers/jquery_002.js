(function($) {
	$.fn.message = function(options) {
		var result = new Message(this, options);
		result.show();
		return result;
	};
})(jQuery);

/**
 * Gestion des messages de notifications.
 */
function Message(el, options) {
	this.options = options;
	this.div = jQuery("<div/>")
			.addClass("message message_" + this.options.type);
	jQuery(el).append(this.div);
}

Message.prototype = {

	/**
	 * Affichage du message.
	 */
	show : function() {
		var self = this;
		var distance = 0;
		jQuery(".message").each(function(i, el) {
			if (el !== self.div[0]) {
				distance += jQuery(el).outerHeight(true);
			}
		});

		/*
		 * RG_ERGO_3 : Les messages d'informations, d'erreurs et d'alertes
		 * seront affichés en marge à gauche, en dessous du menu vertical
		 * présent sur certains écrans.
		 */
		this.div.css({
			bottom : '+=' + distance
		});
		this.div.text(this.options.text);
		this.div.show({
			effect : "slide",
			complete : function() {

				/*
				 * RG_ERGO_4 : Les messages d'erreurs et d'alerte resteront
				 * affichés (sauf si l'option forceHideMessage est pass�e en param�tre et valoris�e )� true)
				 * jusqu'à la future validation du formulaire de
				 * l'écran. Les messages d'informations ou alertes seront
				 * affichés pendant 60 secondes puis disparaitront.
				 */
				if (self.options.type !== "error" || self.options.forceHideMessage===true) {
					var timeout = 60000;
					if (self.options.timeout) {
						timeout = self.options.timeout;
					}
					setTimeout(function() {
						self.hide();
					}, timeout);
				}
			}
		});
	},

	/**
	 * Suppression du message et de la div associée.
	 */
	hide : function() {
		var self = this;
		this.div.hide({
			effect : "slide",
			complete : function() {
				var distance = self.div.outerHeight(true);
				jQuery("~.message", self.div).animate({
					bottom : '-=' + distance
				});
				self.div.remove();
			}
		});
	}

};
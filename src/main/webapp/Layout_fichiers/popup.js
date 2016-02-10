// Nécessite jQuery 1.7+

/**
 * Gestionnaire des popup.
 * 
 * @author vdubus
 */
var popupManager = (function($) {
	
	/**
	 * Récupère ou créé la popup de confirmation.
	 * 
	 * @returns {jQuery} l'objet référençant la popup.
	 */
	var findOrCreateConfirmPopup = function() {
		var confirmPopup = $('div#dialog-confirm');
		if (confirmPopup.length === 0) {
			// Si la popup n'existe pas encore, alors nous la créons et l'ajoutons au corps de la page.
			confirmPopup = jQuery("<div/>", {
				id : 'dialog-confirm',
				title : 'Attention'
			}).appendTo("body");
		}
		return confirmPopup;
	};
	
	return {
		
		/**
		 * Ouvre une popup de confirmation oui/non.
		 * 
		 * @param {Object} data les données de configuration contenant les informations : {String} message, {function} okFunction et {function} koFunction}.
		 */
		confirm : function(data) {
			// Récupère la popup présente dans la page.
			var confirmPopup = findOrCreateConfirmPopup();
			
			// Ajout du message à la popup.
			var content = $('<p/>').html(data.message);
			confirmPopup.empty().append(content);
			
			// Ouvre la popup de confirmation.
			confirmPopup.dialog({
				resizable : false,
				draggable : false,
				modal : true,
				dialogClass : "dialogbox no-close",
				closeOnEscape : false,
				buttons : [{
					name : "bt_vert",
					text : "Oui",
					click : function() {
						$(this).dialog("close");
						$(this).dialog('destroy').remove();
						if (data.okFunction) {
							// Si une méthode a été défini sur le click du bouton "oui", alors nous l'exécutons.
							data.okFunction();
						}
					}
				}, {
					name : "bt_rouge",
					text : "Non",
					click : function() {
						$(this).dialog("close");
						if (data.koFunction) {
							// Si une méthode a été défini sur le click du bouton "non", alors nous l'exécutons.
							data.koFunction();
						}
					}
				}]
			});
		},
		
		/**
		 * Ouvre une popup d'alerte
		 * 
		 * @param {Object} data les données de configuration contenant les informations : {String} message, {function} okFunction}.
		 */
		alert : function(data) {
			// Récupère la popup présente dans la page.
			var confirmPopup = findOrCreateConfirmPopup();
			
			// Ajout du message à la popup.
			var content = $('<p/>').html(data.message);
			confirmPopup.empty().append(content);
			
			// Ouvre la popup d'alerte.
			confirmPopup.dialog({
				resizable : false,
				draggable : false,
				modal : true,
				dialogClass : "dialogbox no-close",
				closeOnEscape : false,
				buttons : [{
					name : "bt_vert",
					text : "OK",
					click : function() {
						$(this).dialog("close");
						if (data.okFunction) {
							// Si une méthode a été défini sur le click du bouton "oui", alors nous l'exécutons.
							data.okFunction();
						}
					}
				}]
			});
			
		}
	};
	
})(jQuery);

/**
 * @deprecated Utilisez popupManager.alert({message : "MonMessage"});
 */
function popupAlert(message) {
	var div = jQuery("<div/>", {
		id : 'dialog-confirm',
		title : 'Attention'
	}).appendTo("body").html(message);
	div.dialog({
		resizable : false,
		draggable : false,
		modal : true,
		dialogClass : "dialogbox",
		buttons : [{
			name : "bt_vert",
			text : "Ok",
			click : function() {
				jQuery(this).dialog("close");
				jQuery(this).dialog('destroy').remove();
			}
		}]
	});
}

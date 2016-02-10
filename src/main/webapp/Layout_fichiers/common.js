/**
 * Classe javascript regroupant des methodes utiles partout dans les pages.
 * @returns
 */

/**
 * Constructeur
 */
function Common(){}

/**
 * Methodes
 */
Common.prototype = {
	/**
	 * Initialisation du composant.
	 */
	initialize : function initialize()
	{
	},	
		
	/**
	 * @return : Retourne l'url vers la page pour les requetes ajax.
	 */
	getBaseUrl : function ()
	{
		var protocol = document.location.protocol;
		var host = document.location.host;
		var websiteName = common.getWebsiteName(); 
		
		return protocol + "//" + host + "/" + websiteName;
	},
		
	/**
	 * @return : Retourne le nom du site (partie apres le port dans l'url)
	 */
	getWebsiteName : function ()
	{
		var pathNames = document.location.pathname.split("/");
		
		return pathNames[1];
	},
	
	/**
	 * Affiche un popup d'erreur avec le message passe en parametre.
	 * @param errorMessage String : Message a afficher.
	 * @param redirectToLoginPage Boolean : Flag indiquant si on doit faire une redirection sur la page de login (et donc niquer la session).
	 */
	displayAjaxError : function(errorMessage, redirectToLoginPage)
	{
		jQuery("#displayAjaxErrorDialog").remove();
		jQuery("body").append("<div id=\"displayAjaxErrorDialog\">Erreur: " + errorMessage + "</div>");
		
		jQuery("#displayAjaxErrorDialog").dialog({
			 autoOpen: false,
			 modal: true,
			 draggable: false,
			 resizable: false,
			 dialogClass: "dialogbox",
			 buttons:[{
					name: "bt_oui",
					text: "Ok",
					click: function() {
						 jQuery(this).dialog("close");
						 if(redirectToLoginPage)
						 {
							 /* Redirection vers la page de login. */
							 window.location = common.getBaseUrl() + "/login";
						 }
					 }
				}],
			 open: function(event, ui) {
	    		/* Cache l'entete et le bouton ferme de la boite de dialogue par defaut de jQuery-ui. */
	    	   	jQuery(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
	    	   	jQuery(this).closest(".ui-dialog").find(".ui-dialog-titlebar:first").hide();
	    	 }
		});
		jQuery("#displayAjaxErrorDialog").dialog("open");
	}
};

/**
 * Instantiation et utilisation de la classe Common.js.
 */
var common = new Common();
jQuery(document).ready(function() {
	common.initialize();
});


/**
 * Fonction permettant d'émuler l'attribut maxlength pour les navigateurs qui ne gérent pas cette propriété (ie<10)
 * @param $
 */
(function($){
	$(document).ready(function() {
		var ta = document.createElement("textarea");
		if(ta.maxLength === undefined || true){ 
			var body = $("body");
			if(body.on !==undefined){
				$("body").on("keyup", "textarea[maxlength]", function(){
				    var elem = $(this);
					var max = parseInt(elem.attr("maxlength"));
				    var value = elem.val();
				    var len = value.replace(/\r\n/g, '~~').replace(/\n/g, '~~').length;
				    
				    if (len > max) {
						var lines = elem.val().split(/\r\n|\n/);
						value = '';
						var i = 0;
						while (value.length < max && i < lines.length) {
							value += lines[i].substring(0, max - value.length) + '\r\n';
							i++;
						}
						elem.val(value.substring(0, max));
						elem[0].scrollTop = elem[0].scrollHeight; // Scroll to bottom
					}
				});	
			}
		}
		
		/**
		 * Permet d'intercepter les pertes de session suite à un appel Ajax.
		 */
		$.ajaxSetup({global:true});
		$(document).bind("ajaxError", function(event, xhr,status,error) {
			var sessionTimeout = xhr.getResponseHeader("SessionTimeout");
			var messageValidation = "Votre session a expir\351e.";
			if (sessionTimeout == "true") {
				popupManager.alert({
					message : messageValidation,
					okFunction : function() {
						window.location = xhr.getResponseHeader("LoginPage");
					}
				});
			}
		});
	});
})(jQuery);
/**
 * Constructeur
 * 
 * @param typeHisto:
 *            type d'historique (structure, date previsionnelle ...)
 * @param idDemarche:
 *            identifiant de la demarche. NB 0 si on s'occupe de la methode
 *            eval.
 * @param idMethodeEval:
 *            identifiant de la methode d'evaluation. NB 0 si on s'occupe de la
 *            demarche
 */
function CompHistoAjaxManager(href) {
	this.href = href;
	this.basePseudoURL = this.extraireBaseURLFormHref(href)
	this.params = this.extraireParamsFormHref(href);

	this.typeHisto = this.params['typeHisto'];
	this.idMethodeEval = this.params['idMethodeEval'] == null ? 0
			: this.params['idMethodeEval'];
	this.idDemarche = this.params['idDemarche'] == null ? 0
			: this.params['idDemarche'];
	this.idStructure = this.params['idStructure'] == null ? 0
			: this.params['idStructure'];
	this.url = common.getBaseUrl()
			+ "/demarche/detaildemarche/historique/HistoAjax";
}

/**
 * Prototypage, creation des methodes.
 */
CompHistoAjaxManager.prototype = {

	/**
	 * Id de la popup. NB Le retournee doit etre de la concatenation
	 * typeHistorique idDemarche idMethodeEval idStructure
	 * 
	 * @return le nom de la popup permettant de gerer l'historique de la date
	 *         previsionnelle.
	 */
	genererSuffixID : function() {
		suffix = "";
		suffix = suffix
				+ ((this.typeHisto != null && this.typeHisto != undefined) ? this.typeHisto
						: "0") + "_";
		suffix = suffix
				+ ((this.idDemarche != null && this.idDemarche != undefined) ? this.idDemarche
						: "0") + "_";
		suffix = suffix
				+ ((this.idMethodeEval != null && this.idMethodeEval != undefined) ? this.idMethodeEval
						: "0") + "_";
		suffix = suffix
				+ ((this.idStructure != null && this.idStructure != undefined) ? this.idStructure
						: "0");
		return suffix;
	},

	/**
	 * Attache les actions javascript sur les boutons de tri des colonnes de la
	 * popin.
	 * 
	 * @param suffixID:
	 *            suffix des identifiants de la popin.
	 */
	attacherActionTriColonne : function(self) {
		jQuery("#colonneUtilisateur_" + self.suffixID).live(
				'click',
				function(event) {
					self.trierColonne(event, self, jQuery(
							"#colonneUtilisateur_" + self.suffixID)
							.attr("href"))
				});
		jQuery("#colonneDateCreation_" + self.suffixID).live(
				'click',
				function(event) {
					self.trierColonne(event, self, jQuery(
							"#colonneDateCreation_" + self.suffixID).attr(
							"href"))
				});
		jQuery("#colonneLibelle_" + self.suffixID).live(
				'click',
				function(event) {
					self.trierColonne(event, self, jQuery(
							"#colonneLibelle_" + self.suffixID).attr("href"))
				});
		jQuery("#colonneCommentaire_" + self.suffixID).live(
				'click',
				function(event) {
					self.trierColonne(event, self, jQuery(
							"#colonneCommentaire_" + self.suffixID)
							.attr("href"))
				});
		jQuery("#colonneAncienneValeur_" + self.suffixID).live(
				'click',
				function(event) {
					self.trierColonne(event, self, jQuery(
							"#colonneAncienneValeur_" + self.suffixID).attr(
							"href"))
				});
		jQuery("#colonneNouvelleValeur_" + self.suffixID).live(
				'click',
				function(event) {
					self.trierColonne(event, self, jQuery(
							"#colonneNouvelleValeur_" + self.suffixID).attr(
							"href"))
				});
	},

	/**
	 * Parse le href passe en paramettre pour contruire une table associative
	 * contenant les nom de param et valeur.
	 * 
	 * Le href doit etre de la forme urlBase?nomParam1=valeur1&nomParam2=valeur2
	 * ....
	 * 
	 * Le href en question est stocke dans l'attribut HREF des liens se touvant
	 * sur les titre des colonnes du tableau de la page historiqueAjax OU les
	 * info du liens permettant d'afficher l'historique.
	 * 
	 * @param: href dont dans laquelle on va extraire les paramettres et valeur.
	 * 
	 * @return une map dont la key= nom du parametre et value= valeur du
	 *         parametre.
	 */
	extraireParamsFormHref : function(href) {
		splitHref = href.split('?');
		var urlBase = ((splitHref.length >= 0) ? splitHref[0] : null);
		var paramsUrl = ((splitHref.length >= 1) ? splitHref[1] : null);

		splitParamTri = paramsUrl.split('&');
		var params = {};
		for (i = 0; i < splitParamTri.length; i++) {
			coupleParamValeur = (splitParamTri[i]).split('=');
			var champ = ((coupleParamValeur.length >= 0) ? coupleParamValeur[0]
					: null);
			var valeur = ((coupleParamValeur.length >= 1) ? coupleParamValeur[1]
					: null);
			params[champ] = valeur;
		}
		return params;
	},
	
	/**
	 * Extrait la base de la peuso URL celle qui se trouve avant le '?'
	 */
	extraireBaseURLFormHref : function(href){
		splitHref = href.split('?');
		var urlBase = ((splitHref.length >= 0) ? splitHref[0] : null);
		return urlBase;
	},
	
	/**
	 * Recherche ou cre la popup d'historirque si elle n'existe pas.
	 * @param event: action declanchant.
	 */
	findOrCreatePopupHisto : function(event) {
	    var popupHisto = jQuery("#wrapper_showHisto");
	    if (popupHisto == null || popupHisto.length === 0) {
	    		popupHisto = jQuery("<div id='wrapper_showHisto' style='display:none;' />").appendTo("body");	 
	    }
	    
	    return popupHisto;
	},
	   

	/**
	 * Fonction a appeller lors duc click sur le bouton de consultation de
	 * l'historique.
	 * @param event: action declanchant.
	 */
	showHisto : function(event) {
		var self = this;

		var popUpHisto = self.findOrCreatePopupHisto(event);
		
		urlRequete = self.url + ":ajaxGetHisto?ajax=true";
		jQuery.post(
				urlRequete,
				{
					'dataLineObject' : JSON.stringify(this.params)
				},
				function(data) {
					
					if(self.params['action'] == 'tri' ){
						popUpHisto.children().remove();
					}

					popUpHisto.append(data.content);
					jQuery("img[name=fermerPopIn]").live('click', function(event) {
						event.stopPropagation();
						event.preventDefault();
						//popUpHisto.hide();
						jQuery("#wrapper_showHisto").remove();
					});
					popUpHisto.show();
				}).fail(function(jqXHR, textStatus, errorThrown) {
			defaultAjaxErrorHandler(jqXHR);
		});
	}
}

/**
 * Initialisation du composant JS a chaque changement du DOM de la page sur les
 * bouton d'affichage d'historique. Ces derniers sont des liens dont l'attribut
 * HREF doit commencer par 'showHisto?'
 */
jQuery("a[href^='showHisto?']").live('click', function(event) {
	event.stopPropagation();
	event.preventDefault();
	href = jQuery(this).attr("href");
	var manager = new CompHistoAjaxManager(href);
	manager.showHisto(event);
});

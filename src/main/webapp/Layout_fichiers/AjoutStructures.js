/**
 *  AjoutStructures.js
 *  Fichier javascript de la page AjoutStructures.tml.
 */

/**
 * Constructeur
 */
function AjoutStructures() {
}

/**
 * Methodes de l'objet AjoutStructures.
 */
AjoutStructures.prototype = {

		/**
		 * Appel ajax du filtre de rechercher + rendu tableau structure.
		 */
		afficherStructure : function() {
			var self = this;
			var dataObject = new Object();
			if (jQuery("select[name='listeEnActivite']").val() == "oui") {
				dataObject.isEnActivite = true;
			} else {
				dataObject.isEnActivite = false;
			}

			dataObject.raisonSociale = jQuery("input[name='raisonSociale']").val();
			dataObject.nomVille = jQuery("input[name='ville']").val();
			dataObject.nomDepartement = jQuery("input[name='departement']").val();
			dataObject.numeroFiness = jQuery("input[name='numeroFiness']").val();
			dataObject.idTypeStructure = jQuery(
			"select[name='listeTypeStructure'] option:selected").val();
			if (jQuery("input[name='checkbox']").attr('checked') == "checked") {
				dataObject.isStructureRattache = true;
			} else {
				dataObject.isStructureRattache = false;
			}
			
			/* Affichage de l'attente */
			jQuery("#listeStructures").hide();
			jQuery("#attenteRecherche").html('<table><tr><td colspan="10"><img src="../../static/images/foldable_ajax_loader.gif" title="Recherche en cours" alt="Recherche en cours" /></td></tr></table>');
			jQuery("#attenteRecherche").show();
			
			jQuery.post( common.getBaseUrl()	+ "/demarche/detaildemarche/ajoutstructures:ajaxRechercherFromFiltre?ajax=true",
					{
						'dataObject' : JSON.stringify(dataObject)
					}, function(data) {

						jQuery("#listeStructures").hide();
						// Efface l'attente
						jQuery("#attenteRecherche").html("");
						jQuery("#attenteRecherche").hide();

						self.renderTableauStructure(data, self);

					}).fail(function(jqXHR) {
						defaultAjaxErrorHandler(jqXHR, {div : "popUpRechercheStructure", type :"error"});
					});
		},

		/**
		 * Reset les différents champ du filtre de recherche
		 */
		clearFiltreDeRecherche : function() {
			jQuery("input[name='raisonSociale']").val("");
			jQuery("input[name='ville']").val("");
			jQuery("input[name='departement']").val("");
			jQuery("input[name='numeroFiness']").val("");
			jQuery("select[name='listeEnActivite']").val(
			jQuery("select[name='listeEnActivite'] option:first").val());
			jQuery("select[name='listeTypeStructure']").val(
			jQuery("select[name='listeTypeStructure'] option:first").val());
			jQuery("input[name='checkbox']").attr('checked', false);
		},

		/**
		 * Gestion du click sur le bouton rechercher
		 * 
		 */
		clickBtRechercher : function(event) {
			if (this.controleAuMoinsUnCritere()){
				this.afficherStructure();	
			}else{
					var htmlMsgElements = '<span style="color:red;">';
					htmlMsgElements += '<b>Veuillez saisir au moins un crit&egrave;re pour votre recherche.</b>';
					htmlMsgElements += '</span>';
					jQuery("#msgElements").html(htmlMsgElements);
			}
		},
		
		/**
		 * Controle qu'on a au moins spécifié un critère
		 */
		controleAuMoinsUnCritere : function() {
			retour = false;
			if (jQuery("input[name='raisonSociale']").val() != ""){
				retour = true;
			}
			if (jQuery("input[name='ville']").val() != ""){
				retour = true;
			}
			if (jQuery("input[name='departement']").val() != ""){
				retour = true;	
			}
			if (jQuery("input[name='numeroFiness']").val() != ""){
				retour = true;
			}
			return retour;
		},
		

		/**
		 * Gestion du click sur le bouton effacer
		 * 
		 */
		clickBtEffacer : function(event) {
			this.clearFiltreDeRecherche();
		},

		/**
		 * Affiche/Cache la selection des structures rattachées suivant le type de structure selectionné.
		 * @param event
		 */
		changeListeTypeStructure : function(event) {
			// On autorise les recherches de structures rattachées que sur les
			// idTypeStructure 2 et 3 (Entité Juridique, Groupement)
			if (jQuery("select[name='listeTypeStructure']").val() == "2"
				|| jQuery("select[name='listeTypeStructure']").val() == "3") {
				jQuery("div[name='divCheckboxRattachement']").show();
				jQuery("div[name='divLibelleRattachement']").show();
			} else {
				jQuery("div[name='divCheckboxRattachement']").hide();
				jQuery("div[name='divLibelleRattachement']").hide();
				// MANTIS 0017523
				// On décoche automatiquement ...
				jQuery("input[name='checkbox']").attr('checked', false);
			}
		},

		/**
		 * Construit le tableau de structure suivant le tableau de structure json
		 * @param data
		 * @param self
		 */
		renderTableauStructure : function(data, self) {
			var nbElements = data.nbElements;
			var nbRecMaxResult = data.nbRecMaxResult;
			
			var htmlMsgElements = '<b>' + nbElements + '</b> &eacute;l&eacute;ment(s) trouv&eacute;(s)';
			if (nbElements > nbRecMaxResult){
				htmlMsgElements += ', ';
				htmlMsgElements += '<span style="color:red;">';
				htmlMsgElements += 'seuls les <b>' + nbRecMaxResult + '</b> premiers r&eacute;sultats sont affich&eacute;s. Veuillez affiner votre recherche.';
				htmlMsgElements += '</span>';
			}
			jQuery("#msgElements").html(htmlMsgElements);
			
			jQuery("tableResultats tbody").html("");

			var htmlOutput = "";
			var listeStructure = data.listeStructure;
			for ( var k = 0; k < listeStructure.length; k++) {
				htmlOutput += '<tr>';

				var structure = listeStructure[k];
				var filles = structure.filles;
				var hasFilles = (filles.length > 0);
				
				htmlOutput += '<td style="vertical-align:top;font-weight:bold;"><span>' + self.constructChaine(structure) + '</span></td>';
				if (hasFilles) {
					htmlOutput += '<td style="vertical-align:top;"></td>';
				} else {
					htmlOutput += '<td style="vertical-align:top;text-align:center;"><input id="structure_'
						+ structure.idStructure
						+ '" type="checkbox" name="'
						+ structure.idStructure + '"></input></td>';
				}

				htmlOutput += '</tr>';

				for ( var i = 0; i < filles.length; i++) {
					htmlOutput += '<tr>';
					htmlOutput += '<td style="vertical-align:top;margin-left:30px;"><span>'
						+ "&emsp;" + self.constructChaine(filles[i]) + '</span></td>';
					htmlOutput += '<td style="vertical-align:top;margin-left:30px;"><input id="structure_'
						+ filles[i].idStructure
						+ '" type="checkbox" name="'
						+ filles[i].idStructure + '"></input></td>';
					htmlOutput += '</tr>';

					var filles_filles = filles[i].filles;
					for ( var j = 0; j < filles_filles.length; j++) {
						htmlOutput += '<tr>';
						htmlOutput += '<td style="vertical-align:top;margin-left:60px;"><span>'
							+ "&emsp;&emsp;" + self.constructChaine(filles_filles[j])
							+ '</span></td>';
						htmlOutput += '<td style="vertical-align:top;margin-left:60px;"><input id="structure_'
							+ filles_filles[j].idStructure
							+ '" type="checkbox" name="'
							+ filles_filles[j].idStructure
							+ '"></input></td>';
						htmlOutput += '</tr>';
						
						var filles_filles_filles = filles[i].filles[j].filles;
						for ( var l = 0; l < filles_filles_filles.length; l++) {
							htmlOutput += '<tr>';
							htmlOutput += '<td style="vertical-align:top;margin-left:90px;"><span>'
								+ "&emsp;&emsp;&emsp;" + self.constructChaine(filles_filles_filles[l])
								+ '</span></td>';
							htmlOutput += '<td style="vertical-align:top;margin-left:90px;"><input id="structure_'
								+ filles_filles_filles[l].idStructure
								+ '" type="checkbox" name="'
								+ filles_filles_filles[l].idStructure
								+ '"></input></td>';
							htmlOutput += '</tr>';
						}
						
					}
				}
			}
			
			jQuery("#tableResultats tbody").html(htmlOutput);
			
			var grid = jQuery("#listeStructures").grid({
				howtoCompare: function(el){
					var result = "";
					if (jQuery("span[title]", el).length !== 0) {
						result = jQuery("span[title]", el).attr("title");
					}
					if(jQuery("span[original-title]", el).length !== 0) {
						result = jQuery("span[original-title]", el).attr("original-title");
					}
					if(result === ""){
						result = el.text();	
					}
					return result;
				},
				howtoRead: function(el){
					return jQuery("span", el);
				},
				messages: {
					foot: " \351l\351ment(s) affich\351(s) sur ",
					previous: "\253 Page pr\351c\351dente",
					next: "Page suivante \273",
					empty: ""
				}
			});
			
			jQuery("#listeStructures").show();
			jQuery("#pagerTableauResultatsBottom").show();
			self.renderHandler();
			
			
		},

		/**
		 * Construit la chaîne de caractères souhaités 
		 * [NUM_FINESS] - [TYPE_STR] - ([CLASSIFICATION]) - [RAISON_SOCIALE] - [VILLE] ([CODE_POSTAL])
		 * @param structure
		 * @returns
		 */
		constructChaine : function(structure) {
			var BLANK = ' - ';
			var LPAR = ' (';
			var RPAR = ') ';
			var chaine = (structure.numeroFiness);
			chaine += (BLANK);
			chaine += (structure.typeStructure);
			if (structure.classification != "" ){
				chaine += (LPAR);
				chaine += (structure.classification);
				chaine += (RPAR);	
			}else{
				chaine += (BLANK);
			}
			chaine += (structure.raisonSociale);
			chaine += (BLANK);
			chaine += (structure.nomVille);
			chaine += (LPAR);
			chaine += (structure.codePostal);
			chaine += (RPAR);
			return chaine;
		},
		
		renderHandler : function(){
			var longueurMax = 150;
			var ctx = jQuery("#tableResultats");

			var rows = jQuery("tbody tr td span", ctx);
			jQuery(rows).each(function() {
				
				// On attache l'infobulle a la cellule. si la chaine possède au moins n caractères
				if(jQuery(this).html().length > longueurMax) {

					// Ajoute l'attribut original-title au ligne trop grande
					jQuery(this).attr('original-title', jQuery(this).html());
					
					// On tronque tout d'abord les n premiers caractères
					jQuery(this).html(jQuery(this).html().substr(0, longueurMax) + "...");
				
    				// On attache l'infobulle a la cellule.
					jQuery(this).tipsy({title:'original-title',
    					             	html:true,
    					             	gravity: jQuery.fn.tipsy.autoNS});
				}				
			});
		}

};

/**
 * Instantiation et utilisation de la classe.
 */
var ajoutStructures = new AjoutStructures();

jQuery(document).ready(function() {
	/**
	 * Ici on n'attend pas que le document soit ready, il l'est déjà.
	 */
	jQuery('#btEffacer').click(function(e) {
		e.stopPropagation();
		e.preventDefault();
		ajoutStructures.clickBtEffacer(e);
	});

	jQuery('#btRechercher').click(function(e) {
		e.stopPropagation();
		e.preventDefault();
		ajoutStructures.clickBtRechercher(e);
	});

	jQuery("select[name='listeTypeStructure']").change(function(e) {
		e.stopPropagation();
		e.preventDefault();
		ajoutStructures.changeListeTypeStructure(e);
	});

	jQuery(".filtrepanel").accordion({
		header: ".filtrepanelheader",
		collapsible: true,
		heightStyle: "content",
		icons: false
	});

	jQuery("#pagerTableauResultatsBottom").hide();
});
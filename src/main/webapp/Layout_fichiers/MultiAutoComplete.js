/**
 * Constructeur de l'objet. Permet d'initialiser des attributs/constantes.
 */
function CompMultiAutoComplete(id, options, initValue, removable, url, isIntervenantExpert) {
	this.inputField = jQuery("#" + id + " > input");
	this.resultZone = jQuery("#" + id + "_table");
	this.options = options;
	this.initValue = initValue;
	this.removable = removable;
	if (url) {
		this.url = common.getBaseUrl()  + url;
	}
	this.isIntervenantExpert = isIntervenantExpert;
}

CompMultiAutoComplete.prototype = {

	/**
	 * Renvoie l'url à utiliser dans les fonctions ajax.
	 * 
	 * @param eventName
	 *            le nom de l'event
	 * @param params
	 *            les paramères
	 * @returns url absolue
	 */
	getEventURL : function(eventName, asRoot) {
		// var url = this.inputField.autocomplete("option", "source");
		
		var replacement = ":" + eventName;
		
		req = this.url.replace(":autocomplete", replacement);
		return req;
	},

	/**
	 * Initialise le composants
	 */
	initialize : function() {
		var self = this;
		this.inputField.data('MultiAutoComplete', this);
		this.inputField.autocomplete(this.options);
		var disabled = this.inputField.autocomplete("option", "disabled");
		if (disabled == true) {
			this.inputField.attr("disabled", "disabled");
		}
		if (!this.url) {
			this.url = this.inputField.autocomplete("option", "source");
		}
		this.inputField.autocomplete("option", "source", function(request,
				response) {
			jQuery
					.ajax({
						url : self.url,
						dataType : "json",
						type : "POST",
						data : {
							term : request.term,
							ajax : true
						},
						success : function(data, textStatus, jqXHR) {
							self.triggerError(data, jqXHR, function(data) {
								response(jQuery.map(data, function(item) {
									return {
										label : item,
										value : item
									};
								}));
							}, function(data) {
								response([]);
							});
						},
						error : function(jqXHR) {
							var msg = decodeURI(jqXHR
									.getResponseHeader("ErrorMessage"));
							jQuery(self.inputField).trigger("error", msg);
							response([]);
						}
					});
		});

		/* Si on quitte le champ sans selectionner d'item, on vide la saisie */
		this.inputField.on("autocompletechange", function(event, ui) {
			if (ui.item == null) {
				jQuery(this).val('');
				jQuery(this).autocomplete('search');
			}
		});

		/*
		 * Selection d'un élément : requete au serveur puis rafraichissement de
		 * la zone résultat avec la réponse
		 */
		this.inputField.on("autocompleteselect", self.selectItem);
		this.renderResultZone(this.initValue);
	},
	
	selectItem : function(event, ui) {
		var selected = ui.item;
		self =  jQuery(this).data('MultiAutoComplete');
		jQuery
				.ajax({
					type : "POST",
					url : self.getEventURL("select"),
					data : {
						ajax : true,
						value : selected.value,
						label : selected.label
					},
					success : function(data, textStatus, jqXHR) {
						/* Le serveur renvoie la nouvelle liste d'éléments */
						self.triggerError(data, jqXHR, function(data) {
							self.renderResultZone(data);
							jQuery(self.inputField).trigger("add",
									selected.value);
						});
					},
					error : function(jqXHR) {
						var msg = decodeURI(jqXHR
								.getResponseHeader("ErrorMessage"));
						jQuery(self.inputField).trigger("error", msg);
					}
				});
		// RAZ du champ
		jQuery(this).val('');
		event.preventDefault();
	},

	/**
	 * Vérifie si une erreur métier a été levée coté serveur, et le cas échéant
	 * déclenche un évènement error.
	 * 
	 * @param data
	 */
	triggerError : function(data, jqXHR, onSuccess, onError) {

		if (jqXHR.getResponseHeader("ErrorMessage")) {
			var msg = decodeURI(jqXHR.getResponseHeader("ErrorMessage"));
			jQuery(this.inputField).trigger("warning", msg);
			if (onError)
				onError(data);
		} else {
			if (onSuccess)
				onSuccess(data);
		}
	},

	/**
	 * Vide la zone résultat et affiche les nouveaux items
	 * 
	 * @param items
	 *            liste d'éléments à afficher
	 */
	renderResultZone : function(items) {
		var self = this;
		this.resultZone.find("tr:gt(0)").remove();
		if (items){
			jQuery.each(items, function(i, item) {
				var arrayStr = item.split(";");
				var htmlItem = self.renderItem(arrayStr[0], arrayStr[1], arrayStr[2]);
				self.resultZone.find('tr:last').after(htmlItem);
			});
		}
	},

	/**
	 * Affiche un élément dans la zone résultat
	 * 
	 * Lorsque le composant CompMultiAutoComplete est utilisé dans le contexte 
	 * des experts-visiteur d'une méthode d'évaluation, on récupère la liste des
	 * intervenants non visibles de la table AssoDemarcheIntervenantNonVisible.
	 * 
	 * Une fois cette étape réalisée, on appelle la méthode getIdTypeDecision()
	 * S'il n'y a pas de récusation, le type de décision idTypeDecision sera égal
	 * à 0 et on affiche la ligne sans surlignage, ni actions de récusation.
	 * 
	 * Sinon, on affiche le surlignage rouge, ainsi que les actions de récusation.
	 * 
	 * @param item
	 * 		élément à afficher
	 * 
	 * @param idAssoDemarcheIntervenantNonVisible
	 * 		Identifiant de la table AssoDemarcheIntervenantNonVisible
	 * 
	 * @returns le code HTML de l'élément
	 */
	renderItem : function(item, idAsso, isVisible) {
		var line = jQuery('<tr></tr>');
		var idTypeDecision = 0;
		var commentaires = "";
		var justificatifRecusation = "";
		
		if (this.isIntervenantExpert && null != idAsso && null != isVisible) {
			result = getIdTypeDecision(idAsso, 3);
			idTypeDecision = result.idTypeDecision;
			commentaires = result.commentaires;
			if (null != result.justificatifRecusation) {
				justificatifRecusation = result.justificatifRecusation;
			}
		}
		
		var accepteOnClick = ' onclick="acceptRecusationEv(' + idAsso + ', true)"';
		var refuseOnClick = ' onclick="acceptRecusationEv(' + idAsso + ', false)"';
		
		var imgAccepteRecusation = '<img id="accepte_' + idAsso + '" title="Accepter la r&eacute;cusation" src="' + SARAImgRootPath + '/disable_conserver_activite.png" style="display:inline-block;"' + accepteOnClick + '/>';
		var imgRefuseRecusation = '<img id="refuse_' + idAsso + '" title="Refuser la r&eacute;cusation" src="' + SARAImgRootPath + '/disable_supprimer_activite.png" style="display:inline-block;"' + refuseOnClick + '/>';
		var backgroundColor = ' class="recusationTraitee"';
		var divTextArea = '';
		
		if (idTypeDecision != 0) {
			
			switch (idTypeDecision) {
			case 8:
				imgAccepteRecusation = '<img id="accepte_' + idAsso + '" title="Accepter la r&eacute;cusation" src="' + SARAImgRootPath + '/tick.png" style="display:inline-block;"' + accepteOnClick + '/>';
				imgRefuseRecusation = '<img id="refuse_' + idAsso + '" title="Refuser la r&eacute;cusation" src="' + SARAImgRootPath + '/disable_supprimer_activite.png" style="display:inline-block;"' + refuseOnClick + '/>';
				backgroundColor = '';
				divTextArea = '';
				break;
			case 9:
				imgAccepteRecusation = '<img id="accepte_' + idAsso + '" title="Accepter la r&eacute;cusation" src="' + SARAImgRootPath + '/disable_conserver_activite.png" style="display:inline-block;"' + accepteOnClick + '/>';
				imgRefuseRecusation = '<img id="refuse_' + idAsso + '" title="Refuser la r&eacute;cusation" src="' + SARAImgRootPath + '/picto_cross.png" style="display:inline-block;"' + refuseOnClick + '/>';
				backgroundColor = '';
				divTextArea = '<div id="justificatif_' + idAsso + '" style="float:left; width:100%;"><textarea style="width:100%; height:50px; resize:none;" placeholder="Veuillez saisir un justificatif" onchange="saveJustificatifRecusation(' + idAsso + ');">' + justificatifRecusation + '</textarea></div>';
				break;
			case 10:
				imgAccepteRecusation = '<img id="accepte_' + idAsso + '" title="Accepter la r&eacute;cusation" src="' + SARAImgRootPath + '/disable_conserver_activite.png" style="display:inline-block;"' + accepteOnClick + '/>';
				imgRefuseRecusation = '<img id="refuse_' + idAsso + '" title="Refuser la r&eacute;cusation" src="' + SARAImgRootPath + '/picto_cross.png" style="display:inline-block;"' + refuseOnClick + '/>';
				backgroundColor = '';
				divTextArea = '<div id="justificatif_' + idAsso + '" style="float:left; width:100%;"><textarea style="width:100%; height:50px; resize:none;" placeholder="Veuillez saisir un justificatif" onchange="saveJustificatifRecusation(' + idAsso + ');">' + justificatifRecusation + '</textarea></div>';
				break;
			}
			
			var recusationLink = jQuery(
					'<td id="' + idAsso + '" ' + backgroundColor + '>' +
					'<div style="float:left;">' + item + '</div>' +
					'<div style="float:right;">' +
					imgAccepteRecusation +
					imgRefuseRecusation +
					'<img id="commentaires_' + idAsso + '" title="' + commentaires + '" src="' + SARAImgRootPath + '/commentaires.png" style="display:inline-block;"/>' +
					'</div>' +
					divTextArea +
					'</td>'
			);
			line.append(recusationLink);
			
		} else {
			line.append('<td>' + item + '</td>');
			if (this.removable) {
				var id = "idAssoDemarcheIntervenant";
				if (null != isVisible) {
					id += isVisible;
				}
				var self = this;
				var removeLink = jQuery('<img id="' + id + '_' + idAsso + '" src="' + SARAImgRootPath
						+ '/picto_suppr.gif" alt="Lien de supression" style="cursor:pointer;" />');
			var waitLink = jQuery('<img src="' + SARAImgRootPath + '/autocomplete_waiting.gif" alt="Suppression en cours" style="display:none"/>');
				removeLink.click(function() {
				jQuery(this).parent().find('img').toggle();
					jQuery.ajax({
						url : self.getEventURL("remove", new Array('idAssoDemarcheIntervenant' + isVisible, idAsso)),
					type : "POST",
						data : {
						ajax : true,
						type : 'idAssoDemarcheIntervenant' + isVisible,
						idAsso : idAsso
						},
						success : function(data, textStatus, jqXHR) {
							self.triggerError(data, jqXHR, function(data) {
								self.renderResultZone(data);
								jQuery(self.inputField).trigger("detach", item);
							});
						},
						error : function(jqXHR) {
							var msg = decodeURI(jqXHR
									.getResponseHeader("ErrorMessage"));
							jQuery(self.inputField).trigger("error", msg);
						}
					});
				});
			line.append(jQuery('<td></td>').append(removeLink).append(waitLink));
			}
		}
		return line;
	}
};

/**
 * Méthode permettant :
 * 		- De supprimer le surlignage rouge pour un élément.
 * 		- D'afficher la décision de récusation
 * 			- Si on accepte la récusation, on affiche le 'tick' de couleur et on grise la croix.
 * 			- Si on refuse la récusation, on affiche la croix de couleur et on grise le 'tick'.
 * 			  On affiche également une zone de texte permettant d'enregistrer le motif du refus
 * 			  de la récusation.  
 * 
 * @param idAsso
 * 		L'identifiant de la table idAsso
 * @param accept
 * 		Flag permettant de savoir sur quelle action l'utilisateur a cliqué (acceptation ou refus)
 */
function acceptRecusationEv(idAsso, accept) {
	if (accept) {
		jQuery.ajax({
			url: common.getBaseUrl() + "/demarche/detailDemarche/MethodeEvaluation:acceptRecusation/"+idAsso+"/"+accept,
			success : function(data) {
				jQuery("#" + idAsso).removeClass('recusationTraitee');

				if (jQuery('td.recusationTraitee').length == 0) {
					var idMethodeEval = jQuery('td#' + idAsso).parents("div[id^=methodeEval_]").attr('id').split('_')[1];
					jQuery("#rendreVisibleModifsEXPERTS_D_" + idMethodeEval).hide();
					jQuery("#rendreVisibleModifsEXPERTS_" + idMethodeEval).show();
				}
				
				jQuery('#accepte_' + idAsso).attr('src', SARAImgRootPath + '/tick.png');
				jQuery('#refuse_' + idAsso).attr('src', SARAImgRootPath + '/disable_supprimer_activite.png');
				var divTextArea = jQuery('#justificatif_' + idAsso);
				if (divTextArea.length > 0) {
					divTextArea.remove();
				}
				
				commentaires = data.commentaires;
				jQuery('#commentaires_' + idAsso).replaceWith('<img id="commentaires_' + idAsso + '" title="' + commentaires + '" src="' + SARAImgRootPath + '/commentaires.png" style="display:inline-block;"/>');
				jQuery('#commentaires_' + idAsso).tipsy({html: true});
			}
		});
	} else {
		jQuery.ajax({
			url: common.getBaseUrl() + "/demarche/detailDemarche/MethodeEvaluation:acceptRecusation/"+idAsso+"/"+accept,
			success : function(data) {
				jQuery("#" + idAsso).removeClass('recusationTraitee');
				
				if (jQuery('td.recusationTraitee').length == 0) {
					var idMethodeEval = jQuery('td#' + idAsso).parents("div[id^=methodeEval_]").attr('id').split('_')[1];
					jQuery("#rendreVisibleModifsEXPERTS_D_" + idMethodeEval).hide();
					jQuery("#rendreVisibleModifsEXPERTS_" + idMethodeEval).show();
				}
				
				jQuery('#refuse_' + idAsso).attr('src', SARAImgRootPath + '/picto_cross.png');
				jQuery('#accepte_' + idAsso).attr('src', SARAImgRootPath + '/disable_conserver_activite.png');
				var divTextArea = jQuery('#justificatif_' + idAsso);
				if (divTextArea.length == 0) {
					divTextArea = jQuery('<div id="justificatif_' + idAsso + '" style="float:left; width:100%;"><textarea style="width:100%; height:50px; resize:none;" placeholder="Veuillez saisir un justificatif" onchange="saveJustificatifRecusation(' + idAsso + ');"/></div>');
					jQuery("#" + idAsso).append(divTextArea);
				}
				
				commentaires = data.commentaires;
				jQuery('#commentaires_' + idAsso).replaceWith('<img id="commentaires_' + idAsso + '" title="' + commentaires + '" src="' + SARAImgRootPath + '/commentaires.png" style="display:inline-block;"/>');
				jQuery('#commentaires_' + idAsso).tipsy({html: true});
			}
		});
	}
}

/**
 * Méthode permettant de savoir si un expert-visiteur a été récusé.
 * Si oui, l'identifiant idTypeDecision est différent de 0.
 * Si non, l'identifiant idTypeDecision est égal à 0.
 * 
 * @param idAsso
 * 		L'identifiant de la table idAsso
 * @param idCategorieProfil
 * 		L'identifiant de la table CategorieProfil
 * @returns result
 * 		Un tableau contenant les retours de l'appel AJAX (identifiant du type de la décision, 
 * 		les commentaires et le justificatif de la récusation (motif)
 */
function getIdTypeDecision(idAsso, idCategorieProfil) {
	var idTypeDecision = 0;
	var justificatifRecusation = "";
	var commentaires = "";
	jQuery.ajax({
		url: common.getBaseUrl() + "/demarche/detailDemarche/MethodeEvaluation:getIdTypeDecision/"+idAsso+"/"+idCategorieProfil,
		async: false,
		success : function(data) {
			idTypeDecision = data.idTypeDecision;
			justificatifRecusation = data.justificatifRecusation;
			commentaires = data.commentaires;
		}
	});
	var result = {
			idTypeDecision : idTypeDecision,
			commentaires : commentaires,
			justificatifRecusation : justificatifRecusation
	};
	return result;
}

function saveJustificatifRecusation(idAsso) {
	var text = jQuery('#justificatif_' + idAsso + " > textarea").val();
	var data = {
			'justificatifRecusation' : text
	};
	jQuery.post(
			common.getBaseUrl() + "/demarche/detailDemarche/MethodeEvaluation:saveJustificatifRecusation/" + idAsso + "?ajax=true",
			{'dataObject' : JSON.stringify(data)},
			function(data) {
				commentaires = data.commentaires;
				jQuery('#commentaires_' + idAsso).replaceWith('<img id="commentaires_' + idAsso + '" title="' + commentaires + '" src="' + SARAImgRootPath + '/commentaires.png" style="display:inline-block;"/>');
				jQuery('#commentaires_' + idAsso).tipsy({html: true});
			}
	);
}

(function($){
    var addTooltip = function() {
        $('img[id^="commentaires_"]').tipsy({html: true});
	};
     var initialization = function() {
		$("div#methodesEvals").on("hover", addTooltip); 
	};
	$(document).ready(initialization);
})(jQuery);
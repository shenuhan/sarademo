/**
 *  EditDem.js
 *  Fichier javascript de la page EditDem.tml.
 */

/**
 * Manager gérant les fonctionnalités sur la page EditDem.
 */
var EditDemManager = (function($) {
	var messageErreurSuppressionModuleRapportVisite = null;
	return {
		
		/**
		 * Permet de récupérer le message d'erreur à afficher lors de la tentative de suppression d'un module "Rapport de visite" en version definitive.
		 * 
		 * @return le message.
		 */
		getMessageErreurSuppressionModuleRapportVisite : function() {
			return messageErreurSuppressionModuleRapportVisite;
		},
		
		/**
		 * Permet de définir le message d'erreur à afficher lors de la tentative de suppression d'un module "Rapport de visite" en version definitive.
		 * 
		 * @param {String} message : le message.
		 */
		setMessageErreurSuppressionModuleRapportVisite : function(message) {
			messageErreurSuppressionModuleRapportVisite = message;
		}
	}
})(jQuery);

/**
 * Constructeur
 */
function EditDem() {
	
}

/**
 * Methodes de l'objet EditDem.
 */
EditDem.prototype = {
	
	clickBtActiver : function(event) {
		jQuery.ajax({
			url : common.getBaseUrl() + "/demarche/detaildemarche/editdem:ajaxActiverDemarche?ajax=true",
			success : function(data) {
				window.location.href = common.getBaseUrl() + "/demarche/detaildemarche/editdem?activate=true";
			}
		});
	},
	
	clickBtDesactiver : function(event) {
		var self = this;
		jQuery
				.ajax({
					url : common.getBaseUrl() + "/demarche/detaildemarche/editdem:ajaxDesactiverDemarche?ajax=true",
					success : function(data) {
						jQuery("#blocMenusGD").message({
							text : data.message,
							type : "notification"
						});
						jQuery("#desactiver").remove();
						var html = jQuery(".bloc.composants").html();
						html = html
								+ "<a id=\"activer\" href=\"editdem.activer\"><img title=\"Activer la d\351marche\" src=\"../../static/images/control_play_blue.gif\" alt=\"Activer la d\351marche\"></img></a>";
						jQuery(".bloc.composants").html(html);
						
						jQuery("#activer").on("click", function(e) {
							e.stopPropagation();
							e.preventDefault();
							self.clickBtActiver(e);
						});
						
						attachClickToBoutonCommuniquer(self);
						
						handleDisplayActionsPerimetre(self, data);
						disableForm();
					}
				});
	},
	
	clickBtCommuniquer : function(event) {
		jQuery.ajax({
			url : common.getBaseUrl() + "/demarche/detaildemarche/editdem:ajaxCommuniquerDemarche?ajax=true",
			success : function(data) {
				window.location.href = common.getBaseUrl() + "/demarche/detaildemarche/editdem?communiquer=true";
			}
		});
	},
	
	/**
	 * Permet d'afficher la popup
	 */
	afficherRechercheStructure : function() {
		var self = this;
		var dialog = jQuery("#popUpRechercheStructure").dialog({
			autoOpen : false,
			width : '1024',
			modal : true,
			dialogClass : "dialogbox",
			title : 'Recherche d\'une structure dans le r\351f\351rentiel de la HAS ',
			draggable : true,
			resizable : false,
			position : [200, 200],
			buttons : [{
				name : "bt_vert",
				text : "Confirmer",
				click : function() {
					var selectionId = [];
					jQuery("input:checked[id^='structure_']").each(function(index, el) {
						var objIdStructure = {
							'idStructure' : jQuery(el).prop("name")
						};
						selectionId.push(objIdStructure);
					});
					// Construction de l'objet JSON de param�tres
					var dataLineObject = {
						'selection' : selectionId
					};
					
					jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/EditDem:ajaxAjouterStructures", {
						'dataLineObject' : JSON.stringify(dataLineObject)
					}, function(data) {
						jQuery("#popUpRechercheStructure").trigger("refreshstructures", data);
						handleDisplayActionsPerimetre(self, data);
						self.renderHandler();
						showValidationMessages();
					}).fail(function(jqXHR) {
						defaultAjaxErrorHandler(jqXHR);
					});
					jQuery(this).dialog("close");
				}
			}, {
				name : "bt_rouge",
				text : "Annuler",
				click : function() {
					jQuery(this).dialog("close");
				}
			}],
			create : function(event, ui) {
				jQuery(".dialogbox").css('z-index', '2000');
			}
		});
		jQuery(dialog).dialog("open");
		return dialog;
	},
	
	/**
	 * Gestion du click sur le bouton ajouter
	 */
	clickBtAjouterStructure : function(event) {
		var self = this;
		jQuery.ajax({
			url : jQuery("#ajoutStructures").prop("href"),
			success : function(data) {
				jQuery("#popUpRechercheStructure").html(data.content);
				var dialog = self.afficherRechercheStructure();
				dialog.ready(function() {
					eval(data.script);
				});
			}
		});
	},
	
	/**
	 * Suppression d'une m�thode d'�valuation
	 */
	supprimerMethodeEvaluation : function(data) {
		var self = data;
		
		var bouton = jQuery(data).attr("href");
		var elem = bouton.split('/');
		var idMethodeEval = elem[1];
		var dataLineObject = {};
		
		dataLineObject["idMethodeEval"] = idMethodeEval;
		// Appel ajax qui va verfier est ce que on peut supprimer ou non?
		jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluationcq:ajaxCheckSuppMethodeEvalCQ", {
			'dataLineObject' : JSON.stringify(dataLineObject)
		}, function(dataOut) {
			if (dataOut.suppressionPossible) {
				// aficher le popup et mettre la methodeEval dans la liste à supprimer
				afficherPopUpSupprimerMethodeEval(self);
			} else {
				// afficher un message d'alerte pour ne pas supprimer la méthodeEval
				if (dataOut.moduleValide) {
					affichePopUpAvecMessage(msgSuppMethodeEvalModuleValide);
				} else if (dataOut.moduleRecu) {
					affichePopUpAvecMessage(msgSuppMethodeEvalModuleRecu);
				}
			}
			
		}).fail(function(jqXHR) {
			defaultAjaxErrorHandler(jqXHR, {
				div : "popUpAjouterMethodeEvaluation",
				type : "error"
			});
		});
		
	},
	
	/**
	 * Permet d'afficher la popup
	 */
	afficherAjoutMethodeEvaluation : function() {
		var selfEditDem = this;
		var dialog = jQuery("#popUpAjouterMethodeEvaluation").dialog(
				{
					autoOpen : false,
					height : '350',
					width : '500',
					modal : true,
					dialogClass : "dialogbox",
					title : 'Ajouter une m\351thode d\'\351valuation',
					draggable : true,
					resizable : false,
					buttons : [
							{
								name : "bt_vert",
								text : "Valider",
								click : function() {
									var dataObject = new Object();
									dataObject.typeVisite = jQuery("select[name='typeVisite']").val();
									dataObject.libelle = jQuery("select[name='typeVisite']").find('option:selected').text();
									dataObject.version = jQuery("select[name='version']").val();
									dataObject.datePrevisionnelleTxt = jQuery("#AME_DatePrevisionnelle").find("input[name='datePrevisionnelleTxt']").val();
									dataObject.dateReelleDu = jQuery("#AME_DateReelle").find("input[name='sDateBegin']").val();
									dataObject.dateReelleAu = jQuery("#AME_DateReelle").find("input[name='sDateEnd']").val();
									dataObject.caracteristique = jQuery("#selectCaracMethEval").val();
									
									var isOk = selfEditDem.ajoutMethodesEvaluations.ajaxControlesSurfaces();
									if (isOk == true) {
										jQuery.post(
												common.getBaseUrl()
														+ "/demarche/detaildemarche/ajoutMethodesEvaluations:ajaxAjouterMethodeEvaluation?ajax=true",
												{
													'dataObject' : JSON.stringify(dataObject)
												},
												function(data) {
													
													// Ajout de l'ID de la nouvelle MethodEval � la div
													jQuery("#idMethodesEvals").append(
															'<div id="idMethodeEval_' + data.idMethodeEval + '" class="not_loaded">' + data.idMethodeEval
																	+ '</div>');
													
													// Chargement de la liste des MethodeEval
													ajaxChargerListeMethodeEval(selfEditDem);
													
												}).fail(function(jqXHR) {
											defaultAjaxErrorHandler(jqXHR, {
												div : "popUpAjouterMethodeEvaluation",
												type : "error"
											});
										});
										jQuery(this).dialog("close");
									}
									
								}
							}, {
								name : "bt_rouge",
								text : "Annuler",
								click : function() {
									jQuery(this).dialog("close");
								}
							}]
				});
		
		var ajoutMethodesEvaluations = new AjoutMethodesEvaluations();
		ajoutMethodesEvaluations.initialize();
		selfEditDem.ajoutMethodesEvaluations = ajoutMethodesEvaluations;
		
		jQuery(dialog).dialog('open');
		
		return dialog;
	},
	
	/**
	 * Gestion du click sur le bouton ajouter
	 */
	clickBtAjouterMethodeEvaluation : function(event) {
		var self = this;
		jQuery.ajax({
			url : jQuery("#ajoutMethodesEvaluations").prop("href"),
			success : function(data) {
				jQuery("#popUpAjouterMethodeEvaluation").html(data.content);
				var dialog = self.afficherAjoutMethodeEvaluation();
				dialog.ready(function() {
					eval(data.script);
				});
			}
		});
	},
	
	renderDeleteLinks : function(linkRef) {
		var self = this;
		var myP = jQuery("<p />").text("Confirmez-vous le retrait de la structure du p\351rim\350tre ?");
		var div = jQuery("<div />", {
			"id" : 'dialog-confirm',
			"title" : 'Attention'
		}).append(myP).appendTo("body");
		div.dialog({
			resizable : false,
			draggable : false,
			modal : true,
			dialogClass : "dialogbox",
			buttons : [{
				name : "bt_vert",
				text : "Oui",
				click : function() {
					jQuery.ajax({
						url : jQuery(linkRef).attr("href"),
						data : {
							ajax : true
						},
						success : function(data, textStatus, jqXHR) {
							jQuery(linkRef).parents("tr").remove();
							self.tabStructures.flush();
							initTableStructures(self);
							handleDisplayActionsPerimetre(self, data);
							showValidationMessages();
							self.renderHandler();
							var nbStructuresText = "P\351rim\350tre - " + jQuery("#structures tbody tr").size() + " structure(s)";
							jQuery("#nbStructures").text(nbStructuresText);
						},
						error : function(jqXHR) {
							var msg = decodeURI(jqXHR.getResponseHeader("ErrorMessage"));
							jQuery("#blocMenusGD").message({
								text : msg,
								type : "error"
							});
						}
					});
					jQuery(this).dialog("close");
					jQuery(this).remove();
				}
			}, {
				name : "bt_rouge",
				text : "Non",
				click : function() {
					jQuery(this).dialog("close");
					jQuery(this).remove();
				}
			}]
		});
	},
	
	/**
	 * Permet d'afficher la popup
	 */
	afficherEditStructure : function() {
		var self = this;
		var dialog = jQuery("#popUpEditStructure").dialog({
			autoOpen : false,
			width : '1024',
			modal : true,
			draggable : true,
			resizable : false,
			dialogClass : "dialogbox",
			title : 'Editer une structure',
			buttons : [{
				name : "bt_vert",
				text : "Confirmer",
				click : function() {
					var dataStructure = new Object();
					dataStructure.idStructure = jQuery("input[id^='idStructure']").val();
					// Suivant le type de structure
					var typeStructure = jQuery("input[id^='codeStructure']").val();
					switch (typeStructure) {
						case 'ES':
							dataStructure.raisonSociale = jQuery("input[id^='raisonSocialeES']").val();
							dataStructure.finess = jQuery("input[id^='finessES']").val();
							dataStructure.siren = jQuery("input[id^='sirenES']").val();
							dataStructure.idClassification = jQuery("select[id^='classificationES'] option:selected").val();
							dataStructure.dateCessation = jQuery("input[id^='dateCessationES']").val();
							dataStructure.motifCessation = jQuery("input[id^='motifCessationES']").val();
							dataStructure.raisonSocialeEjRatt = jQuery("input[id^='libelleEjChoisie_1']").val();
							dataStructure.idEjRattachement = jQuery("input[id^='idEjRattachement']").val();
							break;
						case 'EJ':
							dataStructure.raisonSociale = jQuery("input[id^='raisonSocialeEJ']").val();
							dataStructure.finess = jQuery("input[id^='finessEJ']").val();
							dataStructure.siren = jQuery("input[id^='sirenEJ']").val();
							dataStructure.idGroupe = jQuery("select[id^='groupeEJ'] option:selected").val();
							dataStructure.dateCessation = jQuery("input[id^='dateCessationEJ']").val();
							dataStructure.motifCessation = jQuery("input[id^='motifCessationEJ']").val();
							break;
						case 'GRP':
							dataStructure.raisonSociale = jQuery("input[id^='raisonSocialeGRP']").val();
							break;
						case 'GCS':
							dataStructure.raisonSociale = jQuery("input[id^='raisonSocialeGCS']").val();
							dataStructure.numArreteArhGCS = jQuery("input[id^='numArreteArhGCS']").val();
							dataStructure.dateArreteArhGCS = jQuery("input[id^='dateArreteArhGCS']").val();
							dataStructure.dateSignatureGCS = jQuery("input[id^='dateSignatureGCS']").val();
							dataStructure.dateOuvertureGCS = jQuery("input[id^='dateOuvertureGCS']").val();
							dataStructure.porteurAutorisationActiviteSoin = jQuery("input[id^='oui']").val();
							dataStructure.dateCessation = jQuery("input[id^='dateCessationGCS']").val();
							dataStructure.motifCessation = jQuery("input[id^='motifCessationGCS']").val();
							break;
						case 'ARH':
							dataStructure.raisonSociale = jQuery("input[id^='raisonSocialeARH']").val();
							dataStructure.idClassification = jQuery("select[id^='classificationARH'] option:selected").val();
							break;
						case 'DRASS':
							dataStructure.raisonSociale = jQuery("input[id^='raisonSocialeDRASS']").val();
							dataStructure.idClassification = jQuery("select[id^='classificationDRASS'] option:selected").val();
							break;
						case 'IACE':
							dataStructure.raisonSociale = jQuery("input[id^='raisonSocialeIACE']").val();
							dataStructure.siren = jQuery("input[id^='sirenIACE']").val();
							dataStructure.idClassification = jQuery("select[id^='classificationIACE'] option:selected").val();
							dataStructure.dateCessation = jQuery("input[id^='dateCessationIACE']").val();
							dataStructure.motifCessation = jQuery("input[id^='motifCessationIACE']").val();
							dataStructure.raisonSocialeEjRatt = jQuery("input[id^='libelleEjChoisie_2']").val();
							dataStructure.idEjRattachement = jQuery("input[id^='idEjRattachement']").val();
							
							break;
						default:
							// nothing
							break;
					}
					
					var dataCoordonnees = new Object();
					dataCoordonnees.adresseLigne1 = jQuery("input[id^='adresseLigne1']").val();
					dataCoordonnees.adresseLigne2 = jQuery("input[id^='adresseLigne2']").val();
					if (jQuery("input[id^='cedex']").val() != "" && jQuery("input[id^='cedex']").val().indexOf('Cedex') != 0) {
						dataCoordonnees.cedex = "Cedex" + " " + jQuery("input[id^='cedex']").val();
					} else {
						dataCoordonnees.cedex = jQuery("input[id^='cedex']").val();
					}
					dataCoordonnees.idPays = jQuery("select[id^='pays'] option:selected").val();
					dataCoordonnees.nomVille = jQuery("input[id^='nomVille']").val();
					dataCoordonnees.codePostal = jQuery("input[id^='codePostal']").val();
					dataCoordonnees.ligneStandard = jQuery("input[id^='ligneStandard']").val();
					dataCoordonnees.fax = jQuery("input[id^='fax']").val();
					dataCoordonnees.email = jQuery("input[id^='email']").val();
					dataCoordonnees.siteInternet = jQuery("input[id^='siteInternet']").val();
					dataStructure.coordonnees = dataCoordonnees;
					
					var isOk = informationsAdministratives.ajaxControlesSurfaces(typeStructure);
					if (isOk == true) {
						jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/informationsAdministratives:ajaxEditerStructure?ajax=true", {
							'dataStructure' : JSON.stringify(dataStructure)
						}, function(data) {
							// jQuery("#popUpEditStructure").trigger("majStructure", data);
							jQuery("#popUpEditStructure").trigger("refreshstructures", data);
							handleDisplayActionsPerimetre(self, data);
							self.renderHandler();
							showValidationMessages();
						}).fail(function(jqXHR) {
							defaultAjaxErrorHandler(jqXHR, {
								div : "popUpEditStructure",
								type : "error"
							});
						});
						jQuery(this).dialog("close");
					}
					
				}
			}, {
				name : "bt_rouge",
				text : "Annuler",
				click : function() {
					jQuery(this).dialog("close");
				}
			}]
		});
		jQuery("#popUpEditStructure").dialog("open");
		return dialog;
	},
	
	renderEditStructure : function(linkRef) {
		var self = this;
		jQuery.ajax({
			url : jQuery(linkRef).attr("href"),
			data : {
				ajax : true
			},
			success : function(data, textStatus, jqXHR) {
				jQuery("#popUpEditStructure").html(data.content);
				var dialog = self.afficherEditStructure();
				dialog.ready(function() {
					eval(data.script);
				});
				self.tabStructures.flush();
				initTableStructures(self);
				self.renderHandler();
			},
			error : function(jqXHR) {
				var msg = decodeURI(jqXHR.getResponseHeader("ErrorMessage"));
				jQuery("#blocMenusGD").message({
					text : msg,
					type : "error"
				});
			}
		});
	},
	
	renderHandler : function() {
		var ctx = jQuery(".grid", "#structures");
		jQuery("tbody tr td span:visible[title],tbody tr td span:visible[original-title]", ctx).tipsy({
			title : "original-title",
			html : true,
			gravity : jQuery.fn.tipsy.autoNS
		});
	}
};

/**
 *
 */
function afficherPopUpSupprimerMethodeEval(self) {
	var div = jQuery("<div/>", {
		id : 'dialog-confirm',
		title : 'Attention'
	})
			.appendTo(document.body)
			.html(
					"<p>ATTENTION. La suppression d'une m\351thode d'\351valuation est d\351finitive. Il ne sera pas possible de r\351cup\351rer les donn\351es une fois l'action r\351alis\351e. Voulez-vous confirmer la suppression de la m\351thode d'\351valuation ?</p>");
	div.dialog({
		resizable : false,
		draggable : false,
		modal : true,
		dialogClass : "dialogbox",
		buttons : [{
			name : "bt_vert",
			text : "Oui",
			click : function() {
				jQuery.ajax({
					url : jQuery(self).attr("href"),
					data : {
						ajax : true
					},
					success : function(data, textStatus, jqXHR) {
						// On supprime la div de la methode eval
						jQuery("#methodeEval_" + data.idMethodeEval).remove();
						jQuery("#blocMenusGD").message({
							text : data.messageSupp,
							type : "notification"
						});
						showValidationMessages();
					},
					error : function(jqXHR) {
						var msg = decodeURI(jqXHR.getResponseHeader("ErrorMessage"));
						jQuery("#blocMenusGD").message({
							text : msg,
							type : "error"
						});
					}
				});
				jQuery(this).dialog("close");
				jQuery(this).remove();
			}
		}, {
			name : "bt_rouge",
			text : "Non",
			click : function() {
				jQuery(this).dialog("close");
				jQuery(this).remove();
			}
		}]
	});
}

function affichePopUpAvecMessage(message) {
	var div = jQuery("<div/>", {
		id : 'dialog-confirm',
		title : 'Attention'
	}).appendTo(document.body).html("<p>" + message + "</p>");
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
				jQuery(this).remove();
			}
		}]
	});
	
}

function AjaxListeMethodeEval(selfEditDem, idMethodeEval) {
	this.selfEditDem = selfEditDem;
	this.idMethodeEval = idMethodeEval;
}

AjaxListeMethodeEval.prototype = {
	
	/**
	 * Permet d'afficher la popup
	 */
	doAjax : function() {
		
		var self = this;
		
		// Pr�paration des donn�es pour appel AJAX
		var inputData = {
			'idMethodeEval' : self.idMethodeEval
		};
		
		// Appel AJAX
		jQuery.ajax({
			url : common.getBaseUrl() + "/demarche/detaildemarche/editdem:ajaxGetMethodeEval?ajax=true",
			data : {
				'dataLineObject' : JSON.stringify(inputData)
			},
			error : function(jqXHR, textStatus, errorThrown) {
				jQuery("#methodesEvalsAjaxLoading").hide();
			},
			success : function(data, textStatus, jqXHR) {
				jQuery("#methodesEvalsAjaxLoading").hide();
				jQuery("#methodesEvals").append(data.content);
				
				var isVersionDefinitive = jQuery("#methodeEvalIsVersionDefinitive_" + self.idMethodeEval).val();
				// Si la methode eval est en version definitive, alors je repli l'accordeon
				if (isVersionDefinitive == "true") {
					jQuery("#methodeEval_" + self.idMethodeEval).accordion({
						active : true,
						header : ".header",
						collapsible : true,
						heightStyle : "content"
					});
				} else {
					jQuery("#methodeEval_" + self.idMethodeEval).accordion({
						header : ".header",
						collapsible : true,
						heightStyle : "content"
					});
				}
				
				jQuery(document).ready(function() {
					eval(data.script);
					
					// Initialization des composants correpondants � la m�thode �val
					new MethodeEvaluation(self.idMethodeEval).initialize();
					
					// Pour la ligne que l'on vient d'ins�rer, l'action click sur la croix rouge
					jQuery("a.suppMethodeEval").last().on("click", function(e) {
						e.stopPropagation();
						e.preventDefault();
						self.selfEditDem.supprimerMethodeEvaluation(this);
					});
					
					initTableModules(self);
					
					// /////MODULES/////////////
					jQuery("#typeModule" + self.idMethodeEval).each(function() {
						initListeTypeVersionModule(this);
						initListeBaseReference(this);
					});
					
					jQuery("#modules" + self.idMethodeEval).on("refreshaddmodules", function(e, data) {
						refreshModules(self, data, '');
					});
					jQuery("#ajoutModule" + self.idMethodeEval).on("click", function(e) {
						e.stopPropagation();
						e.preventDefault();
						ajouterModule(self, this);
					});
					
					jQuery("#CQajoutModule" + self.idMethodeEval).on("click", function(e) {
						e.stopPropagation();
						e.preventDefault();
						CQajouterModule(self, this);
					});
					
					jQuery("#modules" + self.idMethodeEval + " [id^=suppModule]").on("click", function(e) {
						e.stopPropagation();
						e.preventDefault();
						supprimerModule(self, this, '');
					});
					
					jQuery("#modules" + self.idMethodeEval + " [id^=CQsuppModule]").on("click", function(e) {
						e.stopPropagation();
						e.preventDefault();
						supprimerModuleCQ(self, this, 'CQ');
					});
					
					jQuery("#modules" + self.idMethodeEval + " [id^=diffuserModule]").on("click", function(e) {
						e.stopPropagation();
						e.preventDefault();
						demandeDiffusionModule(self, this, '');
					});
					
					jQuery("#modules" + self.idMethodeEval + " [id^=CQdiffuserModule_]").on("click", function(e) {
						e.stopPropagation();
						e.preventDefault();
						diffuserModule(self, this, 'CQ');
					});
					
					jQuery("#modules" + self.idMethodeEval + " [id^=CQinterrompreModule_]").on("click", function(e) {
						e.stopPropagation();
						e.preventDefault();
						suspendreModule(self, this, 'VR');
					});
					jQuery("#modules" + self.idMethodeEval + " [id^=CQsuspendreModule_]").on("click", function(e) {
						e.stopPropagation();
						e.preventDefault();
						suspendreModule(self, this, 'CQ');
					});
					
					// Gestion des droits pour les "Modules"
					handleRightsForModules(self.idMethodeEval);
					
					// Composant Memo
					ajaxChargerMemoMethodeEval(self.selfEditDem, self.idMethodeEval);
					
					// Suppression de la classe "not_loaded" indiquant que la m�thode �val a �t� charg�e
					jQuery("#idMethodeEval_" + self.idMethodeEval).removeClass('not_loaded');
					
					// Appel AJAX sur la m�thode �val suivante si pas encore charg�e
					ajaxChargerListeMethodeEval(self.selfEditDem);
					
				});
				
			}
		});
	}
};

function ajaxChargerMemoMethodeEval(selfEditDem, idMethodeEval) {
	var dataObject = {
		'idMethodeEval' : idMethodeEval
	};
	
	jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxChargerMemoMethodeEval?ajax=true", {
		'dataObject' : JSON.stringify(dataObject)
	}, function(resultData) {
		// Cr�ation
		if (resultData.isCreation == "true") {
			jQuery("#memoMethodeEval_" + idMethodeEval).memo({
				type : "new",
				readonly : false,
				onSave : function() {
					sauvegarderMemoMethodeEval(this, idMethodeEval);
				}
			});
		} else {
			jQuery("#memoMethodeEval_" + idMethodeEval).memo({
				readonly : false,
				onRender : function() {
					this.renderInfo(resultData.intervenant, resultData.dateModif);
					if (this.backup == undefined) {
						this.val(resultData.commentaire);
					} else {
						this.val(this.backup);
					}
				},
				onSave : function() {
					sauvegarderMemoMethodeEval(this, idMethodeEval);
				}
			});
		}
	}).fail(function(jqXHR) {
		defaultAjaxErrorHandler(jqXHR, {
			type : "error"
		});
	});
}

function sauvegarderMemoMethodeEval(data, idMethodeEval) {
	var commentaire = jQuery(".memo_txt textarea", data.conteneur).val();
	var dataObject = {
		'idMethodeEval' : idMethodeEval,
		'commentaire' : commentaire
	};
	jQuery.post(
			common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxSauvegarderMemoMethodeEval?ajax=true",
			{
				'dataObject' : JSON.stringify(dataObject)
			},
			function(resultData) {
				jQuery(".memo_info", data.conteneur).html(
						"Derni\350re modification le <span class='bold'>" + resultData.dateModif + "</span> par <span class='bold'>" + resultData.intervenant
								+ "</span>");
				jQuery("#blocMenusGD").message({
					text : conf001,
					type : "notification"
				});
			}).fail(function(jqXHR) {
		defaultAjaxErrorHandler(jqXHR, {
			type : "error"
		});
	});
	
}

function CQajouterModule(methodeEval, data) {
	
	var bouton = jQuery(data).attr("id");
	var idMethodeEval = bouton.substr(13, bouton.length);
	var page = "methodeevaluation";
	
	var typeModule = jQuery("#typeModule" + idMethodeEval).val();
	var baseReference = jQuery("#baseReference" + idMethodeEval).val();
	var versionManuel = jQuery("#versionManuel" + idMethodeEval).val();
	
	var dataObject = {
		'idMethodeEval' : idMethodeEval,
		'type' : typeModule,
		'baseReference' : baseReference,
		'versionManuel' : versionManuel
	};
	
	jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluationcq:ajaxAjouterModulecq?ajax=true", {
		'dataObject' : JSON.stringify(dataObject)
	}, function(dataObject) {
		if (dataObject.moduleEnCours == true) {
			afficheAjoutInpossible(messAjoutImpossible);
			return;
		}
		
		refreshModules(methodeEval, dataObject, 'CQ');
		jQuery("#blocMenusGD").message({
			text : dataObject.messageAjout,
			type : "notification"
		});
		showValidationMessagesMod(dataObject);
	}).fail(function(jqXHR) {
		defaultAjaxErrorHandler(jqXHR, {
			type : "error"
		});
	});
};

function afficheAjoutInpossible(message) {
	
	var div = jQuery("<div/>", {
		id : 'dialog-confirm',
		title : 'Attention'
	}).appendTo(jQuery('body')).html("<p>" + message + "</p>");
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
				jQuery(this).remove();
			}
		}]
	});
}

function ajouterModule(methodeEval, data) {
	
	var bouton = jQuery(data).attr("id");
	
	var page = "methodeevaluation";
	var idMethodeEval = bouton.substr(11, bouton.length);
	
	var typeModule = jQuery("#typeModule" + idMethodeEval).val();
	var baseReference = jQuery("#baseReference" + idMethodeEval).val();
	var versionManuel = jQuery("#versionManuel" + idMethodeEval).val();
	
	var dataObject = {
		'idMethodeEval' : idMethodeEval,
		'type' : typeModule,
		'baseReference' : baseReference,
		'versionManuel' : versionManuel
	};
	
	jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/" + page + ":ajaxAjouterModule?ajax=true", {
		'dataObject' : JSON.stringify(dataObject)
	}, function(dataObject) {
		
		if (dataObject.moduleEnCours == true) {
			
			afficheAjoutInpossible(messAjoutImpossible);
			return;
		}
		
		refreshModules(methodeEval, dataObject, '');
		jQuery("#blocMenusGD").message({
			text : dataObject.messageAjout,
			type : "notification"
		});
		showValidationMessagesMod(dataObject);
	}).fail(function(jqXHR) {
		defaultAjaxErrorHandler(jqXHR, {
			type : "error"
		});
	});
}

/**
 * Interroge le serveur avant diffusion pour savoir si un message de demande de confirmation doit etre affiche.
 * 
 * @param methodeEval
 * @param data
 * @param typeMethode
 */
function demandeDiffusionModule(methodeEval, data, typeMethode) {
	var page = 'methodeevaluation';
	var bouton = jQuery(data).attr("id");
	
	var idMethodeEval = bouton.substr(bouton.indexOf("_") + 1, bouton.lastIndexOf("_") - (bouton.indexOf("_") + 1));
	var idModule = bouton.substr(bouton.lastIndexOf("_") + 1);
	
	var dataObject = {
		'idModule' : idModule,
		'idMethodeEval' : idMethodeEval
	};
	jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/" + page + ":ajaxDemandeDiffuserModule?ajax=true", {
		'dataObject' : JSON.stringify(dataObject)
	}, function(dataObject) {
		if (dataObject.demanderConfirmation) {
			afficherConfirmationDemandeDiffusion(methodeEval, data, typeMethode, dataObject.messageDemandeConfirmation);
		} else {
			diffuserModule(methodeEval, data, typeMethode);
		}
	}).fail(function(jqXHR) {
		defaultAjaxErrorHandler(jqXHR, {
			type : "error"
		});
	});
}

function diffuserModule(methodeEval, data, typeMethode) {
	var bouton = jQuery(data).attr("id");
	
	var idMethodeEval = bouton.substr(bouton.indexOf("_") + 1, bouton.lastIndexOf("_") - (bouton.indexOf("_") + 1));
	var idModule = bouton.substr(bouton.lastIndexOf("_") + 1);
	
	jQuery("#affichageBtnDiffusion_" + idModule).empty();
	jQuery("#affichageBtnDiffusion_" + idModule).append(
			'<img src="' + SARAImgRootPath + '/report_go_grey.gif" title="Rendre visible le module" alt="Rendre visible le module" />');
	
	if (typeMethode == 'CQ') {
		page = 'methodeevaluationcq';
	} else {
		page = 'methodeevaluation';
	}
	
	var dataObject = {
		'idModule' : idModule,
		'idMethodeEval' : idMethodeEval
	};
	jQuery
			.post(
					common.getBaseUrl() + "/demarche/detaildemarche/" + page + ":ajaxDiffuserModule?ajax=true",
					{
						'dataObject' : JSON.stringify(dataObject)
					},
					function(dataObject) {
						refreshModulesImage(idModule);
						// rendre le bouton susprendre actif si le module n'est pas suspendu
						if (dataObject && !dataObject.suspendu) {
							if (page == 'methodeevaluationcq') {
								jQuery("#affichageBtnSuspension_" + idModule).empty();
								jQuery("#affichageBtnSuspension_" + idModule)
										.append(
												'<a  href="" id="CQsuspendreModule_'
														+ idMethodeEval
														+ '_'
														+ idModule
														+ '"><img src="'
														+ SARAImgRootPath
														+ '/newDesign/icone_suspendre.png" title="Suspendre le module" alt="Suspendre le module" style="padding-right: 5px;"/></a>');
								jQuery("#CQsuspendreModule_" + idMethodeEval + "_" + idModule).on("click", function(e) {
									e.stopPropagation();
									e.preventDefault();
									suspendreModule(self, this, 'CQ');
								});
							} else if (page == 'methodeevaluation' && dataObject && dataObject.rendreVisibleInterrompreModule) {
								jQuery("#affichageBtnInterromption_" + idModule).empty();
								jQuery("#affichageBtnInterromption_" + idModule)
										.append(
												'<a  href="" id="CQinterrompreModule_'
														+ idMethodeEval
														+ '_'
														+ idModule
														+ '"><img src="'
														+ SARAImgRootPath
														+ '/newDesign/icone_suspendre.png" title="Interrompre le module" alt="Interrompre le module" style="padding-right: 5px;"/></a>');
								jQuery("#CQinterrompreModule_" + idMethodeEval + "_" + idModule).on("click", function(e) {
									e.stopPropagation();
									e.preventDefault();
									suspendreModule(self, this, 'VR');
								});
							}
							
						}
						
						jQuery("#blocMenusGD").message({
							text : dataObject.messageDiffuse,
							type : "notification"
						});
					}).fail(function(jqXHR) {
				defaultAjaxErrorHandler(jqXHR, {
					type : "error"
				});
			});
}

function suspendreModule(methodeEval, data, typeMethode) {
	var bouton = jQuery(data).attr("id");
	
	var idMethodeEval = bouton.substr(bouton.indexOf("_") + 1, bouton.lastIndexOf("_") - (bouton.indexOf("_") + 1));
	var idModule = bouton.substr(bouton.lastIndexOf("_") + 1);
	var action = 'suspendu';
	var message = "<p>Le module va &ecirc;tre suspendu et ne pourra plus &ecirc;tre r&eacute;activ&eacute;. Il faudra obligatoirement cr&eacute;er un nouveau module. Confirmez-vous cette action ?</p>";
	if (typeMethode == 'CQ') {
		page = 'methodeevaluationcq';
	} else {
		page = 'methodeevaluation';
		action = 'interrompu';
		message = "<p>Le module va &ecirc;tre interrompu et ne pourra plus &ecirc;tre r&eacute;activ&eacute;. Confirmez-vous cette action ?</p>";
	}
	
	var dataObject = {
		'idModule' : idModule,
		'idMethodeEval' : idMethodeEval
	};
	
	var div = jQuery("<div/>", {
		id : 'dialog-confirm',
		title : 'Attention'
	}).appendTo(data).html(message);
	div
			.dialog({
				resizable : false,
				draggable : false,
				modal : true,
				dialogClass : "dialogbox",
				buttons : [
						{
							name : "bt_vert",
							text : "Oui",
							click : function() {
								jQuery
										.post(
												common.getBaseUrl() + "/demarche/detaildemarche/" + page + ":ajaxSuspendreModule?ajax=true",
												{
													'dataObject' : JSON.stringify(dataObject)
												},
												function(dataObject) {
													if (action == 'suspendu') {
														jQuery("#affichageBtnSuspension_" + idModule).empty();
														jQuery("#blocMenusGD").message({
															text : dataObject.messageSuspendu,
															type : "notification"
														});
														jQuery("#txtInterrompu_" + idModule).empty();
														jQuery("<span class='txtInterrompu' id='txtInterrompu_" + idModule + "'>INT</span>").insertAfter(
																"#affichageBtnDiffusion_" + idModule);
														
													} else if (action == 'interrompu') {
														jQuery("#affichageBtnInterromption_" + idModule).empty();
														if (dataObject && dataObject.droitInterruption) {
															jQuery("#affichageBtnInterromption_" + idModule)
																	.append(
																			'<img src="'
																					+ SARAImgRootPath
																					+ '/newDesign/icone_suspendre_desactive.png"  alt="Interrompre le module" style="padding-right: 5px;" />');
														}
														jQuery("#blocMenusGD").message({
															text : dataObject.messageSuspendu,
															type : "notification"
														});
														jQuery("#txtInterrompu_" + idModule).empty();
														refreshModulesImage(idModule);
														jQuery("<span class='txtInterrompu' id='txtInterrompu_" + idModule + "'>INT</span>").insertAfter(
																"#affichageBtnDiffusion_" + idModule);
													}
													
												}).fail(function(jqXHR) {
											defaultAjaxErrorHandler(jqXHR, {
												type : "error"
											});
										});
								jQuery(this).dialog("close");
								jQuery(this).remove();
							}
						}, {
							name : "bt_rouge",
							text : "Non",
							click : function() {
								jQuery(this).dialog("close");
								jQuery(this).remove();
							}
						}]
			});
	
}

function supprimerModuleCQ(methodeEval, data) {
	
	var bouton = jQuery(data).attr("id");
	var idMethodeEval = bouton.substr(bouton.indexOf("_") + 1, bouton.lastIndexOf("_") - (bouton.indexOf("_") + 1));
	var idModule = bouton.substr(bouton.lastIndexOf("_") + 1);
	
	var inputData = {
		'idModule' : idModule,
		'idMethodeEval' : idMethodeEval
	};
	
	jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluationcq:ajaxSupprimerModuleCQ?ajax=true", // URL
	{
		'dataLineObject' : JSON.stringify(inputData)
	}, // Data
	function(dataObject) {
		
		if (dataObject.isVersionDefinitive == true) {
			afficheSuppressionInpossible(1);
		} else {
			if (dataObject.isTransmisHas == true) {
				afficheSuppressionInpossible(2);
			} else {
				supprimerModule(methodeEval, data, "CQ");
			}
		}
	}).fail(function(jqXHR) {
		defaultAjaxErrorHandler(jqXHR, {
			type : "error"
		});
	});
}

function supprimerModule(methodeEval, data, typeModule) {
	var link = jQuery(data);
	if (link.parent().find("span.txtVersionDefinitive").length) {
		popupManager.alert({
			message : EditDemManager.getMessageErreurSuppressionModuleRapportVisite()
		});
		return;
	}
	var bouton = jQuery(data).attr("id");
	
	var idMethodeEval = bouton.substr(bouton.indexOf("_") + 1, bouton.lastIndexOf("_") - (bouton.indexOf("_") + 1));
	var idModule = bouton.substr(bouton.lastIndexOf("_") + 1);
	
	var inputData = {
		'idModule' : idModule,
		'idMethodeEval' : idMethodeEval
	};
	
	var page = "methodeevaluation";
	if (typeModule == 'CQ') {
		page = "methodeevaluationcq";
	}
	
	var div = jQuery("<div/>", {
		id : 'dialog-confirm',
		title : 'Attention'
	}).appendTo(data).html("<p>" + aler009 + "</p>");
	div.dialog({
		resizable : false,
		draggable : false,
		modal : true,
		dialogClass : "dialogbox",
		buttons : [{
			name : "bt_vert",
			text : "Oui",
			click : function() {
				jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/" + page + ":ajaxSupprimerModule?ajax=true", // URL
				{
					'dataLineObject' : JSON.stringify(inputData)
				}, // Data
				function(dataObject) {
					
					if (dataObject.isVersionDefinitive == true) {
						afficheSuppressionInpossible(1);
					} else {
						if (dataObject.isTransmisHas == true) {
							
						} else {
							jQuery("#versionDefinitive_" + idMethodeEval).text(dataObject.versionDefinitive);
							jQuery("#ligneModule" + idModule).remove();
							
							jQuery("#blocMenusGD").message({
								text : dataObject.messageSupp,
								type : "notification"
							});
							
							methodeEval.tabModules.flush();
							initTableModules(methodeEval);
							showValidationMessagesMod(dataObject);
						}
					}
				}).fail(function(jqXHR) {
					defaultAjaxErrorHandler(jqXHR, {
						type : "error"
					});
				});
				jQuery(this).dialog("close");
				jQuery(this).remove();
			}
		}, {
			name : "bt_rouge",
			text : "Non",
			click : function() {
				jQuery(this).dialog("close");
				jQuery(this).remove();
			}
		}]
	});
}

function afficheSuppressionInpossible(typeSuppressionImpossible) {
	
	if (typeSuppressionImpossible == 1) {
		message = supp1;
	} else {
		if (typeSuppressionImpossible == 2) {
			message = supp2;
		}
	}
	
	var div = jQuery("<div/>", {
		id : 'dialog-confirm',
		title : 'Attention'
	}).appendTo(document.body).html("<p>" + message + "</p>");
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
				jQuery(this).remove();
			}
		}]
	});
}

/**
 * Affiche un message de confirmation pour la diffusion.
 * 
 * @param msgConfirmation
 */
function afficherConfirmationDemandeDiffusion(methodeEval, data, typeMethode, msgConfirmation) {
	
	popupManager.confirm({
		message : msgConfirmation,
		okFunction : function() {
			
			diffuserModule(methodeEval, data, typeMethode);
		}
	});
}

function goToPersonnaliserModule(idModule) {
	var dataObject = {
		'idModule' : idModule
	};
	
	jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxGoToPersonnaliserModule?ajax=true", {
		'dataObject' : JSON.stringify(dataObject)
	}, function(dataObject) {
		jQuery(location).attr('href', common.getBaseUrl() + dataObject.url);
	}).fail(function(jqXHR) {
		defaultAjaxErrorHandler(jqXHR, {
			type : "error"
		});
	});
}

function goToPersonnaliserModuleCQ(idModule) {
	var dataObject = {
		'idModule' : idModule
	};
	
	jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluationcq:ajaxGoToPersonnaliserModule?ajax=true", {
		'dataObject' : JSON.stringify(dataObject)
	}, function(dataObject) {
		jQuery(location).attr('href', common.getBaseUrl() + "/module/personnalisationmodulerapport/true");
	}).fail(function(jqXHR) {
		defaultAjaxErrorHandler(jqXHR, {
			type : "error"
		});
	});
}

function refreshModules(methodeEval, data, typeMethode) {
	var infos = data.result[0];
	var idModule = infos.idModule[0];
	var tr = jQuery("<tr id='ligneModule" + idModule + "'>");
	jQuery("<td/>").appendTo(tr).append(jQuery("<span/>").text(infos.identifiant));
	jQuery("<td/>").appendTo(tr).append(jQuery("<span/>").text(infos.type));
	jQuery("<td/>").appendTo(tr).append(jQuery("<span/>").text(infos.baseReference));
	jQuery("<td/>").appendTo(tr).append(jQuery("<span/>").text(infos.versionManuel));
	var td = jQuery("<td/>").appendTo(tr);
	td.append(jQuery("<span class='hidden'/>").text(infos.idModule)).append;
	td.append(jQuery("<img src='" + SARAImgRootPath
			+ "/picto_palette.gif' title='Personnaliser module' alt='Personnaliser module' style='padding-right: 5px;' onclick='goToPersonnaliserModule"
			+ typeMethode + "(" + idModule + ");'/>"));
	td.append(jQuery("<a id='" + typeMethode + "suppModule_" + infos.idMethodeEval + "_" + idModule + "' href='' class='suppModule'><img src='"
			+ SARAImgRootPath + "/picto_cross.gif' title='Supprimer module' alt='Supprimer module' style='padding-right: 5px;'/></a>"));
	if (typeMethode == 'CQ') {
		td.append(jQuery('<a class="susppModule" ><img src="' + SARAImgRootPath
				+ '/newDesign/icone_suspendre_desactive.png" title="Suspendre le module" alt="Suspendre le module" style="padding-right: 5px;"/></a>'));
		td.append(jQuery("<img src='" + SARAImgRootPath
				+ "/report_go_grey.gif' title='Rendre visible le module' alt='Rendre visible le module' style='padding-right: 5px;'/></a>"));
	} else {
		var dataObject = {
			'idModule' : idModule
		};
		jQuery
				.post(
						common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxIsDroitInterruption",
						{
							'dataObject' : JSON.stringify(dataObject)
						},
						function(dataObject) {
							if (dataObject && dataObject.droitInterruptionModule == true) {
								td
										.append(jQuery('<a  class="interrompreModule"><img src="'
												+ SARAImgRootPath
												+ '/newDesign/icone_suspendre_desactive.png" title="Interrompre le module" alt="Interrompre le module" style="padding-right: 5px;"/></a>'));
							}
							td
									.append(jQuery("<img src='"
											+ SARAImgRootPath
											+ "/report_go_grey.gif' title='Rendre visible le module' alt='Rendre visible le module' style='padding-right: 5px;'/></a>"));
						}).fail(function(jqXHR) {
					defaultAjaxErrorHandler(jqXHR, {
						type : "error"
					});
				});
	}
	tr.appendTo(jQuery("#modules" + infos.idMethodeEval + " tbody"));
	
	if (typeMethode == 'CQ') {
		jQuery("#CQsuppModule_" + infos.idMethodeEval + "_" + idModule).on("click", function(e) {
			e.stopPropagation();
			e.preventDefault();
			supprimerModuleCQ(methodeEval, this);
		});
	} else {
		jQuery("#suppModule_" + infos.idMethodeEval + "_" + idModule).on("click", function(e) {
			e.stopPropagation();
			e.preventDefault();
			supprimerModule(methodeEval, this);
		});
	}
	
	if (typeMethode == 'CQ') {
		jQuery("#CQdiffuserModule_" + infos.idMethodeEval + "_" + idModule).on("click", function(e) {
			e.stopPropagation();
			e.preventDefault();
			diffuserModule(methodeEval, this, typeMethode);
		});
	} else {
		jQuery("#diffuserModule_" + infos.idMethodeEval + "_" + idModule).on("click", function(e) {
			e.stopPropagation();
			e.preventDefault();
			demandeDiffusionModule(methodeEval, this, '');
		});
	}
	
	// Gestion des droits pour les "Modules"
	handleRightsForModules(infos.idMethodeEval);
	
	methodeEval.tabModules.flush();
	initTableModules(methodeEval);
}

/**
 * Quand on clique sur diffuser module, on desactive l'image du module
 */
function refreshModulesImage(idModule) {
	jQuery("#affichageBtnDiffusion_" + idModule).html(
			"<img src='" + SARAImgRootPath + "/report_go_grey.gif' alt='Rendre visible le module' style='padding-right: 5px;'/>");
}

var validationMessages = [];
function showValidationMessages() {
	jQuery.ajax({
		url : common.getBaseUrl() + "/demarche/detaildemarche/editdem:validerPerimetre?ajax=true", // URL
		success : function(data, textStatus, jqXHR) {
			// Ajout des nouveaux
			var length = validationMessages.length;
			var ttl = 10000;
			for (var i = 0; i < data.length; i++) {
				validationMessages.push(jQuery("#blocMenusGD").message({
					text : data[i],
					type : "warning",
					timeout : ttl += 1000
				}));
			}
			// Nettoyage des anciens messages
			for (var i = 0; i < length; i++) {
				var message = validationMessages[i];
				if (jQuery(message.div).is(':visible')) {
					message.hide();
				}
			}
			validationMessages.splice(0, length);
		},
		error : function(jqXHR) {
			var msg = decodeURI(jqXHR.getResponseHeader("ErrorMessage"));
			jQuery("#blocMenusGD").message({
				text : msg,
				type : "error"
			});
		}
	});
}

function showValidationMessagesMod(dataLineObject) {
	jQuery.ajax({
		url : common.getBaseUrl() + "/demarche/detaildemarche/editdem:validerPerimetre?ajax=true", // URL
		data : dataLineObject,
		success : function(data, textStatus, jqXHR) {
			// Ajout des nouveaux
			var length = validationMessages.length;
			var ttl = 10000;
			for (var i = 0; i < data.length; i++) {
				validationMessages.push(jQuery("#blocMenusGD").message({
					text : data[i],
					type : "warning",
					timeout : ttl += 1000
				}));
			}
			// Nettoyage des anciens messages
			for (var i = 0; i < length; i++) {
				var message = validationMessages[i];
				if (jQuery(message.div).is(':visible')) {
					message.hide();
				}
			}
			validationMessages.splice(0, length);
		},
		error : function(jqXHR) {
			var msg = decodeURI(jqXHR.getResponseHeader("ErrorMessage"));
			jQuery("#blocMenusGD").message({
				text : msg,
				type : "error"
			});
		}
	});
}

function disableForm() {
	jQuery('span.btVert').attr('class', 'btDesactiv');
	jQuery('div.conteneur').find('a').each(function(i, element) {
		var id = jQuery(element).attr('id');
		if (id != 'supprimer' && id != 'activer') {
			jQuery(element).off('click');
			jQuery(element).on('click', function() {
				return false;
			});
			jQuery(element).css('cursor', 'default');
		}
	});
	jQuery('div.conteneur').find('img[src$="picto_suppr.gif"]').each(function(i, element) {
		jQuery(element).hide();
	});
	jQuery('div.conteneur :input').attr('disabled', true);
}

/**
 * @param data
 */
function refreshStructures(editDem, data) {
	jQuery("#structures tbody").empty();
	for (var i = 0; i < data.result.length; i++) {
		var infos = data.result[i];
		var idStructure = infos.idStructure;
		var tr = jQuery("<tr id='ligneStructure" + idStructure + "'>");
		jQuery("<td/>").appendTo(tr).append(jQuery("<span/>").text(infos.numFiness));
		jQuery("<td/>").appendTo(tr).append(jQuery("<span/>").text(infos.nom));
		jQuery("<td/>").appendTo(tr).append(jQuery("<span/>").text(infos.gcs));
		jQuery("<td/>").appendTo(tr).append(jQuery("<span/>").text(infos.numFinessEj));
		jQuery("<td/>").appendTo(tr).append(jQuery("<span/>").text(infos.gh));
		jQuery("<td/>").appendTo(tr).append(jQuery("<span/>").text(infos.groupe));
		renderDisplayActionsStructure(data, tr, infos);
		tr.appendTo(jQuery("#structures tbody"));
	}
	editDem.tabStructures.flush();
	initTableStructures(editDem);
	var tabStructures = jQuery("#structures").grid({
		howtoCompare : function(el) {
			var result = "";
			if (jQuery("span[title]", el).length !== 0) {
				result = jQuery("span[title]", el).attr("title");
			}
			if (jQuery("span[original-title]", el).length !== 0) {
				result = jQuery("span[original-title]", el).attr("original-title");
			}
			if (result === "") {
				result = el.text();
			}
			return result;
		},
		howtoRead : function(el) {
			return jQuery("span", el);
		},
		messages : {
			foot : " \351l\351ment(s) affich\351(s) sur ",
			previous : "\253 Page pr\351c\351dente",
			next : "Page suivante \273",
			empty : ""
		}
	});
	
	jQuery("#popUpRechercheStructure").on("refreshstructures", function(e, data) {
		refreshStructures(editDem, data);
	});
	jQuery("#popUpEditStructure").on("refreshstructures", function(e, data) {
		refreshStructures(editDem, data);
	});
	
	var nbStructuresText = "P\351rim\350tre - " + data.result.length + " structure(s)";
	jQuery("#nbStructures").text(nbStructuresText);
	
	editDem.tabStructures = tabStructures;
	
}

function getListeVersionByTypeModule(typeModule) {
	var listeIdVersion = new Array();
	var nbVersion = 0;
	for (var i = 0; i < correspondanceType.length; i++) {
		if (correspondanceType[i] == typeModule) {
			listeIdVersion[nbVersion] = correspondanceVersion[i];
			nbVersion++;
		}
	}
	return listeIdVersion;
}

function getListeBaseRefByTypeModule(typeModule) {
	var listeIdBaseRef = new Array();
	var nbBaseRef = 0;
	for (var i = 0; i < correspondanceType.length; i++) {
		if (correspondanceType[i] == typeModule) {
			listeIdBaseRef[nbBaseRef] = correspondanceBaseRef[i];
			nbBaseRef++;
		}
	}
	return listeIdBaseRef;
}

function majListeBaseRef(object) {
	// r�cup�ration de la valeur du typeModule s�lectionn�
	var typeModule = jQuery(object);
	var idModule = typeModule.attr("id").substr(10, typeModule.attr("id").length);
	var baseReference = jQuery("#baseReference" + idModule);
	// r�cup�ration de la liste des versions associ�es
	// mise a jour de la liste des valeurs
	var listeBaseRef = getListeBaseRefByTypeModule(typeModule.val());
	baseReference.find('option').remove();
	for (var i = 0; i < listeBaseRef.length; i++) {
		var id = listeBaseRef[i];
		var label = "";
		/* R�cup�ration du label */
		for (var j = 0; j < listeIdBaseReference.length; j++) {
			if (id == listeIdVersionManuel[j]) {
				label = listeLabelBaseReference[j];
			}
		}
		baseReference.append('<option value="' + id + '">' + label + '</option>');
	}
}

function initListeTypeVersionModule(data) {
	
	var typeModule = jQuery(data);
	var idModule = typeModule.attr("id").substr(10, typeModule.attr("id").length);
	var versionManuel = jQuery("#versionManuel" + idModule);
	
	for (var i = 0; i < listeIdTypeModule.length; i++) {
		var id = listeIdTypeModule[i];
		var label = listeLabelTypeModule[i];
		typeModule.append('<option value="' + id + '">' + label + '</option>');
	}
	
	for (var j = 0; j < listeIdVersionManuel.length; j++) {
		var id = listeIdVersionManuel[j];
		var label = listeLabelVersionManuel[j];
		versionManuel.append('<option value="' + id + '">' + label + '</option>');
	}
}

/*
 * Alimentation du select pour les bases de r�f�rence
 */
function initListeBaseReference(data) {
	var baseReference = jQuery(data);
	var idModule = baseReference.attr("id").substr(10, baseReference.attr("id").length);
	var baseReference = jQuery("#baseReference" + idModule);
	
	for (var i = 0; i < listeIdBaseReference.length; i++) {
		baseReference.append('<option value="' + listeIdBaseReference[i] + '">' + listeLabelBaseReference[i] + '</option>');
	}
}

// Chargement de la liste des MethodeEval
function ajaxChargerListeMethodeEval(selfEditDem) {
	// On vide la DIV des m�thode �val
	jQuery("#methodesEvalsAjaxLoading").show();
	
	// On récupère les ID de méthode éval dans la DIV dédiée
	var objectsAjaxListeMethodeEval = [];
	jQuery("#idMethodesEvals div.not_loaded").each(function(index) {
		
		var div = jQuery(this);
		var idMethodeEval = div.text();
		
		objectsAjaxListeMethodeEval.push(new AjaxListeMethodeEval(selfEditDem, idMethodeEval));
	});
	
	if (objectsAjaxListeMethodeEval.length > 0) {
		
		var objectAjaxListeMethodeEval = objectsAjaxListeMethodeEval[0];
		objectsAjaxListeMethodeEval.splice(objectsAjaxListeMethodeEval.indexOf(objectAjaxListeMethodeEval), 1);
		
		// Appel AJAX
		objectAjaxListeMethodeEval.doAjax();
	} else {
		jQuery("#methodesEvalsAjaxLoading").hide();
	}
	
	selfEditDem.objectsAjaxListeMethodeEval = objectsAjaxListeMethodeEval;
	
}

function handleRightsForModules(idMethodeEval) {
	// Gestion des droits (affichage ou non des �l�ments) pour les modules de la m�thode �valuation
	if (jQuery("#methodeEvalDatesReelles_rights_" + idMethodeEval + " div[id='CREER_MODULE']").text() !== 'true') {
		jQuery("#modules" + idMethodeEval + " tfoot").hide();
	}
	if (jQuery("#methodeEvalDatesReelles_rights_" + idMethodeEval + " div[id='SUPP_MODULE']").text() !== 'true') {
		jQuery("#modules" + idMethodeEval + " .suppModule").hide();
	}
	if (jQuery("#methodeEvalDatesReelles_rights_" + idMethodeEval + " div[id='VISIB_MODULE']").text() !== 'true') {
		jQuery("#modules" + idMethodeEval + " .visuModule").hide();
	}
	if (jQuery("#methodeEvalDatesReelles_rights_" + idMethodeEval + " div[name='SUSP_MODULE']").text() !== 'true') {
		jQuery("#modules" + idMethodeEval + " .suspModule").hide();
	}
	if (jQuery("#methodeEvalDatesReelles_rights_" + idMethodeEval + " div[id='GES_MODULE']").text() !== 'true') {
		jQuery("#modules" + idMethodeEval + " .gesModule").hide();
	}
}

function initTableStructures(editDem) {
	
	if (!editDem.tabStructures) {
		
		var tabStructures = jQuery("#structures").grid({
			howtoCompare : function(el) {
				var result = "";
				if (jQuery("span[title]", el).length !== 0) {
					result = jQuery("span[title]", el).attr("title");
				}
				if (jQuery("span[original-title]", el).length !== 0) {
					result = jQuery("span[original-title]", el).attr("original-title");
				}
				if (result === "") {
					result = el.text();
				}
				return result;
			},
			howtoRead : function(el) {
				return jQuery("span", el);
			},
			messages : {
				foot : " \351l\351ment(s) affich\351(s) sur ",
				previous : "\253 Page pr\351c\351dente",
				next : "Page suivante \273",
				empty : ""
			}
		});
		
		jQuery("#popUpRechercheStructure").on("refreshstructures", function(e, data) {
			refreshStructures(editDem, data);
		});
		jQuery("#popUpEditStructure").on("refreshstructures", function(e, data) {
			refreshStructures(editDem, data);
		});
		
		editDem.tabStructures = tabStructures;
	}
	
	jQuery("a.suppstructure").unbind("click");
	jQuery("a.suppstructure").on("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		editDem.renderDeleteLinks(this);
		return false;
	});
	
	jQuery("a.editstructure").unbind("click");
	jQuery("a.editstructure").on("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		editDem.renderEditStructure(this);
		return false;
	});
	
	if (jQuery("#structures tbody tr").size() > 10) {
		jQuery("#structures_grid_foot").show();
		jQuery("#structures tfoot").show();
	} else {
		jQuery("#structures_grid_foot").hide();
		jQuery("#structures tfoot").hide();
	}
}

function handleDisplayActionsPerimetre(editDem, data) {
	
	// Gestion de l'affichage du bouton "Communiquer p�rim�tre"
	var communiquerReplacer1 = '<img id="imgcommuniquerperimetre" src="' + SARAImgRootPath
			+ '/megaphone_grey.png" title="Communiquer le p\351rim\350tre" alt="Communiquer le p\351rim\350tre"/>';
	var communiquerReplacer2 = '<a href="editdem.communiquer" id="communiquer"><img title="Communiquer le p\351rim\350tre" alt="Communiquer le p\351rim\350tre" id="imgcommuniquerperimetre" src="'
			+ SARAImgRootPath + '/megaphone.gif"></a>';
	
	var elementToReplace = null;
	if (jQuery("#communiquer").length > 0) {
		elementToReplace = jQuery("#communiquer");
	} else {
		if (jQuery("#imgcommuniquerperimetre").length > 0) {
			elementToReplace = jQuery("#imgcommuniquerperimetre");
		}
	}
	
	if (elementToReplace) {
		if (data.isPerimetreModifiableEtModifie && data.isActive) {
			elementToReplace.replaceWith(communiquerReplacer2);
		} else {
			elementToReplace.replaceWith(communiquerReplacer1);
		}
	}
	
	attachClickToBoutonCommuniquer(editDem);
	
	// Gestion de l'affichage du bouton "Ajouter structure"
	var ajouterStructuresReplacer1 = '<span id="spanajouterstructure" class="btDesactiv"><a href="#" >Ajouter structure</a></span>';
	var ajouterStructuresReplacer2 = '<span id="spanajouterstructure" class="btVert"><a href="editdem.ajoutstructures" id="ajoutStructures">Ajouter structure</a></span>';
	
	if (data.isPerimetreModifiable) {
		jQuery("#spanajouterstructure").replaceWith(ajouterStructuresReplacer2);
		
		jQuery("#ajoutStructures").on("click", function(e) {
			e.stopPropagation();
			e.preventDefault();
			editDem.clickBtAjouterStructure(e);
		});
	} else {
		jQuery("#spanajouterstructure").replaceWith(ajouterStructuresReplacer1);
	}
	
}

function attachClickToBoutonCommuniquer(editDem) {
	jQuery("#communiquer").off("click");
	jQuery("#communiquer").on("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		editDem.clickBtCommuniquer(e);
	});
}

function renderDisplayActionsStructure(data, tr, infos) {
	var construct = null;
	
	if (data.isPerimetreModifiable) {
		
		construct = appendActionAccueilStructure(construct, infos, tr);
		
		if (structureModifiable == "true") {
			if (infos.modificationAutorisee == "true") {
				if (construct != null) {
					construct.append(jQuery("<a style=\"float:left;\" href='editdem%3Aeditstructure/" + infos.idStructure
							+ "' class='editstructure'><img src='" + SARAImgRootPath
							+ "/picto_edit.gif' alt='Acc\351der \340 la fiche structure' title='Acc\351der \340 la fiche structure' /></a>"));
				} else {
					construct = jQuery("<td/>").appendTo(tr)
							.append(
									jQuery("<a style=\"float:left;\" href='editdem%3Aeditstructure/" + infos.idStructure + "' class='editstructure'><img src='"
											+ SARAImgRootPath
											+ "/picto_edit.gif' alt='Acc\351der � la fiche structure' title='Acc\351der � la fiche structure' /></a>"));
				}
			}
		}
		
		if (structureSupprimable == "true") {
			if (construct != null) {
				construct.append(jQuery("<a style=\"float:left;\" href='editdem%3Asuppstructure/" + infos.idStructure + "' class='suppstructure'><img src='"
						+ SARAImgRootPath + "/picto_suppr.gif' alt='" + supprimerStructureMessage + "' title='" + supprimerStructureMessage + "' /></a>"));
			} else {
				construct = jQuery("<td/>").appendTo(tr).append(
						jQuery("<a style=\"float:left;\" href='editdem%3Asuppstructure/" + infos.idStructure + "' class='suppstructure'><img src='"
								+ SARAImgRootPath + "/picto_suppr.gif' alt='" + supprimerStructureMessage + "' title='" + supprimerStructureMessage
								+ "' /></a>"));
			}
		}
		
		construct = appendActionConsulterHistoStructure(construct, tr, data, infos);
		construct = appendActionConsulterHistoDecisionStructure(construct, tr, infos);
	} else {
		
		if (structureModifiable == "true") {
			construct = jQuery("<td/>")
					.appendTo(tr)
					.append(
							jQuery("<a style=\"float:left;\" href='editdem%3Aeditstructure/"
									+ infos.idStructure
									+ "' class='editstructure'><img src='"
									+ SARAImgRootPath
									+ "/picto_edit.gif' alt='Acc\351der \340 la fiche structure' title='Acc\351der \340 la fiche structure' style='padding-right: 5px;' title='Acc\351der � la fiche structure' /></a>"));
		}
		
		if (structureSupprimable == "true") {
			if (construct != null) {
				construct.append(jQuery("<span><img style=\"float:left;\"  src='" + SARAImgRootPath + "/picto_suppr.gif' alt='" + supprimerStructureMessage
						+ "' title='" + supprimerStructureMessage + "' style='padding-right: 5px;'/></span>"));
			} else {
				construct = jQuery("<td/>").appendTo(tr).append(
						jQuery("<span><img style=\"float:left;\" src='" + SARAImgRootPath + "/picto_suppr.gif' alt='" + supprimerStructureMessage + "' title='"
								+ supprimerStructureMessage + "' style='padding-right: 5px;'/></span>"));
			}
		}
		
		construct = appendActionConsulterHistoStructure(construct, data, infos);
		construct = appendActionConsulterHistoDecisionStructure(construct, infos);
		
	}
}

/**
 * @param construct: balise sur laquelle on va greffer le bouton de consultation dhistorique
 * @param data: reponse ajax
 * @param infos: tab asso des infos de la structure.
 * @returns la balise construct avec le bouton de consultation d'historique greffe.
 */
function appendActionConsulterHistoStructure(construct, tr, data, infos) {
	var strConsulterHistoStructure = "<a style=\"float:left;\" href='showHisto?typeHisto=HistoStructure&idDemarche=" + data['idDemarche'] + "&idStructure="
			+ infos.idStructure + "' ><img  src='" + SARAImgRootPath
			+ "/clock_history_frame.png' title=\"Consulter l'historique des changements de la structure.\" style='border:none; padding-left:5px;' /></a>";
	if (construct != null) {
		construct.append(jQuery(strConsulterHistoStructure));
	} else {
		construct = jQuery("<td/>").appendTo(tr).append(jQuery(strConsulterHistoStructure));
	}
	return construct;
}
/**
 * @param construct balise sur laquelle on va greffer le bouton d'acceuil
 * @param infos tab asso des infos de la structure.
 * @param tr la balise construct avecle bouton d'acceuil
 * @returns
 */
function appendActionAccueilStructure(construct, infos, tr) {
	
	var strAccueil = "<input type='text' id='idAssoDemarcheStructure' value='" + infos.idAssoDemarcheStructure + "' style='display: none' />";
	strAccueil += "<input type='text' id='accueil_" + infos.idAssoDemarcheStructure + "' value='" + infos.accueil + "' style='display: none' />";
	strAccueil += "<input type='text' id='visibiliteAssoDemarcheStructure' value='" + infos.visible + "' style='display: none' />";
	
	if (infos.accueil == "true") {
		strAccueil += "<img src='" + SARAImgRootPath
				+ "/picto_structure_accueil.gif' alt='Structure d'accueil' style='float:left;padding-right: 5px; cursor: pointer;' id='structure_accueil_"
				+ infos.idAssoDemarcheStructure + "' title=\"Structure d'accueil\" />";
	} else {
		strAccueil += "<img src='" + SARAImgRootPath
				+ "/picto_structure_accueil_grey.gif' alt='Structure d'accueil' style='float:left;padding-right: 5px; cursor: pointer;' id='structure_accueil_"
				+ infos.idAssoDemarcheStructure + "' title=\"Structure d'accueil\" />";
	}
	
	if (construct != null) {
		construct.append(jQuery(strAccueil));
	} else {
		construct = jQuery("<td/>").appendTo(tr).append(jQuery(strAccueil));
	}
	return construct;
	
}

/**
 * @param construct: balise sur laquelle on va greffer le bouton de consultation dhistorique des d�cisions
 * @param infos: tab asso des infos de la structure.
 * @returns la balise construct avec le bouton de consultation d'historique greffe.
 */
function appendActionConsulterHistoDecisionStructure(construct, tr, infos) {
	var strConsulterHistoStructure = " <a style=\"float:left; padding-left:5px; cursor:pointer;\" id=\"popDetailStructure\" onclick=\"compDecisionsStructure_renderPopup("
			+ infos.idStructure
			+ ");\" style=\"cursor:pointer;\"><img  src=\""
			+ SARAImgRootPath
			+ "/shape_move_forwards.png\" title=\"Consulter la synthese des decisions de la structure.\" style=\"border:none;\" /></a>";
	if (construct != null) {
		construct.append(jQuery(strConsulterHistoStructure));
	} else {
		construct = jQuery("<td/>").appendTo(tr).append(jQuery(strConsulterHistoStructure));
	}
	return construct;
}

function ajaxChargerMemoPerimetre(selfEditDem) {
	var dataObject = {};
	
	jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/editdem:ajaxChargerMemoPerimetre?ajax=true", {
		'dataObject' : JSON.stringify(dataObject)
	}, function(resultData) {
		// Cr�ation
		if (resultData.isCreation == "true") {
			jQuery("#memoPerimetre").memo({
				type : "new",
				readonly : false,
				onSave : function() {
					sauvegarderMemoPerimetre(this);
				}
			});
		} else {
			jQuery("#memoPerimetre").memo({
				readonly : false,
				onRender : function() {
					this.renderInfo(resultData.intervenant, resultData.dateModif);
					if (this.backup == undefined) {
						this.val(resultData.commentaire);
					} else {
						this.val(this.backup);
					}
				},
				onSave : function() {
					sauvegarderMemoPerimetre(this);
				}
			});
		}
	}).fail(function(jqXHR) {
		defaultAjaxErrorHandler(jqXHR, {
			type : "error"
		});
	});
}

function sauvegarderMemoPerimetre(data) {
	var commentaire = jQuery(".memo_txt textarea", data.conteneur).val();
	var dataObject = {
		'commentaire' : commentaire
	};
	
	jQuery.post(
			common.getBaseUrl() + "/demarche/detaildemarche/editdem:ajaxSauvegarderMemoPerimetre?ajax=true",
			{
				'dataObject' : JSON.stringify(dataObject)
			},
			function(resultData) {
				jQuery(".memo_info", data.conteneur).html(
						"Derni\350re modification le <span class='bold'>" + resultData.dateModif + "</span> par <span class='bold'>" + resultData.intervenant
								+ "</span>");
				jQuery("#blocMenusGD").message({
					text : conf001,
					type : "notification"
				});
			}).fail(function(jqXHR) {
		defaultAjaxErrorHandler(jqXHR, {
			type : "error"
		});
	});
	
}

function sauvegarderNomUsuel() {
	var nomUsuel = jQuery("#nomusuel").val();
	var dataObject = {
		'nomUsuel' : nomUsuel
	};
	
	jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/editdem:ajaxChangenomusuel?ajax=true", {
		'dataObject' : JSON.stringify(dataObject)
	}, function(resultData) {
		jQuery("#blocMenusGD").message({
			text : conf001,
			type : "notification"
		});
		
	}).fail(function(jqXHR) {
		defaultAjaxErrorHandler(jqXHR, {
			type : "error"
		});
	});
}

function lengthNomUsuel() {
	var nomUsuel = jQuery("#nomusuel").val();
	if (nomUsuel.length > 10000) {
		
		var newTexte = String(nomUsuel);
		jQuery("#nomusuel").val(newTexte.substr(0, 10000));
	}
}

function updateBaseReferenceVersionManuel(event) {
	var selectTypeRapport = $(this);
	var id = selectTypeRapport.id;
	var valueTypeModule = selectTypeRapport.value;
	var idMethodeEval = id.substring('typeModule'.length, id.length);
	// Si le type de module est un "rapport pour observation"
	if (valueTypeModule == 3) {
		var dataObject = {
			'valueTypeModule' : selectTypeRapport.value,
			'idMethodeEval' : idMethodeEval
		};
		jQuery.post(common.getBaseUrl() + AutoCompleteUnic.pageUrl() + ":ajaxGetBaseReferenceVersionManuel", {
			'dataObject' : JSON.stringify(dataObject)
		}, function(dataObject) {
			if (dataObject.rapportVisite == true) {
				refreshBaseReferenceVersionManuel(idMethodeEval, dataObject);
			} else {
				// Reinitialiser les valeurs par defaut
				reinitialisationListeBaseRefVerionManuel(idMethodeEval);
			}
		}).fail(function(jqXHR) {
			defaultAjaxErrorHandler(jqXHR, {
				type : "error"
			});
		});
	} else if (valueTypeModule == 4) {
		var dataObject = {
			'valueTypeModule' : selectTypeRapport.value,
			'idMethodeEval' : idMethodeEval
		};
		jQuery.post(common.getBaseUrl() + AutoCompleteUnic.pageUrl() + ":ajaxGetBaseReferenceVersionManuel", {
			'dataObject' : JSON.stringify(dataObject)
		}, function(dataObject) {
			if (dataObject.rapportVisite == true) {
				refreshBaseReferenceVersionManuel(idMethodeEval, dataObject);
			} else {
				// Reinitialiser les valeurs par defaut
				reinitialisationListeBaseRefVerionManuel(idMethodeEval);
			}
		}).fail(function(jqXHR) {
			defaultAjaxErrorHandler(jqXHR, {
				type : "error"
			});
		});
	} else {
		// Reinitialiser les valeurs par defaut
		reinitialisationListeBaseRefVerionManuel(idMethodeEval);
	}
}

function refreshBaseReferenceVersionManuel(idMethodeEval, dataObject) {
	var versionManuel = jQuery("#versionManuel" + idMethodeEval);
	versionManuel.empty();
	versionManuel.append('<option value="' + dataObject.idVersionManuel + '">' + dataObject.libelleVersionManuel + '</option>');
	
	var baseReference = jQuery("#baseReference" + idMethodeEval);
	baseReference.empty();
	baseReference.append('<option value="' + dataObject.idBaseReference + '">' + dataObject.libelleBaseReference + '</option>');
}

function reinitialisationListeBaseRefVerionManuel(idMethodeEval) {
	var versionManuel = jQuery("#versionManuel" + idMethodeEval);
	versionManuel.empty();
	for (var j = 0; j < listeIdVersionManuel.length; j++) {
		versionManuel.append('<option value="' + listeIdVersionManuel[j] + '">' + listeLabelVersionManuel[j] + '</option>');
	}
	
	var baseReference = jQuery("#baseReference" + idMethodeEval);
	baseReference.empty();
	for (var i = 0; i < listeIdBaseReference.length; i++) {
		baseReference.append('<option value="' + listeIdBaseReference[i] + '">' + listeLabelBaseReference[i] + '</option>');
	}
}

/**
 * Fonction faisant un appel ajax dans le but de mettre � jour la liste d�roulante des base de r�f�rence ou version manuel
 */
function updateVersionBaseReferenceOrVersionManuel(event) {
	
	var select = $(this);
	
	var id = select.id;
	
	var inputData = null;
	
	// Pr�paration des donn�es pour appel AJAX
	if (id.match(/^baseReference/)) {
		inputData = {
			'idVersionManuel' : '',
			'idVersionBaseReference' : select.value,
			'idSelect' : id.substring('baseReference'.length, id.length)
		};
		
	} else {
		inputData = {
			'idVersionManuel' : select.value,
			'idVersionBaseReference' : '',
			'idSelect' : id.substring('versionManuel'.length, id.length)
		};
	}
	
	jQuery.ajax({
		data : {
			'dataLineObject' : JSON.stringify(inputData)
		},
		dataType : "json",
		url : common.getBaseUrl() + AutoCompleteUnic.pageUrl() + ":ajaxGetVersionBaseReferenceOrVersionManuel",
		contentType : "application/json; charset=iso-8859-1",
		success : updateSelectVersionBaseReferenceOrVersionManuel
	});
	
}

/**
 * Fonction mettant � jour la liste d�roulante
 */
function updateSelectVersionBaseReferenceOrVersionManuel(data) {
	
	var selectToUpdate = null;
	var id = null;
	
	if (data.idVersionBaseReference != "") {
		selectToUpdate = jQuery("select[id^='baseReference" + data.idSelect + "']");
		id = data.idVersionBaseReference;
	} else {
		selectToUpdate = jQuery("select[id^='versionManuel" + data.idSelect + "']");
		id = data.idVersionManuel;
	}
	
	// R�initialisation de la select box baseReference
	selectToUpdate.empty();
	
	var option = jQuery("<option />").attr("value", id).text(data.libelleVersion);
	option.appendTo(selectToUpdate);
	
}

/**
 * Fonction faisant un appel ajax dans le but de mettre � vrai ou non l'attribut acceuil d'une asso demarche structure
 */
function updateAssoStructureAcceuil(event) {
	
	var link = jQuery(this);
	
	var idAssoDemStructure = link.parent().find("input[id^=idAssoDemarcheStructure]").val();
	var visibiliteAssoDemarcheStructure = link.parent().find("input[id^=visibiliteAssoDemarcheStructure]").val();
	
	// Pr�paration des donn�es pour appel AJAX
	var inputData = {
		'idAssoDemStructure' : idAssoDemStructure,
		'visibiliteAssoDemStructure' : visibiliteAssoDemarcheStructure
	};
	
	jQuery.ajax({
		data : {
			'dataLineObject' : JSON.stringify(inputData)
		},
		dataType : "json",
		url : common.getBaseUrl() + AutoCompleteUnic.pageUrl() + ":ajaxMajAssoStructureAcceuil",
		contentType : "application/json; charset=iso-8859-1",
		success : updateIconAcceuil
	});
	
}

/**
 * Fonction changeant l'apparence de l'image selon l'attribut acceuil d'une structure
 */
function updateIconAcceuil(data) {
	
	var idImg = "structure_accueil_" + data.idAssoDemStructure;
	
	if (data.assoAcceuil) {
		jQuery("img[id='" + idImg + "']").attr("src", SARAImgRootPath + "/picto_structure_accueil.gif");
	} else {
		jQuery("img[id='" + idImg + "']").attr("src", SARAImgRootPath + "/picto_structure_accueil_grey.gif");
	}
}

/**
 * Instantiation et utilisation de la classe.
 */
jQuery(document).ready(function() {
	
	// Initialisation de la page
	var editDem = new EditDem();
	
	editDem.renderHandler();
	
	ajaxChargerMemoPerimetre(editDem);
	
	jQuery("#ajoutStructures").on("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		editDem.clickBtAjouterStructure(e);
	});
	
	jQuery("a.suppstructure").on("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		editDem.renderDeleteLinks(this);
	});
	
	jQuery("#ajoutMethodesEvaluations").on("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		editDem.clickBtAjouterMethodeEvaluation(e);
	});
	
	jQuery("a.suppMethodeEval").on("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		editDem.supprimerMethodeEvaluation(this);
	});
	
	jQuery("#desactiver").on("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		editDem.clickBtDesactiver(e);
	});
	
	jQuery("#activer").on("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		editDem.clickBtActiver(e);
	});
	
	jQuery("div#main").on("change", "select[id^='versionManuel']", updateVersionBaseReferenceOrVersionManuel);
	jQuery("div#main").on("change", "select[id^='baseReference']", updateVersionBaseReferenceOrVersionManuel);
	
	jQuery("div#main").on("change", "select[id^='typeModule']", updateBaseReferenceVersionManuel);
	
	jQuery("div#main").on("click", "img[id^='structure_accueil']", updateAssoStructureAcceuil);
	
	/*
	 * RG_00.00.00_CREDEM1_BC_3
	 */
	jQuery("#supprimer").click(function(e) {
		e.stopPropagation();
		e.preventDefault();
		var div = jQuery("<div/>", {
			id : 'dialog-confirm',
			title : 'Attention'
		}).appendTo(this).html("<p>" + aler006 + "</p>");
		div.dialog({
			resizable : false,
			draggable : false,
			modal : true,
			dialogClass : "dialogbox",
			buttons : [{
				name : "bt_vert",
				text : "Oui",
				click : function() {
					jQuery(location).attr("href", jQuery("#supprimer").attr("href"));
				}
			}, {
				name : "bt_rouge",
				text : "Non",
				click : function() {
					jQuery(this).dialog("close");
					jQuery(this).remove();
				}
			}]
		});
	});
	
	jQuery("#perimetre").accordion({
		header : ".header",
		collapsible : true,
		heightStyle : "content"
	});
	
	jQuery("#perimetre #nomusuel").on("change", function(e) {
		e.stopPropagation();
		e.preventDefault();
		jQuery.ajax({
			url : jQuery(location).attr('href') + ":changenomusuel/" + encodeURIComponent(this.value)
		});
	});
	
	attachClickToBoutonCommuniquer(editDem);
	
	initTableStructures(editDem);
	
	/*
	 * RG_00.00.00_CREDEM3_INIT_3
	 */

	// Chargement de la liste des MethodeEval
	ajaxChargerListeMethodeEval(editDem);
	
	initStructureAccueil();
	
	handleRights();
	
});
/**
 * M�thode mettant � jour l'image d'une structure
 */
function initStructureAccueil() {
	
	jQuery("input[id=idAssoDemarcheStructure]").each(function(index, el) {
		var id = jQuery(el).val();
		
		var idAccueil = "accueil_" + id;
		
		var idImg = "structure_accueil_" + id;
		
		isAccueil = jQuery("#" + idAccueil).val();
		
		if (isAccueil != null && isAccueil != 'undefined') {
			if ('true' == isAccueil) {
				jQuery("img[id='" + idImg + "']").attr("src", SARAImgRootPath + "/picto_structure_accueil.gif");
			} else {
				jQuery("img[id='" + idImg + "']").attr("src", SARAImgRootPath + "/picto_structure_accueil_grey.gif");
			}
		}
	});
}

function handleRights() {
	
	// Gestion des droits sur le partie "Intervenants unic"
	if (jQuery("#editDem_rights div[name='AJO_UNIC']").text() !== 'true') {
		jQuery("#intervenantsUNIC input").prop("disabled", true);
	}
	// Gestion des droits sur le partie "Nom Usuel"
	if (jQuery("#editDem_rights div[name='MOD_USUEL']").text() !== 'true') {
		jQuery("#nomusuel").prop("disabled", true);
	}
}
function initTableModules(methodeEval) {
	if (methodeEval) {
		if (!methodeEval.tabModules) {
			// Pour la gestion du tri
			var tabModules = jQuery("div.listeModules").last().grid({
				howtoCompare : function(el) {
					return el.text();
				},
				howtoRead : function(el) {
					return jQuery("span", el);
				},
				messages : {
					foot : " \351l\351ment(s) affich\351(s) sur ",
					previous : "\253 Page pr\351c\351dente",
					next : "Page suivante \273",
					empty : ""
				}
			});
			
			methodeEval.tabModules = tabModules;
		}
	}
}

/**
 * Constructeur
 */
function AutoCompleteUnic() {
	// empty
}

AutoCompleteUnic.prototype = {
	initialize : function() {
		var self = this;
		self.initAutoCompletes(self);
	},
	
	addIntervenant : function(role) {
		var selfAutoCompleteUnic = this;
		var intervenantField = jQuery('#intervenants' + role + ' > input');
		if (intervenantField.val()) {
			jQuery.ajax({
				type : "POST",
				url : common.getBaseUrl() + AutoCompleteUnic.pageUrl() + ":addItemForintervenantsunic?role=" + role + "&ajax=true",
				data : {
					ajax : true,
					value : intervenantField.val()
				},
				/*
				 * RG_00.00.00_CREDEM1_AS_5
				 */
				success : function(data, textStatus, jqXHR) {
					if (data.error) {
						jQuery("#blocMenusGD").message({
							text : data.error,
							type : "warning"
						});
					} else {
						selfAutoCompleteUnic.autoCompleteIntervenants[role].renderResultZone(data["liste" + role]);
						jQuery("#blocMenusGD").message({
							text : data['intervenant'] + " " + conf008,
							type : "notification"
						});
						intervenantField.val('');
					}
				},
				error : function(jqXHR) {
					defaultAjaxErrorHandler(jqXHR, {
						type : "error"
					});
				}
			
			});
		}
	},
	initAutoCompletes : function(self) {
		var self = this;
		this.autoCompleteIntervenants = {};
		self.initAutoComplete('UNIC');
		
		// Initialisation des listes
		jQuery.ajax({
			type : "POST",
			url : common.getBaseUrl() + AutoCompleteUnic.pageUrl() + ":ajaxGetIntervenantInitInc?ajax=true",
			data : {
				ajax : true
			},
			success : function(data, textStatus, jqXHR) {
				self.autoCompleteIntervenants['UNIC'].renderResultZone(data['UNIC']);
				// demarche a desactiver
				if (jQuery("#desactiver").length == 0) {
					jQuery('div#intervenantsUNIC').find('img[src$="picto_suppr.gif"]').each(function(i, element) {
						jQuery(element).hide();
					});
				}
			},
			error : function(jqXHR) {
				defaultAjaxErrorHandler(jqXHR, {
					type : "error"
				});
			}
		});
	},
	
	initAutoComplete : function(role) {
		var self = this;
		var multiAutoCompleteConfig = {
			"removable" : true,
			"minLength" : 2
		};
		var autoComplete = new CompMultiAutoComplete("intervenants" + role, multiAutoCompleteConfig, {}, true, AutoCompleteUnic.pageUrl()
				+ ":autocomplete?ajax=true&role=" + role, false);
		
		autoComplete.selectItem = function(event, ui) {
			event.stopPropagation();
			event.preventDefault();
			jQuery(this).val(ui.item.value);
			var role = jQuery(this).attr('role');
			self.addIntervenant(role);
		};
		autoComplete.inputField.on("detach", function(e, selected) {
			e.stopPropagation();
			jQuery("#blocMenusGD").message({
				text : selected + " " + conf009,
				type : "notification"
			});
		});
		
		autoComplete.inputField.on("warning", function(e, msg) {
			e.stopPropagation();
			jQuery("#blocMenusGD").message({
				text : msg,
				type : "warning"
			});
		});
		
		autoComplete.inputField.on("error", function(e, msg) {
			e.stopPropagation();
			jQuery("#blocMenusGD").message({
				text : msg,
				type : "error"
			});
		});
		
		self.autoCompleteIntervenants[role] = autoComplete;
		autoComplete.initialize();
		
	}
};
AutoCompleteUnic.pageUrl = function() {
	return "/demarche/detaildemarche/editdem";
};
jQuery(document).ready(function() {
	// Initialization des composants correpondants � AutoCompleteUnic
	new AutoCompleteUnic().initialize();
});

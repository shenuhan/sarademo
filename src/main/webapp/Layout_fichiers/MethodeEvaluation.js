/**
 * Constructeur
 */
function MethodeEvaluation(idMethodeEval) {
	this.idMethodeEval = idMethodeEval;
	this.datePrev = null;
	this.debutDateReelle = null;
	this.finDateReelle = null;
	this.dateReelleId = null;
	this.oldDatePrev = null;
	this.oldDebutDateReelle = null;
	this.oldFinDateReelle = null;
	
	// CONF_001
	this.messConf001 = "La modification a \351t\351 enregistr\351e.";
	// CONF_010
	this.messAddUGDD = "a \351t\351 ajout\351 \340 la liste des intervenants UGDD.";
	// CONF_011
	this.messDelUGDD = "a \351t\351 supprim\351 de la liste des intervenants UGDD.";

	// CONF_012
	this.messAddEXPERTS = "a \351t\351 ajout\351 \340 la liste des experts.";
	// CONF_013
	this.messDelEXPERTS = "a \351t\351 supprim\351 de la liste des experts.";

	// CONF_014
	this.messAddAUTRES_INTERVENANTS = "a \351t\351 ajout\351 \340 la liste des autres intervenants.";
	// CONF_015
	this.messDelAUTRES_INTERVENANTS = "a \351t\351 supprim\351 de la liste des autres intervenants.";
	
	// CONF_016
	this.messAddINTERVENANTS_CQ = "a \351t\351 ajout\351 \340 la liste des intervenants CQ.";
	// CONF_017
	this.messDelINTERVENANTS_CQ = "a \351t\351 supprim\351 de la liste des intervenants CQ.";
	
	// CONF_018
	this.messAddAUTRES_INTERVENANTS_CQ = "a \351t\351 ajout\351 \340 la liste des autres intervenants.";
	// CONF_019
	this.messDelAUTRES_INTERVENANTS_CQ = "a \351t\351 supprim\351 de la liste des autres intervenants.";
	
	this.rendreVisibleModifsUGDD = "Modifications rendues visibles pour les intervenants UGDD";
	this.rendreVisibleModifsEXPERTS = "Modifications rendues visibles pour les intervenants Expert";
	this.rendreVisibleModifsAUTRES_INTERVENANTS = "Modifications rendues visibles pour les Autres intervenants";
}



MethodeEvaluation.prototype = {
		
		initialize : function() {
			var self = this;
						
			jQuery("#divQualiteExpert_" + self.idMethodeEval + " select").change(function() {
				self.ajaxSelectQualiteIntervenant(self, "Expert");
			});
			
			jQuery("#divQualiteAutre_" + self.idMethodeEval + " select").change(function() {
				self.ajaxSelectQualiteIntervenant(self, "Autre");
			});
			
			jQuery("#rendreVisibleModifsUGDD_" + self.idMethodeEval).click(function(event) {
				event.stopPropagation();
				event.preventDefault();
				
				self.ajaxRendreVisibleModifs(self, "UGDD");
			});
			
			jQuery("#rendreVisibleModifsEXPERTS_" + self.idMethodeEval).click(function(event) {
				event.stopPropagation();
				event.preventDefault();
				
				self.ajaxRendreVisibleModifs(self, "EXPERTS");
			});
			
			jQuery("#rendreVisibleModifsAUTRES_INTERVENANTS_" + self.idMethodeEval).click(function(event) {
				event.stopPropagation();
				event.preventDefault();
				
				self.ajaxRendreVisibleModifs(self, "AUTRES_INTERVENANTS");
			});
			
			jQuery("#rendreEquipeEVComplete_1_" + self.idMethodeEval).click(function(event) {
				event.stopPropagation();
				event.preventDefault();
				
				self.ajaxRendreEquipeEVComplete(self);
			});

			jQuery("#rendreEquipeEVIncomplete_1_" + self.idMethodeEval).click(function(event) {
				event.stopPropagation();
				event.preventDefault();
				
				self.ajaxRendreEquipeEVIncomplete(self);
			});
			
			// CARAC
			self.initializeCarac(self);
			
			// DATES
			// Date prévisionnelle
			self.initializeDatePrevisionnelle(self);
			
			// Dates réelles
			
			// Ajout du comportement sur la checkbox "Discontinues"
			jQuery("#cbDatesDiscontinues_" + self.idMethodeEval).click(function(event) {
				self.handleDisplayAjoutDateReelle(self);
			});
			
			// Ajout du comportement d'ajout d'une date réelle
			jQuery("#ajouterDateReelle_" + self.idMethodeEval).click(function() {
				self.ajaxAjouterDateReelle(self);
			});
			
			self.initializeDatesReelles(self);
			
			// GESTION DES DROITS
			self.handleRights(self);
			
			self.isValidationEquipeEvEnCours(self.idMethodeEval);
			
			self.enableOnChangeJustificatifRecusation();
			
			self.initAutoCompletes(self);
		},
		
		initializeCarac : function(self) {
			
			jQuery("select[id^='caracMethodeEval__']").on("change", function(){
				
				var idMethodeEval = jQuery(this).attr("id").split("__")[1];
				var idCaracSelect = jQuery(this).val();
				self.dialogCommentaireCaracMethodeEval(self, idMethodeEval, idCaracSelect);
				
			});
			
		},
		
		initializeDatePrevisionnelle : function(self) {
			
			jQuery("#datePrev_" + self.idMethodeEval).datepicker({
				showOn: "focus",
				changeMonth: false,
			 	changeYear: false
			});
			
			jQuery("#datePrev_" + self.idMethodeEval).on("change", function(e){
				e.stopPropagation();
				e.preventDefault();
				
				self.datePrev = jQuery("#datePrev_" + self.idMethodeEval).val();				
				self.dialogCommentaire(self, 
					{	validerCommentaire : function(self, commentaire){
							result = self.ajaxMettreAJourDatePrevisionnelle(self, self.datePrev, commentaire);
							
							return result;
						},
						annulerCommentaire : function(self, commentaire){
							result = self.ajaxMettreAJourDatePrevisionnelle(self, self.datePrev, commentaire, true);
							return result;
						}
					}
				);
			});
			
			jQuery("#reset_datePrev_" + self.idMethodeEval).on("click", function(e){
				e.stopPropagation();
				e.preventDefault();
				
				jQuery("#datePrev_" + self.idMethodeEval).val("");
				
				self.dialogCommentaire(self, 
						{	validerCommentaire : function(self, commentaire){
								result = self.ajaxMettreAJourDatePrevisionnelle(self, self.datePrev, commentaire);
								return result;
							},
							annulerCommentaire : function(self, commentaire){
								result = self.ajaxMettreAJourDatePrevisionnelle(self, self.datePrev, commentaire, true);
								return result;
							}
						}
					);
			});
		},
		
		initializeDatesReelles : function(self) {
			
			var divTargetDatesReelles = jQuery("#methodeEvalDatesReellesCPP_" + self.idMethodeEval);
			
			// On vide la div cible
			divTargetDatesReelles.empty();
			
			var divsSourceDatesReelles = jQuery("#methodeEvalDatesReelles_" + self.idMethodeEval + " div[name='date_reelle']");
			
			// Mise à jour de l'état de la checkbox "Discontinues"
			if (divsSourceDatesReelles.size() <= 1) {
				jQuery("#cbDatesDiscontinues_" + self.idMethodeEval).prop("checked", false);
				jQuery("#cbDatesDiscontinues_" + self.idMethodeEval).prop("disabled", false);
			} else {
				jQuery("#cbDatesDiscontinues_" + self.idMethodeEval).prop("checked", true);
				jQuery("#cbDatesDiscontinues_" + self.idMethodeEval).prop("disabled", true);
			}
			
			// Mise à jour de l'état du bouton "Ajouter"
			self.handleDisplayAjoutDateReelle(self);
			
			divsSourceDatesReelles.each(function(index, el){
				
				var dateReelleId = jQuery("div[name='date_reelle_id']", el).text();
				var dateReelleDebut = jQuery("div[name='date_reelle_debut']", el).text();
				var dateReelleFin = jQuery("div[name='date_reelle_fin']", el).text();
				
				// Duplication du CompPeriodPicker source
				var newCppTmp = jQuery("#methodeEvalDatesReellesCPPSource_" + self.idMethodeEval).clone();
				var cppClonedId = 'methodeEvalDatesReellesCPP_' + self.idMethodeEval + '_' + dateReelleId;
				newCppTmp.attr('id', cppClonedId);
				
				// Ajout du CompPeriodPicker dupliqué au DOM
				divTargetDatesReelles.append(newCppTmp);
				
				var cpp = jQuery("#" + cppClonedId);
				
				if (index >= 1) {
					// Ajout du bouton de suppression au DOM
					var removeLink = jQuery('<img id="supprimerDateReelle_' + dateReelleId + '" name="supprimerDateReelle" src="' + SARAImgRootPath
							+ '/picto_suppr.gif" alt="Lien de supression" title="Supprimer p&eacute;riode dates r&eacute;elles" style="cursor:pointer;"/>');
					removeLink.click(function() {
						self.dateReelleId = dateReelleId;
						self.dialogCommentaire(self, 
							{	validerCommentaire : function(self, commentaire){
									result = self.ajaxSupprimerDateReelle(self, self.dateReelleId , commentaire);
									return result;
								}
							}
						);
					});
					cpp.append(removeLink);
				}
				
				// Initialization des styles CompPeriodPicker dupliqué
				cpp.attr('style', 'clear:both;');
				jQuery("#methodeEvalDatesReellesCPP_" + self.idMethodeEval + '_' + dateReelleId + " div.period_picker_wrapper")
					.attr('style', 'float:left;width:93%;');
				cpp.show();
				
				// Initialization des valeurs CompPeriodPicker dupliqué
				jQuery("#" + cppClonedId + " input[name='sDateBegin']").val(dateReelleDebut);
				jQuery("#" + cppClonedId + " input[name='sDateEnd']").val(dateReelleFin);
				
				// Initialization du CompPeriodPicker dupliqué
				Period_picker.prototype.reset = function(){
					self.dateReelleId = dateReelleId;
					self.dialogCommentaire(self, 
						{	validerCommentaire : function(self, commentaire){
								result = self.ajaxMettreAjourDateReelle(self, self.dateReelleId, self.debutDateReelle, self.finDateReelle, commentaire);
								if(result){
									jQuery("#" + cppClonedId + " input[name='sDateBegin']").val(null);
									jQuery("#" + cppClonedId + " input[name='sDateEnd']").val(null);
								}
								return result;
							},
							annulerCommentaire : function(self, commentaire){
								return  self.ajaxMettreAjourDateReelle(self, self.dateReelleId, self.debutDateReelle, self.finDateReelle, commentaire, true);
							}
						}
					);
				};
				new Period_picker(jQuery("#" + cppClonedId + " input[name='sDateBegin']"));

				var dateDebut = jQuery("#" + cppClonedId + " input[name='sDateBegin']").val();
				var dateFin = jQuery("#" + cppClonedId + " input[name='sDateEnd']").val();
				
				// Paramétrage des actions sur les composants
				// Action : Modification d'une date réelle				
				jQuery("#" + cppClonedId + " input[name='sDateBegin']").change(function() {
					
					// Récupération des valeurs de dates début / fin
					self.debutDateReelle = jQuery("#" + cppClonedId + " input[name='sDateBegin']").val();
					self.finDateReelle = jQuery("#" + cppClonedId + " input[name='sDateEnd']").val();
					
					self.dateReelleId = dateReelleId;
					
					if(dateDebut && dateFin){
						self.dialogCommentaire(self, 
								{	validerCommentaire : function(self, commentaire){
									result = self.ajaxMettreAjourDateReelle(self, self.dateReelleId, self.debutDateReelle, self.finDateReelle, commentaire);
									return result;
									},
								annulerCommentaire : function(self, commentaire){
									return  self.ajaxMettreAjourDateReelle(self, self.dateReelleId, self.debutDateReelle, self.finDateReelle, commentaire, true);
									}
								}
						);
					} else {
						self.ajaxMettreAjourDateReelle(self, self.dateReelleId, self.debutDateReelle, self.finDateReelle, "Initialisation");
					}
				});
				
				if (index >= 1) {
					// On cache la croix rouge
					jQuery("#" + cppClonedId + " a.reset").hide();
				}
				
			});
		},
		
		initializeSourcesDateReelles : function(self, datesReelles) {
			
			var divSourceDatesReelles = jQuery("#methodeEvalDatesReelles_" + self.idMethodeEval);
			
			// On vide la DIV source
			divSourceDatesReelles.empty();
			
			var html = "";
			for (var i=0; i < datesReelles.length; i++) {
				
				var dateReelle = datesReelles[i];
				
				html += '<div name="date_reelle">';
				
				html += '<div name="date_reelle_id">' + dateReelle.idDateReelle + '</div>';
				html += '<div name="date_reelle_debut">' + dateReelle.debutDateReelle + '</div>';
				html += '<div name="date_reelle_fin">' + dateReelle.finDateReelle + '</div>';
				
				html += '</div>';
			}
			
			divSourceDatesReelles.append(html);
			
		},
		
		handleDisplayAjoutDateReelle : function(self) {
			
			if (jQuery("#cbDatesDiscontinues_" + self.idMethodeEval).is(':checked')) {
				jQuery("#ajouterDateReelle_" + self.idMethodeEval).show();
			} else {
				jQuery("#ajouterDateReelle_" + self.idMethodeEval).hide();
			}
			
		},
		
		ajaxSelectQualiteIntervenant : function(self, typeQualite) {
			
			// Récupération des données pour appel AJAX
			var qualite = jQuery("#divQualite" + typeQualite + "_" + self.idMethodeEval + " select option:selected").text();
			
			// Préparation des données pour appel AJAX
			var inputData = {
				'idMethodeEval' : self.idMethodeEval,
				'qualite' : qualite
			};
			
			// Appel AJAX
			jQuery.post(
					common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxSelectQualiteIntervenant" + typeQualite + "?ajax=true", // URL
					{'dataLineObject' : JSON.stringify(inputData)}, // Data
					function(data) {} // On Success
			).fail(function(jqXHR, textStatus, errorThrown) { // On Fail
				// On remet la valeur par défaut
				jQuery("#divQualite" + typeQualite + " select").val(1);
				defaultAjaxErrorHandler(jqXHR);
			});
		},
		
		ajaxRendreVisibleModifs : function(self, typeProfil) {
			jQuery("#rendreVisibleModifs" + typeProfil + "_" + self.idMethodeEval).hide();
			jQuery("#rendreVisibleModifs" + typeProfil + "_D_" + self.idMethodeEval).show();
			// Préparation des données pour appel AJAX
			var inputData = {
				'idMethodeEval' : self.idMethodeEval
			};
			
			// Appel AJAX
			jQuery.post(
				common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxRendreVisibleModifs?role=" + typeProfil + "&ajax=true", // URL
				{'dataLineObject' : JSON.stringify(inputData)}, // Data
				function(data) { // On Success
					self.handleDisplayRendreVisibleModifs(self, typeProfil, data);
					if (data.premierRendreVisible) {
						var result = {
								'visible' : data.visibleAutreProfil,
								'enabled' : data.enabledAutreProfil
						};
						self.handleDisplayRendreVisibleModifs(self, data.typeProfil, result);
					}
					
					if (data && !data.result) {
						jQuery("#blocMenusGD").message({
							text : eval("self.rendreVisibleModifs" + typeProfil),
							type : "notification"
						});
					}

					if (data.isIntervenantsExpertsAjoutable === false) {
						jQuery("#intervenantsEXPERTS_" + self.idMethodeEval + " input").prop("disabled", true);
						jQuery("#divProfilEXPERTS_" + self.idMethodeEval + " select").prop("disabled", true);
						jQuery("#divQualiteExpert_" + self.idMethodeEval + " select").prop("disabled", true);
					}
					if (data.isIntervenantsExpertsSupprimable === false) {
						jQuery("#intervenantsEXPERTS_" + self.idMethodeEval + "_table img").hide();
					}
					
					jQuery("#intervenantsEXPERTS_" + self.idMethodeEval + "_table img[id^=accepte_]").removeAttr("onclick");
					jQuery("#intervenantsEXPERTS_" + self.idMethodeEval + "_table img[id^=refuse_]").removeAttr("onclick");
					
					var listeTd = jQuery("#intervenantsEXPERTS_" + self.idMethodeEval + "_table td");
					
					var index = 0;
					for (index; index < listeTd.length; index++) {
						var td = listeTd[index];
						if (td.id) {
							var imgRefuse = jQuery("#refuse_" + td.id);
							if (imgRefuse.attr("src") === SARAImgRootPath + "/picto_cross.png") {
								imgRefuse.parent("div").remove();
								jQuery("#justificatif_" + td.id).remove();
							} else {
								td.remove();
							}
						}
					}
				} 
			).fail(function(jqXHR, textStatus, errorThrown) { // On Fail
				jQuery("#rendreVisibleModifs" + typeProfil + "_" + self.idMethodeEval).show();
				jQuery("#rendreVisibleModifs" + typeProfil + "_D_" + self.idMethodeEval).hide();
				defaultAjaxErrorHandler(jqXHR);
			});
		},
		
		ajaxRendreEquipeEVComplete : function(self) {
			
			// Préparation des données pour appel AJAX
			var inputData = {
				'idMethodeEval' : self.idMethodeEval
			};
			
			// Appel AJAX
			jQuery.post(
				common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxRendreEquipeEVComplete?ajax=true", // URL
				{'dataLineObject' : JSON.stringify(inputData)}, // Data
				function(data) { // On Success
					if (data && data.equipeEVComplete) {
						jQuery("#rendreEquipeEVComplete_1_" + self.idMethodeEval).hide();
						jQuery("#rendreEquipeEVIncomplete_1_" + self.idMethodeEval).show();
						
						// GESTION DES DROITS
						self.handleRights(self);
					}
				} 
			).fail(function(jqXHR, textStatus, errorThrown) { // On Fail
				defaultAjaxErrorHandler(jqXHR);
			});
		},

		ajaxRendreEquipeEVIncomplete : function(self) {
			
			// Préparation des données pour appel AJAX
			var inputData = {
				'idMethodeEval' : self.idMethodeEval
			};
			
			// Appel AJAX
			jQuery.post(
				common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxRendreEquipeEVIncomplete?ajax=true", // URL
				{'dataLineObject' : JSON.stringify(inputData)}, // Data
				function(data) { // On Success
					if (data && !data.equipeEVComplete) {
						jQuery("#rendreEquipeEVComplete_1_" + self.idMethodeEval).show();
						jQuery("#rendreEquipeEVIncomplete_1_" + self.idMethodeEval).hide();
						
						// GESTION DES DROITS
						self.handleRights(self);
					}
				}
			).fail(function(jqXHR, textStatus, errorThrown) { // On Fail
				defaultAjaxErrorHandler(jqXHR);
			});
		},
		
		ajaxIsRendreVisibleModifs : function(self, typeProfil) {
			// Préparation des données pour appel AJAX
			var inputData = {
				'idMethodeEval' : self.idMethodeEval
			};
			
			// Appel AJAX
			jQuery.post(
				common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxIsRendreVisibleModifs" + typeProfil + "?ajax=true", // URL
				{'dataLineObject' : JSON.stringify(inputData)}, // Data
				function(data) { // On Success
					self.handleDisplayRendreVisibleModifs(self, typeProfil, data);
					if (data.premierRendreVisible) {
						var result = {
								'visible' : data.visibleAutreProfil,
								'enabled' : data.enabledAutreProfil
						};
						self.handleDisplayRendreVisibleModifs(self, data.typeProfil, result);
					}
				}
			).fail(function(jqXHR, textStatus, errorThrown) { // On Fail
				defaultAjaxErrorHandler(jqXHR);
			});
		},
		
		handleDisplayRendreVisibleModifs : function(self, typeProfil, data) {
			if (data) {
				if (data.visible) {
					if (data.enabled) {
						jQuery("#rendreVisibleModifs" + typeProfil + "_D_" + self.idMethodeEval).hide();
						jQuery("#rendreVisibleModifs" + typeProfil + "_" + self.idMethodeEval).show();
					} else {
						jQuery("#rendreVisibleModifs" + typeProfil + "_" + self.idMethodeEval).hide();
						jQuery("#rendreVisibleModifs" + typeProfil + "_D_" + self.idMethodeEval).show();
					}
				} else {
					jQuery("#rendreVisibleModifs" + typeProfil + "_D_" + self.idMethodeEval).hide();
					jQuery("#rendreVisibleModifs" + typeProfil + "_" + self.idMethodeEval).hide();
				}
			}
		},
		
		/**
		 * Appel Ajax pour mettre a jour la date previsionnelle.
		 * 
		 * @param self: instance de l'objet meme.
		 * @param datePrev: date prev.
		 * @param commentaire: commentaire saisi par l'utilisateur.
		 * @param isNoDisplayError: true pour ne pas afficher les erreur.
		 * @return true si la reponse retournee par le serveur ne comporte pas d'erreur.
		 */
		ajaxMettreAJourDatePrevisionnelle : function(self, datePrev, commentaire, isNoDisplayError) {
			var traitementOK = false;
			
			// Préparation des données pour appel AJAX
			var inputData = {
				'idMethodeEval' : self.idMethodeEval,
				'datePrev' : datePrev,
				'commentaire' : commentaire
			};
			
			// Appel AJAX
			jQuery.post(
				common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxMettreAJourDatePrevisionnelle?ajax=true", // URL
				{'dataLineObject' : JSON.stringify(inputData)}, // Data
				function(data) { // On Success
					
					if(isNoDisplayError == undefined || isNoDisplayError == false){
						if (data.error) {
							jQuery("#blocMenusGD").message({
								text : data.error,
								type : "warning"
							});
						}else{
							jQuery("#blocMenusGD").message({
								text : self.messConf001,
								type : "notification"
							});
						}
					}
					
					jQuery("#datePrev_" + self.idMethodeEval).val(data.datePrev);
					if(data.error == undefined || data.error == null){
						traitementOK = true;
						jQuery("#dateTitre" + self.idMethodeEval).html(data.strDateMethode);
					}
				} 
			).fail(function(jqXHR, textStatus, errorThrown) { // On Fail
				defaultAjaxErrorHandler(jqXHR);
			});
			return traitementOK;
		},
		
		ajaxAjouterDateReelle : function(self) {
			// Préparation des données pour appel AJAX
			var inputData = {
				'idMethodeEval' : self.idMethodeEval
			};
			
			// Appel AJAX
			jQuery.post(
				common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxAjouterDateReelle?ajax=true", // URL
				{'dataLineObject' : JSON.stringify(inputData)}, // Data
				function(data) { // On Success
					
					if (data.error) {
						jQuery("#blocMenusGD").message({
							text : data.error,
							type : "warning"
						});
					}else{
						jQuery("#blocMenusGD").message({
							text : self.messConf001,
							type : "notification"
						});
					}
					
					self.handleDisplayNbJoursOuvres(self, data.nbJoursOuvres);
					self.initializeSourcesDateReelles(self, data.datesReelles);
					self.initializeDatesReelles(self);
					
					// GESTION DES DROITS
					self.handleRights(self);
				}
			).fail(function(jqXHR, textStatus, errorThrown) { // On Fail
				defaultAjaxErrorHandler(jqXHR);
			});
		},
		
		/**
		 * Appel Ajax pour mettre a jour la date reelle.
		 * 
		 * @param self: instance de l'objet meme.
		 * @param idDateReelle: identifiant de la date reelle.
		 * @param debutDateReelle: date de debut.
		 * @param finDateReelle: fin de la date reelle.
		 * @param commentaire: commentaire saisi par l'utilisateur.
		 * @param isNoDisplayError: true pour ne pas afficher les erreur.
		 * @return true si la reponse retournee par le serveur ne comporte pas d'erreur.
		 */
		ajaxMettreAjourDateReelle : function(self, idDateReelle, debutDateReelle, finDateReelle, commentaire, isNoDisplayError) {
			var traitementOK = false;
			// Préparation des données pour appel AJAX
			var inputData = {
				'idMethodeEval' : self.idMethodeEval,
				'idDateReelle' : idDateReelle,
				'debutDateReelle' : debutDateReelle,
				'finDateReelle' : finDateReelle,
				'commentaire' : commentaire
			};
			
			// Appel AJAX
			jQuery.post(
				common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxMettreAjourDateReelle?ajax=true", // URL
				{'dataLineObject' : JSON.stringify(inputData)}, // Data
				function(data) { // On Success
					
					if(isNoDisplayError== undefined || isNoDisplayError == false){
						if (data.error) {
							jQuery("#blocMenusGD").message({
								text : data.error,
								type : "warning"
							});
						}else{
							jQuery("#blocMenusGD").message({
								text : self.messConf001,
								type : "notification"
							});
						}
					}
					
					self.handleDisplayNbJoursOuvres(self, data.nbJoursOuvres);
					self.initializeSourcesDateReelles(self, data.datesReelles);
					self.initializeDatesReelles(self);
					
					// GESTION DES DROITS
					self.handleRights(self);

					if(data.error == undefined || data.error == null){
						traitementOK = true;
						jQuery("#dateTitre" + self.idMethodeEval).html(data.strDateMethode);
					}
				} 
			).fail(function(jqXHR, textStatus, errorThrown) { // On Fail
				defaultAjaxErrorHandler(jqXHR);
			});
			return traitementOK;
		},
		
		/**
		 * Appel Ajax pour mettre a jour la date reelle apres une suppression.
		 * 
		 * @param self: instance de l'objet meme.
		 * @param idDateReelle: identifiant de la date reelle.
		 * @param commentaire: commentaire saisi par l'utilisateur.
		 * @return true si la reponse retournee par le serveur ne comporte pas d'erreur.
		 */
		ajaxSupprimerDateReelle : function(self, idDateReelle, commentaire) {
			
			// Préparation des données pour appel AJAX
			var inputData = {
				'idMethodeEval' : self.idMethodeEval,
				'idDateReelle' : idDateReelle,
				'commentaire' : commentaire
			};
			
			// Appel AJAX
			jQuery.post(
				common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:ajaxSupprimerDateReelle?ajax=true", // URL
				{'dataLineObject' : JSON.stringify(inputData)}, // Data
				function(data) { // On Success
					
					if (data.error) {
						jQuery("#blocMenusGD").message({
							text : data.error,
							type : "warning"
						});
					}else{
						jQuery("#blocMenusGD").message({
							text : self.messConf001,
							type : "notification"
						});
					}
					
					self.handleDisplayNbJoursOuvres(self, data.nbJoursOuvres);
					self.initializeSourcesDateReelles(self, data.datesReelles);
					self.initializeDatesReelles(self);
					
					// GESTION DES DROITS
					self.handleRights(self);
					
					if(data.error == undefined || data.error == null){
						traitementOK = true;
						jQuery("#dateTitre" + self.idMethodeEval).html(data.strDateMethode);
					}
				} 
			).fail(function(jqXHR, textStatus, errorThrown) { // On Fail
				defaultAjaxErrorHandler(jqXHR);
			});
			return traitementOK;
		},
		
		handleDisplayNbJoursOuvres : function(self, nbJoursOuvres) {
			
			jQuery("#nbJoursOuvres_" + self.idMethodeEval).html(nbJoursOuvres + " jours ouvr\351s");
			
		},
		
		handleRights : function (self) {
			// Gestion des droits sur le partie "Intervenants"
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='AJO_UGDD']").text() !== 'true') {
				jQuery("#intervenantsUGDD_" + self.idMethodeEval + " input").prop("disabled", true);
				jQuery("#divProfilUGDD_" + self.idMethodeEval + " select").prop("disabled", true);
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='SUP_UGDD']").text() !== 'true') {
				jQuery("#intervenantsUGDD_divMACTable_" + self.idMethodeEval + " img").hide();
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='VISIB_UGDD']").text() !== 'true') {
				jQuery("#rendreVisibleModifsUGDD_" + self.idMethodeEval).hide();
				jQuery("#rendreVisibleModifsUGDD_D_" + self.idMethodeEval).hide();
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='AJO_EXPERTS']").text() !== 'true') {
				jQuery("#intervenantsEXPERTS_" + self.idMethodeEval + " input").prop("disabled", true);
				jQuery("#divProfilEXPERTS_" + self.idMethodeEval + " select").prop("disabled", true);
				jQuery("#divQualiteExpert_" + self.idMethodeEval + " select").prop("disabled", true);
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='SUP_EXPERTS']").text() !== 'true') {
				jQuery("#intervenantsEXPERTS_" + self.idMethodeEval + "_table img").hide();
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='VISIB_EXPERTS']").text() == "true") {
				self.ajaxIsRendreVisibleModifs(self, "EXPERTS");
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='COMP_EXPERTS']").text() !== 'true') {
				jQuery("#rendreEquipeEVComplete_1_" + self.idMethodeEval).prop("disabled", true);
				jQuery("#rendreEquipeEVComplete_1_" + self.idMethodeEval).css("cursor", "default");
				jQuery("#rendreEquipeEVIncomplete_1_" + self.idMethodeEval).prop("disabled", true);
				jQuery("#rendreEquipeEVIncomplete_1_" + self.idMethodeEval).css("cursor", "default");
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='AJO_AUTRES']").text() !== 'true') {
				jQuery("#intervenantsAUTRES_INTERVENANTS_" + self.idMethodeEval + " input").prop("disabled", true);
				jQuery("#intervenantsAUTRES_INTERVENANTS_CQ_" + self.idMethodeEval + " input").prop("disabled", true);
				jQuery("#divProfilAUTRES_INTERVENANTS_" + self.idMethodeEval + " select").prop("disabled", true);
				jQuery("#divProfilAUTRES_INTERVENANTS_CQ_" + self.idMethodeEval + " select").prop("disabled", true);
				jQuery("#divQualiteAutre_" + self.idMethodeEval + " select").prop("disabled", true);
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='SUP_AUTRES']").text() !== 'true') {
				jQuery("#intervenantsAUTRES_INTERVENANTS_" + self.idMethodeEval + "_table img").hide();
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='VISIB_AUTRES']").text() !== 'true') {
				jQuery("#rendreVisibleModifsAUTRES_INTERVENANTS_" + self.idMethodeEval).hide();
				jQuery("#rendreVisibleModifsAUTRES_INTERVENANTS_D_" + self.idMethodeEval).hide();
			}
			
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='AJO_CQ']").text() !== 'true') {
				jQuery("#intervenantsINTERVENANTS_CQ_" + self.idMethodeEval + " input").prop("disabled", true);
				jQuery("#divProfilINTERVENANTS_CQ_" + self.idMethodeEval + " select").prop("disabled", true);				
			}
			
			// Gestion des droits sur la partie "Dates"
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='DAT_PREV_MET']").text() !== 'true') {
				jQuery("#datePrev_" + self.idMethodeEval).attr("disabled","disabled");
				jQuery("#reset_datePrev_" + self.idMethodeEval).hide();
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='DAT_REEL_MET']").text() !== 'true') {
				jQuery("#methodeEvalDatesReellesCPP_"+ self.idMethodeEval+" .period_picker_wrapper input").attr("disabled","disabled");
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='SUP_PERIO_MET']").text() !== 'true') {
				jQuery("#methodeEvalDatesReellesCPP_" + self.idMethodeEval + " img[name='supprimerDateReelle']").hide();
				jQuery("#methodeEvalDatesReellesCPP_" + self.idMethodeEval + " a.reset").hide();
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='DIS_PERIO_MET']").text() !== 'true') {
				jQuery("#cbDatesDiscontinues_label_" + self.idMethodeEval).hide();
				jQuery("#cbDatesDiscontinues_" + self.idMethodeEval).hide();
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='AJO_DAT_REEL_MET']").text() !== 'true') {
				jQuery("#ajouterDateReelle_" + self.idMethodeEval).hide();
			}
		},
		
		addIntervenant : function (typeProfil) {
			var selfMethodeEval = this;
			var intervenantField = jQuery('#intervenants' + typeProfil + '_' + this.idMethodeEval + ' > input');
			var profilField = jQuery('#divProfil'+ typeProfil + '_' + this.idMethodeEval + ' > select');
			var Url;
			if (typeProfil == "INTERVENANTS_CQ" || typeProfil == "AUTRES_INTERVENANTS_CQ"){
				Url = common.getBaseUrl()+ "/demarche/detaildemarche/MethodeEvaluationCQ:addIntervenant?role=" + typeProfil + "&ajax=true&idMethodeEval=" + selfMethodeEval.idMethodeEval;
			}else{
				Url = common.getBaseUrl() + MethodeEvaluation.pageUrl() + ":addIntervenant?role=" + typeProfil + "&ajax=true&idMethodeEval=" + selfMethodeEval.idMethodeEval;
			}
			if (intervenantField.val() && profilField.val()) {
				jQuery.ajax({
					type : "POST",
					
					url : Url,
					data : {
						ajax : true,
						intervenant : intervenantField.val(),
						profil : profilField.val()
					},
					success : function(data, textStatus, jqXHR) {
						selfMethodeEval.autoCompleteIntervenants[data['role']].renderResultZone(data["liste"]);
						jQuery("#blocMenusGD").message({
							text: data['intervenant'] + " " + eval("selfMethodeEval.messAdd" + data['role']),
							type: "notification"
						});
						selfMethodeEval.ajaxIsRendreVisibleModifs(selfMethodeEval, data['role']);
						
						// GESTION DES DROITS
						selfMethodeEval.handleRights(selfMethodeEval);
						intervenantField.val('');
						profilField.val('');
						
						// GESTION DE LA QUALITE (RAZ)
						var qualite = jQuery("#divQualiteAutre_"+selfMethodeEval.idMethodeEval+" select[name='qualiteAutreIntervenant']").val();
						if (qualite != 0){
							jQuery("#divQualiteAutre_"+selfMethodeEval.idMethodeEval+" select[name='qualiteAutreIntervenant']").val(0);
						}
					},
					error : function(jqXHR) {
						defaultAjaxErrorHandler(jqXHR, {type :"error"});
					}
				});
			} 
		},
		
		initAutoComplete : function(role) {
			var isIntervenantExpert = false;
			var removable = false;
			var pageUrl;
			
			if ((role == "UGDD" && jQuery("#SUP_UGDD").text() === "true") || ((role == "AUTRES_INTERVENANTS" || role == "AUTRES_INTERVENANTS_CQ") && jQuery("#SUP_AUTRES").text() === "true") || (role == "INTERVENANTS_CQ" && jQuery("#SUP_CQ").text() === "true")) {
				removable = true;
			} else if (role == "EXPERTS") {
				isIntervenantExpert = true;
				if (jQuery("#SUP_EXPERTS").text() === "true") {
					removable = true;
				}
			}
			
			var self = this;
			var multiAutoCompleteConfig = {"removable": removable, "minLength": 2};
			var autoComplete;
			var idInput = 'intervenants' + role + "_" + this.idMethodeEval;
			
			if (role == 'INTERVENANTS_CQ' || role == 'AUTRES_INTERVENANTS_CQ'){
				pageUrl = "/demarche/detaildemarche/MethodeEvaluationCQ:autocompleteIntervenants?role="+ role + "&idMethodeEval=" + this.idMethodeEval;
			} else {
				pageUrl = MethodeEvaluation.pageUrl() + ":autocompleteIntervenants?role="+ role + "&idMethodeEval=" + this.idMethodeEval;
			}
			
			// Récupération des données pour appel AJAX
			autoComplete = new CompMultiAutoComplete(idInput, multiAutoCompleteConfig, {}, removable, pageUrl, isIntervenantExpert);
			
			if (role == 'AUTRES_INTERVENANTS_CQ'){
				jQuery("#" + idInput + " > input").on("autocompleteselect", function(event, data){
					var intervenantSelectionne = data.item.value;
					
					jQuery.ajax({
						type : "POST",
						url : common.getBaseUrl() +"/demarche/detaildemarche/MethodeEvaluationCQ:afficherQualiteHas?idMethodeEval=" + self.idMethodeEval + "&ajax=true",
						data : {
							ajax : true,
							intervenant : intervenantSelectionne
						},
						success : function(data, textStatus, jqXHR) {	
							if (data['catUtil'] == "HAS"){
								var valueSelected = null;
								jQuery("#divQualiteAutre_"+self.idMethodeEval+" select[name='qualiteAutreIntervenant'] option").each(function (i, option) {
									if(option.text == "HAS"){
										valueSelected = option.value;
									}
					            });							
								jQuery("#divQualiteAutre_"+self.idMethodeEval+" select[name='qualiteAutreIntervenant']").val(valueSelected);
							}
						},
						error : function(jqXHR) {
							defaultAjaxErrorHandler(jqXHR, {type :"error"});
						}
					});
				});
			}
			
			// Patch pour ajouter la qualité dans l'autoComplete.
			autoComplete.selectItem = function (event, ui) {
				event.stopPropagation();
				event.preventDefault();
				jQuery(this).val(ui.item.value);
				var role = jQuery(this).attr('role');
				var profil =  jQuery('#divProfil' + role  + '_' + self.idMethodeEval + ' > select');
				if (profil.val()) {
					self.addIntervenant(role);
				} 
			};

			autoComplete.inputField.on("detach", function (e, selected){
				e.stopPropagation();
				jQuery("#blocMenusGD").message({
					text: selected + " " + eval("self.messDel" + role),
					type: "notification"
				});
				self.ajaxIsRendreVisibleModifs(self, role);
				// GESTION DES DROITS
				self.handleRights(self);
			});
			
			autoComplete.inputField.on("warning", function (e, msg){
				e.stopPropagation();
				jQuery("#blocMenusGD").message({
					text: msg,
					type: "warning"
				});
			});
			
			autoComplete.inputField.on("error", function (e, msg){
				e.stopPropagation();
				jQuery("#blocMenusGD").message({
					text: msg,
					type: "error"
				});
			});
			
			
			self.autoCompleteIntervenants[role] = autoComplete;
			autoComplete.initialize();
			autoComplete.inputField.autocomplete("option", "source", function(request, response) {
				var qualite = jQuery("#divQualiteAutre_" + self.idMethodeEval + " select option:selected").text();
				jQuery.ajax({
					url : autoComplete.url,
					dataType : "json",
					type : "POST",
					data : {
						term : request.term,
						qualite : qualite,
						ajax : true
					},
					success : function(data, textStatus, jqXHR) {
						autoComplete.triggerError(data, jqXHR, function(data) {
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
						var msg = decodeURI(jqXHR.getResponseHeader("ErrorMessage"));
						jQuery(autoComplete.inputField).trigger("error", msg);
						response([]);
					}
				});
			});
			
			var profilSelect = jQuery("#intervenants" + role + "_" + this.idMethodeEval).closest('form').find("select[role='" + role + "']");
			profilSelect.on("change", function() {
				if (jQuery(this).val()) {
					self.addIntervenant(jQuery(this).attr('role'));
				}
			});			
		},		
		
		initAutoCompletes : function(self) {
			var self = this;
			var ajaxCallUrl;
			this.autoCompleteIntervenants = {};			
			self.initAutoComplete('UGDD');
			self.initAutoComplete('EXPERTS');
			self.initAutoComplete('AUTRES_INTERVENANTS');		
			self.initAutoComplete('INTERVENANTS_CQ');		
			self.initAutoComplete('AUTRES_INTERVENANTS_CQ');
			
			jQuery.ajax({
				type : "POST",
				url : common.getBaseUrl() + MethodeEvaluation.pageUrl() + ":ajaxGetTypeVisite?idMethodeEval=" + self.idMethodeEval + "&ajax=true",
				data : {
					ajax : true,
					idMethodeEval : self.idMethodeEval
				},
				success : function(data, textStatus, jqXHR) {	
					getIntervenantInit(data["idTypeVisite"]);
				},
				error : function(jqXHR) {
					defaultAjaxErrorHandler(jqXHR, {type :"error"});
				}
			});
			
			function getIntervenantInit(idTypeVisite){
				switch (idTypeVisite) {
					case 0:
						defaultAjaxErrorHandler(jqXHR, {type :"error"});
						break;
					case 21:
						ajaxCallUrl = common.getBaseUrl() + "/demarche/detaildemarche/MethodeEvaluationCQ:ajaxGetIntervenantInit?idMethodeEval=" + self.idMethodeEval + "&ajax=true";
						break;
					default:
						ajaxCallUrl = common.getBaseUrl() + MethodeEvaluation.pageUrl() + ":ajaxGetIntervenantInit?idMethodeEval=" + self.idMethodeEval + "&ajax=true";
					break;
				}
				
				// Initialisation des listes
				jQuery.ajax({
					type : "POST",
					url : ajaxCallUrl,
					data : {
						ajax : true,
						idMethodeEval : self.idMethodeEval
					},
					success : function(data, textStatus, jqXHR) {	
						self.autoCompleteIntervenants['UGDD'].renderResultZone(data['UGDD']);
						self.autoCompleteIntervenants['EXPERTS'].renderResultZone(data['EXPERTS']);
						self.autoCompleteIntervenants['AUTRES_INTERVENANTS'].renderResultZone(data['AUTRES_INTERVENANTS']);
						self.autoCompleteIntervenants['INTERVENANTS_CQ'].renderResultZone(data['INTERVENANTS_CQ']);
						self.autoCompleteIntervenants['AUTRES_INTERVENANTS_CQ'].renderResultZone(data['AUTRES_INTERVENANTS_CQ']);
						// demarche a desactiver
						if (jQuery("#DEMARCHE_ACTIVEE").text() !== "true") {
							jQuery('div#methodesEvals').find('img[src$="picto_suppr.gif"]').each(function(i, element) {
								jQuery(element).hide();
							});
						}
						self.handleRightsForRecusation(self.idMethodeEval);
						self.handleRightsForDeleteIntervenant(self.idMethodeEval);
						if (jQuery("#methodeEvalDatesReelles_rights_" + self.idMethodeEval + " div[id='SUP_CQ']").text() !== 'true') {
							jQuery("#intervenantsINTERVENANTS_CQ_" + self.idMethodeEval + "_table img").hide();				
						}
					},
					error : function(jqXHR) {
						defaultAjaxErrorHandler(jqXHR, {type :"error"});
					}
				});
			}
		},
		
		isValidationEquipeEvEnCours : function(idMethodeEval) {
			// Préparation des données pour appel AJAX
			var inputData = {
				'idMethodeEval' : idMethodeEval
			};
			
			// Appel AJAX
			jQuery.post(
					common.getBaseUrl() + "/demarche/detaildemarche/methodeevaluation:isValidationEquipeEvEnCours?ajax=true", // URL
					{'dataLineObject' : JSON.stringify(inputData)}, // Data
					function (data) { // On Success
						if (data.result) {
							jQuery("#intervenantsExpert_" + idMethodeEval + " input").prop("disabled", true);
							jQuery("#intervenantsExpert_divMACTable_" + idMethodeEval + " img").hide();
						}
					}
			).fail(function(jqXHR, textStatus, errorThrown) { // On Fail
				// On récupère et affiche le message d'erreur
				var msg = decodeURI(jqXHR.getResponseHeader("ErrorMessage"));
				jQuery("#blocMenusGD").message({
					text : msg,
					type : "warning"
				});
			});
		},
		
		enableOnChangeJustificatifRecusation : function() {
			var collection = jQuery("[id^=justificatif_]");
			jQuery.each(collection, function(indexInArray, valueOfElement) {
				var idAssoDemarcheIntervenantNonVisible = valueOfElement.attributes['id'].value.split("_")[1];
				jQuery('textarea', '#justificatif_' + idAssoDemarcheIntervenantNonVisible).on("change", function(e){
					var data = {
							'justificatifRecusation' : this.value
					};
					jQuery.post(
							common.getBaseUrl() + "/demarche/detailDemarche/MethodeEvaluation:saveJustificatifRecusation/" + idAssoDemarcheIntervenantNonVisible + "?ajax=true",
							{'dataObject' : JSON.stringify(data)},
							function(data) {}
					);
				});
			});
		},
		
		handleRightsForRecusation : function(idMethodeEval) {
			if (jQuery("#methodeEvalDatesReelles_rights_" + idMethodeEval + " div[id='VALIDER_RECUSATION']").text() !== 'true') {
				jQuery('#intervenantsEXPERTS_' + idMethodeEval + '_table img[id^="accepte_"]').hide();
			}
			if (jQuery("#methodeEvalDatesReelles_rights_" + idMethodeEval + " div[id='REFUSER_RECUSATION']").text() !== 'true') {
				jQuery('#intervenantsEXPERTS_' + idMethodeEval + '_table img[id^="refuse_"]').hide();
				jQuery('#intervenantsEXPERTS_' + idMethodeEval + '_table textarea').hide();
			}	
			if (jQuery("#methodeEvalDatesReelles_rights_" + idMethodeEval + " div[id='COMMENTAIRES_RECUSATION']").text() !== 'true') {
				jQuery('#intervenantsEXPERTS_' + idMethodeEval + '_table img[id^="commentaires_"]').hide();
			}
		},
		/**
		 * Desactive le bouton de suppresion des intervenant si l'utilisateur ne dispose pas des droits.
		 * @param idMethodeEval: identifiant de la methode d'evaluation concernee.
		 */
		handleRightsForDeleteIntervenant : function(idMethodeEval){
			if ( jQuery("#methodeEvalDatesReelles_rights_"+idMethodeEval+" div[id='SUP_EXPERTS']").text() == 'false' ) {
				jQuery('#intervenantsEXPERTS_' + idMethodeEval + '_table img[id^="idAssoDemarcheIntervenant_"]').hide();
			}
		},
		
		/**
		 * Methode permettant d'afficher la popup de saisie de commentaire pour les dates reeles et dates  previsionelle.
		 * 
		 * @param self: instance de l'objet courrante.
		 */
		dialogCommentaire : function(self, actions){
			var commentairePopup = self.findOrCreateCommentairePopup();
			var content = jQuery("<textarea id='commentaireModifDate' rows='5' cols='50' style='resize: none; padding : 3%;'>");
			commentairePopup.empty().append(content);
			commentairePopup.dialog({
				width: 500,
				resizable : false,
				draggable : false,
				modal : true,
				dialogClass : "dialogbox",
				closeOnEscape: false,
				buttons : [ {
					name : "bt_vert",
					text : "Valider",
					click : function() {
						var commentaire = jQuery('#commentaireModifDate').val();
						if(actions.validerCommentaire){
							jQuery.ajaxSetup({async: false});
							if(actions.validerCommentaire(self, commentaire)){
								jQuery(this).dialog("close");
							}
							jQuery.ajaxSetup({async: true});
						}else{
							jQuery(this).dialog("close");
						}
					}
				}, {
					name : "bt_rouge",
					text : "Annuler",
					click : function() {
						if(actions.annulerCommentaire){
							jQuery.ajaxSetup({async: false});
							actions.annulerCommentaire(self, null);
							jQuery.ajaxSetup({async: true});
						}
						jQuery(this).dialog("close");
					}
				} ],
				open: function(event, ui) {
			    	   	jQuery(this).closest('.ui-dialog').find('.ui-dialog-buttonpane').css({'text-align' : 'center'});
			    	   	jQuery(this).closest('.ui-dialog').find('.ui-dialog-buttonset').css({'float' : 'none'});
				},
				close: function(event, ui){
					self.clear(self);
				}
			});
		},
		
		/**
		 * Methode permettant d'afficher la popup de saisie de commentaire pour la caractéristique de la méthode d'éval
		 * 
		 * @param self: instance de l'objet courrante.
		 */
		dialogCommentaireCaracMethodeEval : function(self, idMethodeEval, idCaracSelect){
			var commentairePopup = self.findOrCreateCommentairePopup();
			var content = jQuery("<textarea id='commentaireModifCaracMethodeEval' rows='5' cols='50' style='resize: none; padding : 3%;'>");
			commentairePopup.empty().append(content);
			commentairePopup.dialog({
				width: 500,
				resizable : false,
				draggable : false,
				modal : true,
				dialogClass : "dialogbox",
				closeOnEscape: false,
				buttons : [ {
					name : "bt_vert",
					text : "Valider",
					click : function() {
							
							var commentaire = jQuery('#commentaireModifCaracMethodeEval').val();
							
							// Vérification du commentaire
							if (commentaire == ""){
								jQuery("#blocMenusGD").message({
									text : "Le commentaire est obligatoire",
									type : "warning"
								});
								return;
							}
							
							var dataObject = {
								'idMethodeEval' : idMethodeEval,
								'idCarac' : idCaracSelect,
								'commentaire' : commentaire
							};
							
							var dialogActive = jQuery(this);
							
							jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/editdem:ajaxSauverCaracteristique?ajax=true", {
								'dataObject' : JSON.stringify(dataObject)
							}, function(resultData) {
								
								jQuery("#blocMenusGD").message({
									text : "Caractéristique sauvegardée",
									type : "notification"
								});
								
								dialogActive.dialog("close");
								
							}).fail(function(jqXHR) {
								defaultAjaxErrorHandler(jqXHR, {
									type : "error"
								});
							});
						
					}
				}, {
					name : "bt_rouge",
					text : "Annuler",
					click : function() {
						
						// Je restaure la caractéristique
							var dataObject = {
								'idMethodeEval' : idMethodeEval,
							};
							
							jQuery.post(common.getBaseUrl() + "/demarche/detaildemarche/editdem:ajaxGetCaracteristiqueByIdMethodeEval?ajax=true", {
								'dataObject' : JSON.stringify(dataObject)
							}, function(resultData) {
								
								jQuery('#caracMethodeEval__' + idMethodeEval + '>option[value="' + resultData.id + '"]').prop('selected', true);
								
							}).fail(function(jqXHR) {
								defaultAjaxErrorHandler(jqXHR, {
									type : "error"
								});
							});
						
						jQuery(this).dialog("close");
					}
				} ],
				open: function(event, ui) {
			    	   	jQuery(this).closest('.ui-dialog').find('.ui-dialog-buttonpane').css({'text-align' : 'center'});
			    	   	jQuery(this).closest('.ui-dialog').find('.ui-dialog-buttonset').css({'float' : 'none'});
				},
				close: function(event, ui){
					self.clear(self);
				}
			});
		},
		
		/**
		 * Fonction creant la base de la popup de saisie de commentaire.
		 * La popup est recuperee si elle existe sinon elle est creee.
		 */
		findOrCreateCommentairePopup : function() {
			var commentairePopup = jQuery('div#dialog-commentaire');
			if (commentairePopup == null || commentairePopup.length === 0) {
				commentairePopup = jQuery("<div/>", {
					id : 'dialog-commentaire',
					title : 'Commentaire'
				}).appendTo("body");
			}
			return commentairePopup;
		},
		
		
		/**
		 * Nettoi l'objet (remet les champs dates... a null).
		 * @param: self instance de l'objet meme.
		 */
		clear : function(self){
			self.datePrev = null;
			self.debutDateReelle = null;
			self.finDateReelle = null;
			self.dateReelleId = null;
			self.oldDatePrev = null;
			self.oldDebutDateReelle = null;
			self.oldFinDateReelle = null;
		}
};

MethodeEvaluation.pageUrl = function () {
	return "/demarche/detaildemarche/methodeevaluation";
};


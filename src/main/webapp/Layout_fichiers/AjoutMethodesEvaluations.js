/**
 *  AjoutMethodesEvaluations.js
 *  Fichier javascript de la page AjoutMethodesEvaluations.tml.
 */

/**
 * Constructeur
 */
function AjoutMethodesEvaluations() {}



/**
 * Methodes de l'objet AjoutMethodesEvaluations.
 */
AjoutMethodesEvaluations.prototype = {
		
		initialize : function () {
			var self = this;
			
			self.resetDatePrevisionnelle();
			
			jQuery("input[name='datePrevisionnelleTxt']").datepicker({
				showOn: "focus",
				changeMonth: false,
			 	changeYear: false
			});
			
			jQuery("#resetDatePrevisionnelle").on("click", function(e){
				e.stopPropagation();
				e.preventDefault();
				self.resetDatePrevisionnelle(e);
			});
			
			//Configuration du CompPeriodPicker
			if (!self.periodPicker) {
				self.periodPicker = new Period_picker(jQuery("#popUpAjouterMethodeEvaluation div.period_picker_wrapper input[name='sDateBegin']"));
			}
			
			// Remplissage des valeurs du champ caractéristique selon la méthode d'éval selectionnée
			jQuery("select[id^='typeVisite:']").on("change", function(){
				
				var idTypeViste = jQuery(this).val();
				var itemDivSelect = jQuery("#content_carac");
				var itemSelectCarac = jQuery("#selectCaracMethEval");
				
				if (idTypeViste){
					
					// J'affiche, si ce n'est pas déja le cas, le select des caractéristiques
					if (itemDivSelect.hasClass("hidden")){
						itemDivSelect.removeClass("hidden");
					}
				
					jQuery.post(common.getBaseUrl()	+ "/demarche/detaildemarche/ajoutMethodesEvaluations:ajaxRecupererCaracMethodeEvalByTypeVisite?ajax=true",
							{
								'idTypeVisite' : idTypeViste
							},
							function(data) {
								
								itemSelectCarac.empty();
								
								var optionVide = new Option("", "");
								itemSelectCarac.append(jQuery(optionVide));
								
								// Puis les valeurs dans la liste retournée
								jQuery.each(data.listeCarac, function(index, item){
									var option = new Option(item.libelle, item.id);
									itemSelectCarac.append(jQuery(option));
								});
								
							});
					
				} else {
					// Dans le cas ou c'est vide, je dois cacher le champ "Caractéristique" et le vider
					if (!itemDivSelect.hasClass("hidden")){
						itemDivSelect.addClass("hidden");
						itemSelectCarac.empty();
					}
				}
				
			});
			
			
				
				
		},
		
		
		/**
		 * Reset date previsionnelle
		 * 
		 */
		resetDatePrevisionnelle : function (event)
		{
			jQuery("input[name='datePrevisionnelleTxt']").val("");
		},
		
		/**
		 * Controles de surfaces
		 */
		ajaxControlesSurfaces: function (){
			var isOk = true;
			jQuery(".message").each(function(){this.remove();});
			
			//On controle la méthode, elle est obligatoire
			if(jQuery("select[name='typeVisite']").val() == ""){
				jQuery("#popUpAjouterMethodeEvaluation").message({ text : "Méthode obligatoire", type : "error" });
				isOk = false;
			}
			
			//On controle la version, elle est obligatoire
			if(jQuery("select[name='version']").val() == ""){
				jQuery("#popUpAjouterMethodeEvaluation").message({ text : "Version obligatoire", type : "error" });
				isOk = false;
			}
			
			var datePrevisionnelle = jQuery("#AME_DatePrevisionnelle").find("input[name='datePrevisionnelleTxt']").val();
			var dateReelleBegin = jQuery("#AME_DateReelle").find("input[name='sDateBegin']").val();
			var dateReelleEnd = jQuery("#AME_DateReelle").find("input[name='sDateEnd']").val();
			var idCarac = jQuery("#selectCaracMethEval").val();
			
			//On controle si une date prévisionnelle ou une date réelle a été selectionné
			if(datePrevisionnelle == "" && dateReelleBegin == "" && dateReelleEnd == "") {
				jQuery("#popUpAjouterMethodeEvaluation").message({ text : "Au moins une date prévisionnelle ou réelle doit être saisie", type : "error" });
				isOk = false;
			}

			//On controle si une date prévisionnelle ou une date réelle a été selectionné
			if(dateReelleBegin !== "" && dateReelleEnd == "") {
				jQuery("#popUpAjouterMethodeEvaluation").message({ text : "La période 'Dates réelles' doit être saisie intégralement", type : "error" });
				isOk = false;
			}
			
			// Controle sur le champ caractéristique
			if(!idCarac) {
				jQuery("#popUpAjouterMethodeEvaluation").message({ text : "Caractéristique obligatoire", type : "error" });
				isOk = false;
			}
			
			return isOk;
		}
		
};

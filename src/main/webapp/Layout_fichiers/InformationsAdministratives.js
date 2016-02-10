/**
 *  InformationsAdministratives.js
 *  Fichier javascript de la page InformationsAdministratives.tml.
 */

/**
 * Constructeur
 */
function InformationsAdministratives() {
}

/**
 * Methodes de l'objet InformationsAdministratives.
 */
InformationsAdministratives.prototype = {
		/**
		 * Controles de surfaces
		 */
		ajaxControlesSurfaces: function (typeStructure){
			var isOk = true;
			jQuery(".message").each(function(){this.remove();});
			// Adresse Ligne 1 doit etre renseignee
			if(jQuery("input[id^='adresseLigne1']").val() == ""){
				jQuery("#popUpEditStructure").message({
					text : adresseLigne1requiredmessage,
					type : "error"
				});
				isOk = false;
			}
			// L'email s'il est renseigne doit etre valide
			var email = jQuery("input[id^='email']").val();
			if(email != ""){
				var validEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i).test(email);
				if (!validEmail){
					jQuery("#popUpEditStructure").message({
						text : emailregexpmessage,
						type : "error"
					});
					isOk = false;
				}
			}
			if (typeStructure == 'ES' || typeStructure == 'EJ' || typeStructure == 'IACE')
			{
				//TODO estUnEjEtcontientAuMoinsUnIACE cf ControlesSaisie.java
				//Le siren s'il est renseigne doit etre numerique
				var siren = jQuery("input[id^='siren" + typeStructure + "']").val();
				if(siren != "" && !jQuery.isNumeric(siren)){
					jQuery("#popUpEditStructure").message({
						text : codeInseeregexpmessage,
						type : "error"
					});
					isOk = false;
				}				
			}
			if (typeStructure == 'GCS'){
				// Le numero FINESS doit etre compose du numero de departement suivi de 7 chiffres
				// De plus le numero finess doit correspondre a la localite choisi.
				var finess = jQuery("input[id^='finess" + typeStructure + "']").val();

				if (finess != ""){
					// Format
					if (!jQuery.isNumeric(finess) || finess.length() != 9){
						jQuery("#popUpEditStructure").message({
							text : finessregexpmessage,
							type : "error"
						});
						isOk = false;
					}
					// Correspondance
					var codeDepartementInitial =  finess.substr(0, 2);
					var codePostal = jQuery("input[id^='codePostal']").val();
					var codeDepartementLocalite = codePostal.substr(0,2);
					if (codeDepartementInitial != codeDepartementLocalite){
						jQuery("#popUpEditStructure").message({
							text : finesscodeDepartementFinessNoMatchmessage,
							type : "error"
						});
						isOk = false;
					}
				}
				// numArreteArh obligatoire
				if(jQuery("input[id^='numArreteArh" + typeStructure + "']").val() == ""){
					jQuery("#popUpEditStructure").message({
						text : numeroArreteArhrequiredmessage,
						type : "error"
					});
					isOk = false;
				}
				// numArreteArh obligatoire
				if(jQuery("input[id^='dateArreteArh" + typeStructure + "']").val() == ""){
					jQuery("#popUpEditStructure").message({
						text : dateArreteArhrequiredmessage,
						type : "error"
					});
					isOk = false;
				}
				// numArreteArh obligatoire
				if(jQuery("input[id^='dateSignature" + typeStructure + "']").val() == ""){
					jQuery("#popUpEditStructure").message({
						text : dateSignaturerequiredmessage,
						type : "error"
					});
					isOk = false;
				}
				// numArreteArh obligatoire
				if(jQuery("input[id^='dateOuverture" + typeStructure + "']").val() == ""){
					jQuery("#popUpEditStructure").message({
						text : dateOuverturerequiredmessage,
						type : "error"
					});
					isOk = false;
				}
			}
			return isOk;
		}
};

/**
 * Instantiation et utilisation de la classe.
 */
var informationsAdministratives = new InformationsAdministratives();

jQuery("input[id^='dateCessation']").each(function (i, e){
	var input = jQuery(e);
	input.datepicker({
		showOn: "focus",
		changeMonth: false,
		changeYear: false
	});
});

jQuery("input[id^='dateArrete']").each(function (i, e){
	var input = jQuery(e);
	input.datepicker({
		showOn: "focus",
		changeMonth: false,
		changeYear: false
	});
});

jQuery("input[id^='dateSignature']").each(function (i, e){
	var input = jQuery(e);
	input.datepicker({
		showOn: "focus",
		changeMonth: false,
		changeYear: false
	});
});

jQuery("input[id^='dateOuverture']").each(function (i, e){
	var input = jQuery(e);
	input.datepicker({
		showOn: "focus",
		changeMonth: false,
		changeYear: false
	});
});
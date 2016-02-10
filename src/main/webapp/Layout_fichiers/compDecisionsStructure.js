/*
 * Partie Composant popup décisions structure 
 */

/**
 * Fonction appelée lors du tri selon une colonne. Cette fonction permet de
 * cacher le tableau afin de rendre plus esthétique le tri, et effectue un appel
 * à la fonction de rendu de la popup afin d'effectuer le tri et d'afficher de
 * nouveau le tableau à l'écran.
 * 
 * @param identifiantStructure
 *            identifiant de la structure concerné par la popup
 * @param colonneDeTri
 *            nom au format JPQL de la colonne sur laquelle nous souhaitons
 *            effectuer un tri
 * @param ordreDeTri
 *            ordre dans lequel nous souhaitons trier la colonne
 */
function compDecisionsStructure_triPopup(identifiantStructure, colonneDeTri, ordreDeTri){
	jQuery('.tab_demarche').slideUp("slow");
	compDecisionsStructure_renderPopup(identifiantStructure, colonneDeTri, ordreDeTri);
}

/**
 * Fonction permettant d'effectuer un appel AJAX à la page permettant
 * l'affichage de la popup Attention, il faut que la page possède la div d'id
 * "zonePopupDecisionStructure" afin de pouvoir utilisé la popup.
 * 
 * @param identifiantStructure
 *            identifiant de la structure concerné par la popup
 * @param colonneDeTri
 *            nom au format JPQL de la colonne sur laquelle nous souhaitons
 *            effectuer un tri
 * @param ordreDeTri
 *            ordre dans lequel nous souhaitons trier la colonne
 */
function compDecisionsStructure_renderPopup(identifiantStructure, colonneDeTri, ordreDeTri){
	jQuery('#zonePopupDecisionStructure').load(common.getBaseUrl() + "/demarche/PopupDecisionsStructure/"+identifiantStructure+"/"+colonneDeTri+"/"+ordreDeTri);
}

/**
 * Fonction permettant d'appliquer au tableau le composant JQuery foldabletable.
 * En ce qui concerne les paramètre de l'appel au composant foldabletable, se
 * référer à la documentation de ce composant. Cette fonction permet également
 * d'ajouter la classe css à la colonne certification (ne peux pas être saisie
 * directement dans la page .tml, car le composant foldabletable copie la
 * dernière colonne pour le style. Il faut donc appliquer le style après le
 * passage de ce composant) Cette fonction permet également d'afficher le
 * tableau à l'écran afin de rendre plus esthétique l'affichage.
 */
function compDecisionsStructure_applyFoldableBehavior()
{
	jQuery('.tab_demarche').foldabletable({'rangeStart':3,
		'rangeEnd':5,
		'foldedLineAjaxFeedUrl': common.getBaseUrl() + "/demarche/AjouterLigneDecisionsStructureAjax:ajaxDetailDecision",
		'foldedLineRenderFunction': compDecisionsStructure_foldedLineRender
	});
	jQuery('#niveauCertification').addClass("niveauCertification");
	jQuery('.tab_demarche').slideDown("slow");
}

/**
 * Fonction permettant de fournir les données à afficher lors du clique sur le
 * bouton plus d'une ligne du tableau. Elle insert donc dans la ligne concernée
 * les informations initiale de cette ligne, ainsi que des informations
 * supplémentaire charger par la page AjouterLigneDecisionsStructureAjax. Cette
 * méthode est appelé suite à l'appel ajax effectuer précédemment afin de
 * récupérer les informations nécessaires.
 * 
 * @param dataRenderObject
 *            L'objet JSON contenant les informations à afficher
 * @param tdCellDom
 *            La balise td qui est réceptrice du rendu de la ligne
 * @param dataLineObject
 *            Les données initiale JSON de l'appel
 */
function compDecisionsStructure_foldedLineRender(dataRenderObject, tdCellDom, dataLineObject)
{
	var cellHtml = "<table class='tableauLigneAjax'>";
	cellHtml = cellHtml + "<tr>";
	cellHtml = cellHtml + "<td class='versionAjax'>" + dataRenderObject.version + "</td>";
	cellHtml = cellHtml + "<td class='typeVisiteAjax'>"+ dataRenderObject.typeVisite +"</td>";
	cellHtml = cellHtml + "<td class='niveauCertificationAjax'>"+ dataRenderObject.niveauCertification +"</td>";
	cellHtml = cellHtml + "</tr>";
	cellHtml = cellHtml + "<tr>";
	cellHtml = cellHtml + "<td class='ligneRendu ligneRenduAjax"+ dataRenderObject.visite +"' colspan='3'></td>";
	cellHtml = cellHtml + "</tr>";
	cellHtml = cellHtml + "</table>";
	tdCellDom.html(cellHtml);
	jQuery('.ligneRenduAjax'+ dataRenderObject.visite).load(common.getBaseUrl() + "/demarche/AjouterLigneDecisionsStructureAjax/"+dataRenderObject.visite);
};

/**
 * Téléchargement du rapport au format pdf
 * @param identifiantStructure
 */
function telechargerRapport(identifiantStructure, nomStructure){
	var nomFichier = "";
	jQuery("#popupAlert").removeClass("wins");
	loading('body');
	
	jQuery.ajax({
		url: common.getBaseUrl() + "/demarche/PopupDecisionsStructure:imprimerRapport/"+identifiantStructure+"/"+nomStructure,
		success : function(data) {
			nomFichier = data.path;
			window.open(common.getBaseUrl() + "/demarche/PopupDecisionsStructure:downloadRapport/"+nomFichier);
			stop_loading();
			jQuery("#popupAlert").addClass("wins");
		}		
	});
}

/*
 * Partie Composant popup décisions démarche 
 */

/**
 * Fonction permettant d'effectuer un appel AJAX à la page permettant
 * l'affichage de la popup Attention, il faut que la page possède la div d'id
 * "zonePopupDecisionDemarche" afin de pouvoir utilisé la popup.
 * 
 * @param identifiantDemarche
 *            identifiant de la démarche concerné par la popup
 * @param colonneDeTri
 *            nom au format JPQL de la colonne sur laquelle nous souhaitons
 *            effectuer un tri
 * @param ordreDeTri
 *            ordre dans lequel nous souhaitons trier la colonne
 */
function compDecisionsDemarche_renderPopup(identifiantDemarche, colonneDeTri, ordreDeTri){
	jQuery('#zonePopupDecisionStructure').load(common.getBaseUrl() + "/demarche/PopupDecisionsDemarche/"+identifiantDemarche+"/"+colonneDeTri+"/"+ordreDeTri);
}

/**
 * Fonction permettant d'appliquer au tableau le composant JQuery foldabletable.
 * En ce qui concerne les paramètre de l'appel au composant foldabletable, se
 * référer à la documentation de ce composant. Cette fonction permet également
 * d'ajouter la classe css à la colonne certification (ne peux pas être saisie
 * directement dans la page .tml, car le composant foldabletable copie la
 * dernière colonne pour le style. Il faut donc appliquer le style après le
 * passage de ce composant) Cette fonction permet également d'afficher le
 * tableau à l'écran afin de rendre plus esthétique l'affichage.
 */
function compDecisionsDemarche_applyFoldableBehavior()
{
	jQuery('.tab_demarche').foldabletable({'rangeStart':3,
		'rangeEnd':6,
		'foldedLineAjaxFeedUrl': common.getBaseUrl() + "/demarche/AjouterLigneDecisionsStructureAjax:ajaxDetailDecision",
		'foldedLineRenderFunction': compDecisionsDemarche_foldedLineRender
	});
	jQuery('#structuresAssocieesDem').addClass("structuresAssocieesDem");
	jQuery('.tab_demarche').slideDown("slow");
}

/**
 * Fonction appelée lors du tri selon une colonne. Cette fonction permet de
 * cacher le tableau afin de rendre plus esthétique le tri, et effectue un appel
 * à la fonction de rendu de la popup afin d'effectuer le tri et d'afficher de
 * nouveau le tableau à l'écran.
 * 
 * @param identifiantStructure
 *            identifiant de la structure concerné par la popup
 * @param colonneDeTri
 *            nom au format JPQL de la colonne sur laquelle nous souhaitons
 *            effectuer un tri
 * @param ordreDeTri
 *            ordre dans lequel nous souhaitons trier la colonne
 */
function compDecisionsDemarche_triPopup(identifiantDemarche, colonneDeTri, ordreDeTri){
	jQuery('.tab_demarche').slideUp("slow");
	compDecisionsDemarche_renderPopup(identifiantDemarche, colonneDeTri, ordreDeTri);
}

/**
 * Fonction permettant d'effectuer un appel AJAX à la page permettant
 * l'affichage de la popup Attention, il faut que la page possède la div d'id
 * "zonePopupDecisionStructure" afin de pouvoir utilisé la popup.
 * 
 * @param identifiantStructure
 *            identifiant de la structure concerné par la popup
 * @param colonneDeTri
 *            nom au format JPQL de la colonne sur laquelle nous souhaitons
 *            effectuer un tri
 * @param ordreDeTri
 *            ordre dans lequel nous souhaitons trier la colonne
 */
function compDecisionsStructure_renderDemarche(identifiantDemarche, colonneDeTri, ordreDeTri){
	jQuery('#zonePopupDecisionStructure').load(common.getBaseUrl() + "/demarche/PopupDecisionsDemarche/"+identifiantDemarche+"/"+colonneDeTri+"/"+ordreDeTri);
}

/**
 * Fonction permettant de fournir les données à afficher lors du clique sur le
 * bouton plus d'une ligne du tableau. Elle insert donc dans la ligne concernée
 * les informations initiale de cette ligne, ainsi que des informations
 * supplémentaire charger par la page AjouterLigneDecisionsStructureAjax. Cette
 * méthode est appelé suite à l'appel ajax effectuer précédemment afin de
 * récupérer les informations nécessaires.
 * 
 * @param dataRenderObject
 *            L'objet JSON contenant les informations à afficher
 * @param tdCellDom
 *            La balise td qui est réceptrice du rendu de la ligne
 * @param dataLineObject
 *            Les données initiale JSON de l'appel
 */
function compDecisionsDemarche_foldedLineRender(dataRenderObject, tdCellDom, dataLineObject)
{
	var cellHtml = "<table class='tableauLigneAjax'>";
	cellHtml = cellHtml + "<tr>";
	cellHtml = cellHtml + "<td class='versionAjax'>" + dataRenderObject.version + "</td>";
	cellHtml = cellHtml + "<td class='typeVisiteAjax'>"+ dataRenderObject.typeVisite +"</td>";
	cellHtml = cellHtml + "<td class='niveauCertificationAjax'>"+ dataRenderObject.niveauCertification +"</td>";
	cellHtml = cellHtml + "<td class='structuresAssocieesAjaxDem'>"+ dataRenderObject.structureRattachee +"</td>";
	cellHtml = cellHtml + "</tr>";
	cellHtml = cellHtml + "<tr>";
	cellHtml = cellHtml + "<td class='ligneRenduDem ligneRenduAjax"+ dataRenderObject.visite +"' colspan='4'></td>";
	cellHtml = cellHtml + "</tr>";
	cellHtml = cellHtml + "</table>";
	tdCellDom.html(cellHtml);
	jQuery('.ligneRenduAjax'+ dataRenderObject.visite).load(common.getBaseUrl() + "/demarche/AjouterLigneDecisionsStructureAjax/"+dataRenderObject.visite);
};

/**
 * Téléchargement du rapport au format pdf
 * @param identifiantStructure
 */
function telechargerRapportDemarche(sigaesDemCode){
	var nomFichier = "";
	jQuery("#popupAlert").removeClass("wins");
	loading('body');
	
	jQuery.ajax({
		url: common.getBaseUrl() + "/demarche/PopupDecisionsDemarche:imprimerRapport/"+sigaesDemCode,
		success : function(data) {
			nomFichier = data.path;
			window.open(common.getBaseUrl() + "/demarche/PopupDecisionsDemarche:downloadRapport/"+nomFichier);
			stop_loading();
			jQuery("#popupAlert").addClass("wins");
		}		
	});
}
// JavaScript Document
var w3c=(document.getElementById)?true:false;
var ns4=(document.layers)?true:false;
var ie4=(document.all && !w3c)?true:false;
var ie5=(document.all && w3c)?true:false;
var ua = navigator.userAgent;
var ie = ( ua != null && ua.indexOf( "MSIE" ) != -1 )?true:false;
var ns6=(w3c && navigator.appName.indexOf("Netscape")>=0)?true:false;
var ie6 = (navigator.appVersion.indexOf("MSIE 6.")==-1) ? false : true;
var ie7 = (navigator.appVersion.indexOf("MSIE 7.")==-1) ? false : true;
var ie8 = (navigator.appVersion.indexOf("MSIE 8.")==-1) ? false : true;

/*
 * Afficher ou masquer un element.
 * idElement : l'element a afficher/masquer dans le document (doit avoir un id=...)
 * nomBouton : bouton a modifier pour indiquer l'ouverture/fermeture (doit avoir un name=...)
 * imgFerme : Image affichee pour fermer la div
 * imgOuvert : Image affichee pour ouvrir la div
 */
function closeOrOpen(idElement, nomBouton, imgFerme, imgOuvert)
{
	var display = document.getElementById(idElement).style.display;
	if (display.indexOf('none') >= 0)
	{
		if (!ie && (document.getElementById(idElement).nodeName=="TBODY")) {
			document.getElementById(idElement).style.display='table-row-group';
		}
		else {
			document.getElementById(idElement).style.display='block';
		}
		MM_swapImage(nomBouton,'',imgFerme,0);
	} else
	{
		document.getElementById(idElement).style.display='none';
		MM_swapImage(nomBouton,'',imgOuvert,0);
	}
}

/*
 * Afficher ou masquer des lignes de tableau.
 * idElements : un Array d'elements a afficher/masquer dans le document (doit avoir un id=...)
 * nomBouton : bouton a modifier pour indiquer l'ouverture/fermeture (doit avoir un name=...)
 * imgFerme : Image affichee pour fermer la div
 * imgOuvert : Image affichee pour ouvrir la div
 */
function closeOrOpenMulti(idElements, nomBouton, imgFerme, imgOuvert)
{
	isOpen = true;
	for (i=0 ; i < idElements.length ; i++)
	{
		elt = idElements[i];
		//alert("elt " + elt);
		var display = document.getElementById(elt).style.display;
		//alert("display " + display);
		if (display.indexOf('none') >= 0)
		{
			document.getElementById(elt).style.display=(ie5)?'block':'table-row';
			isOpen = true;
		} else
		{
			document.getElementById(elt).style.display='none';
			isOpen = false;
		}
	}

	if (isOpen)
		MM_swapImage(nomBouton,'',imgFerme,0);
	else
		MM_swapImage(nomBouton,'',imgOuvert,0);
}

/*
 * Afficher ou masquer toutes les lignes de tableau.
 * idElements : un Array d'elements a afficher/masquer dans le document (doit avoir un id=...)
 * imgFerme : Image du bouton fermee
 * imgOuvert : Image du bouton ouvert
 */
function closeOrOpenAll(idElements, toClose, imgFerme, imgOuvert)
{
	if (toClose)
	{
		display = 'none';
		// nom du fichier image a remplacer (sans url)
		toFind=imgFerme.substring(imgFerme.lastIndexOf("\/")+1,imgFerme.length);
		toReplace=imgOuvert;
	} else
	{
		display = (ie5)?'block':'table-row';
		// nom du fichier image a remplacer (sans url)
		toFind=imgOuvert.substring(imgOuvert.lastIndexOf("\/")+1,imgOuvert.length);
		toReplace=imgFerme;
	}

	// Remplace les images
	for (i=0 ; i < document.images.length ; i++)
	{
		//alert("document.images[i].src " + document.images[i].src + "compare to " + toFind + "=" + document.images[i].src.indexOf(toFind));
		if (document.images[i].src.indexOf(toFind) >= 0)
			MM_swapImage(document.images[i].name,'',toReplace,0);
	}

	// Ferme ou ouvre les elements
	for (i=0 ; i < idElements.length ; i++)
		document.getElementById(idElements[i]).style.display=display;
}

/*
 * Masque les ï¿½lï¿½ments SELECT contenus dans l'ï¿½lï¿½ment passï¿½ en paramï¿½tre.
 * idElement : l'ï¿½lï¿½ment dont on doit masquer les SELECT
 */
function masquerSelects(idElement)
{
	//alert("on masque");
	var selects = null;
	if (idElement == null || idElement == "" || document.getElementById(idElement) == null) {
		selects=document.getElementsByTagName("SELECT");
	} else {
		selects=document.getElementById(idElement).getElementsByTagName("SELECT");
	}

	for (i=0 ; i < selects.length ; i++)
	{
		selects[i].style.visibility = 'hidden';
	}
}

/**
 * Remonte le dom jusqu'au div btAction et le cache
 * @param btn le bouton
 * @returns rien
 */
function hideBtAction(btn) {
	$(btn).up('.btAction').toggle();
}

/**
 * Cache le bouton image sur lequel l'utilisateur vient de cliquer.
 * @param btn le bouton
 * @returns rien
 */
function hideBtImage(btn) {
		jQuery(btn).toggle();
}

/**
 * Cache le bouton vert sur lequel l'utilisateur vient de cliquer
 * @param btn le bouton
 */
function hideBtVert(btn) {
	$(btn).up('.btVert').toggle();
}

/*
 * Affiche les ï¿½lï¿½ments SELECT contenus dans l'ï¿½lï¿½ment passï¿½ en paramï¿½tre.
 * idElement : l'ï¿½lï¿½ment dont on doit afficher les SELECT
 */
function afficherSelects(idElement)
{
	//alert('afficheSelects');
	var selects=null;
	if (idElement == null || idElement == "" || document.getElementById(idElement) == null) {
		selects = document.getElementsByTagName("SELECT");
	} else {
		selects = document.getElementById(idElement).getElementsByTagName("SELECT");
	}

	for (i=0 ; i < selects.length ; i++)
	{
		selects[i].style.visibility = 'visible';
	}
}

/*
 * Afficher une popup.
 * idPopup : l'élement à afficher (en général, 'winAlert')
 * idElement : l'élément dont on doit masquer les SELECT avant de masquer la popup (en général, le bloc 'main')
 */
function afficherPopup(idPopup, idElement) {
	var popup = document.getElementById(idPopup);
	var fondOpaque = document.getElementById(idPopup+'FondOpaque');
	if (popup != null) {
		if (ie6) {
			var hauteur = document.body.clientHeight+'px';
			//var hauteur = (document.viewport.getHeight())+'px';
			//var largeur = (document.viewport.getWidth())+'px';
			var largeur;
			if(document.viewport == null){
				largeur = (document.body.clientWidth-10)+'px';
			}else{
				largeur = (document.viewport.getWidth())+'px';
			}
			popup.style.height = hauteur;
			popup.style.width = largeur;
			fondOpaque.style.height = hauteur;
			fondOpaque.style.width = largeur;
		}
		popup.style.display='block';
	}

	if (idElement != null && ie6) {
		masquerSelects(idElement);
	}
}

function afficherPopupComp(idPopup, idElement, affiche) {
	if (affiche) {
		afficherPopup(idPopup, idElement);
	}
}

/*
 * Masquer une popup.
 * idPopup : l'ï¿½lement ï¿½ masquer (en gï¿½nï¿½ral, 'winAlert')
 * idElement : l'ï¿½lï¿½ment dont on doit rï¿½-afficher les SELECT aprï¿½s avoir masquï¿½ la popup (en gï¿½nï¿½ral, le bloc 'main')
 */
function masquerPopup(idPopup, idElement) {
	document.getElementById(idPopup).style.display='none';
	if (idElement != null && ie6) {
		afficherSelects(idElement);
	}
}

/*
 * Ouvrir la popup d'aide au niveau de l'ancre passï¿½e en argument
 * ancre : ancre sur laquelle doit s'ouvir l'aide
 */
function openHelp(ancre, rootPath) {
	//popup = window.open(rootPath+'/Aide/'+ancre+'#'+ancre, 'Message', config='height=500, width=800, toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, directories=no, status=no');
	// Correction jira 328.
	//window.location.href); //common.getBaseUrl();
	var baseUrl = common.getBaseUrl();
	popup = window.open(baseUrl + '/Aide/'+ancre+'#'+ancre, 'Message', config='height=500, width=800, toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, directories=no, status=no');
}

function openSiteFiness() {
	popup = window.open('http://finess.sante.gouv.fr/jsp/rechercheSimple.jsp', 'FINESS', config='height=500, width=800, toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, directories=no, status=no');
}

function openPieceJointe(chemin) {
	popup = window.open('../../..'+chemin, 'FINESS', config='height=500, width=800, toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, directories=no, status=no');
}

/*
 * Affiche une popup d'alerte
 */
function afficheAlerte()
{
	document.getElementById('popupAlert').style.display='block';
}

/*
 * Cache la popup d'alerte
 */
function cacherAlerte()
{
	document.getElementById('popupAlert').style.display='none';
}

//rafraichit une zone avec un element
function refreshTapestry(elementName1,zoneName1){
		if(document.getElementById(zoneName1)!=null){
		element = document.getElementById(elementName1);
        var zone = document.getElementById(zoneName1).zone;

        var successHandler = function(transport)
        {
            var reply = transport.responseJSON;

            zone.show(reply.content);

            Tapestry.processScriptInReply(reply);
        };

	 new Ajax.Request(element.href, { onSuccess : successHandler });
	 }
}


function refreshTapestryURL(myurl,zoneName1){
		if(document.getElementById(zoneName1)!=null){
        var zone = document.getElementById(zoneName1).zone;

        var successHandler = function(transport)
        {
            var reply = transport.responseJSON;

            zone.show(reply.content);

            Tapestry.processScriptInReply(reply);
        };


	 new Ajax.Request(myurl, { onSuccess : successHandler });
	 }
}

function masquer(img,divDisplay){
	if($(divDisplay)!=null){
		if($(divDisplay).style.visibility=='hidden'){
			//$(divDisplay).style.display='block';
			$(divDisplay).style.visibility='visible';
			$(divDisplay).style.display='block';
			if($(img)!=null){
				$(img).src=$(img).src.substr(0,$(img).src.length-5)+'B.gif';
				$(img).alt='Ouvrir';
			}
		}else{
			//$(divDisplay).style.display='none';
			$(divDisplay).style.visibility='hidden';
			$(divDisplay).style.display='none';
			if($(img)!=null){
				$(img).src=$(img).src.substr(0,$(img).src.length-5)+'H.gif';
				$(img).alt='Masquer';
			}
		}
	}
}


//prend en parametre l'id de la popup (div) a afficher/cacher
function dialogPopup(idPopup,idElement){
	var popupDiag = $(idPopup);
	if (popupDiag!=null){
		if (popupDiag.style.display=='block'){
			popupDiag.style.display='none';
			if (idElement != null && ie6) {
				afficherSelects(idElement);
			}
		}else{
			popupDiag.style.display='block';
			if (idElement != null && ie6) {
				masquerSelects(idElement);
			}
		}
	}
}


function myPrint(myurl){



	var successHandler = function(transport)
        {
        	win = window.open("", "printwindow","menubar=0,resizable=1,scrollbars=yes,width=800,height=800");
            var reply = transport.responseJSON;
            newdoc = win.document;
            var content = reply.content;
            var reg=new RegExp("<a", "g");
            content = content.replace(reg,"<y");
            reg=new RegExp("<A", "g");
            content = content.replace(reg,"<y");
            reg=new RegExp("onclick", "g");
            content = content.replace(reg,"o");
            reg=new RegExp("ONCLICK", "g");
            content = content.replace(reg,"o");
            //on remet le lien imgPrint
            i = content.indexOf('o=');
            if (i>0){
            	content = content.substr(0,i)+"onclick="+content.substring(i+2);
            }

			newdoc.writeln(content);
			newdoc.close();


        };



	 new Ajax.Request(myurl, { onSuccess : successHandler });
}




function selectAllCheckbox(fils,pere)
{
	var valeur=document.getElementsByName(pere)[0].checked;

	var t=document.getElementsByName(fils);

	var taille=t.length;

	for(i=0;i<taille;i++)
	{
		if(valeur)
			t[i].checked=true;
		else
			t[i].checked=false;
	}
}

function selectAllCheckboxInDocument(pere)
{
	var valeurPere=document.getElementById(pere).checked;
	var lesInputs=document.getElementsByTagName('input');
	var lesInputsTaille=lesInputs.length;

	for(i=0;i<lesInputsTaille;i++)
	{
		if(lesInputs[i].type == 'checkbox')
		{
			if(valeurPere)
				lesInputs[i].checked=true;
			else
				lesInputs[i].checked=false;
		}
	}
}

function affichePartieDmdModifDemarche()
{
	if(document.getElementById('typemodif').value=='report')
	{
		document.getElementById('report').style.display='block';
	}
	else
		document.getElementById('report').style.display='none';
}

function preparerPopupArchivage(idStructureArchivage, libelleStructureArchivage, dateArchivageTxt, motifArchivage, dateFinDemarchePourStructureIndex) {
	$('idStructureArchivage').value = idStructureArchivage;
	$('libelleStructureArchivage').value = libelleStructureArchivage;
	if (dateFinDemarchePourStructureIndex != "") {
		$('dateArchivageTxt').value = dateFinDemarchePourStructureIndex;
	} else {
		$('dateArchivageTxt').value = dateArchivageTxt;
	}
	$('motifArchivage').value = motifArchivage;
}

function supprimerChoixEj() {
	choisirEjRattachement(-1, '');
}

function choisirEjRattachement(idEjRattachement, libelleEjRattachement) {
	for (var i=1; i<=7; i++) {
		var champLibelle = document.getElementsByName('libelleEjChoisie_'+i)[0];
		if (champLibelle != null)
			champLibelle.value = libelleEjRattachement;
	}
	document.getElementsByName('idEjRattachement')[0].value = idEjRattachement;
	jQuery("input[id^='idEjRattachement']").val(idEjRattachement);
}

function supprimerChoixGcs() {
	choisirGcs(-1, '');
}

function choisirGcs(idGcs, libelleGcs) {
	for (var i=1; i<=7; i++) {
		var champLibelle = document.getElementsByName('libelleGcsChoisi_'+i)[0];
		if (champLibelle != null)
			champLibelle.value = libelleGcs;
	}
	document.getElementsByName('idGcs')[0].value = idGcs;
}

/**
 * Le gestionnaire permettant de définir la localité dans les champs destinés.
 */
var localiteManager = (function(window) {

	/**
	 * La base de l'identifiant des éléments à modifier.
	 */
	var baseElementId = null;

	/**
	 * Récupère la base de l'identifiant de l'élément à modifier pour définir la localité.<br>
	 * Pour des raisons de compatibilité, si la base de l'identifiant n'a pas été défini via la méthode {@link localiteManager#setBaseElementId(String)}, alors
	 * nous recherchons le contenu du champs d'ID "idElementCible".<br>
	 * Enfin, si là nous plus nous ne trouvons aucune valeur, alors nous retournons une chaîne vide.
	 *
	 * @returns {String} la base de l'identifiant des éléments à modifier.
	 */
	function getBaseElementId() {
		if (null != baseElementId) {
			// Nous base d'id a été renseigné.
			return baseElementId;
		}

		// Nous tentons de récupérer la valeur du champs caché.
		var temp = document.getElementById('idElementCible').value;

		if (null == temp) {
			// Si rien trouvé, alors chaîne vide.
			temp = "";
		}
		return temp;
	}

	/**
	 * Modifie les champs nécessaire afin de définir la localité.
	 *
	 * @param {String} nomVille le nom de la ville.
	 * @param {String} codePostal le code postal.
	 * @param {String} idDepartement l'identifiant du département.
	 * @param {String} departement le nom du départememnt.
	 * @param {String} region le nom de la région.
	 * @param {String} cible la base de l'identifiant des éléments à modifier.
	 */
	function choisirLocalite(nomVille, codePostal, idDepartement, departement, region, cible) {
		for ( var i = 1; i <= 7; i++) {
			var champResume = document.getElementsByName('localite' + cible + '_' + i)[0];
			if (champResume != null)
				champResume.value = nomVille + " (" + codePostal + ")\n" + departement + "\n" + region;
		}

		if (document.getElementsByName('nomVille' + cible).length > 0) {
			document.getElementsByName('nomVille' + cible)[0].value = nomVille;
		}
		if (document.getElementsByName('codePostal' + cible).length > 0) {
			document.getElementsByName('codePostal' + cible)[0].value = codePostal;
		}
		if (document.getElementsByName('idDepartement' + cible).length > 0) {
			document.getElementsByName('idDepartement' + cible)[0].value = idDepartement;
		}

		// Pour dmdModif, on change les valeurs des champs dont les noms sont également indiqués dans la page
		if (document.getElementsByName('champVille')[0] != null) {
			document.getElementsByName(document.getElementsByName('champVille')[0].value)[0].value = nomVille;
		}
		if (document.getElementsByName('champCP')[0] != null) {
			document.getElementsByName(document.getElementsByName('champCP')[0].value)[0].value = codePostal;
		}
		if (document.getElementsByName('champDpt')[0] != null) {
			document.getElementsByName(document.getElementsByName('champDpt')[0].value)[0].value = departement;
		}
		if (document.getElementsByName('champPourSubmit')[0] != null && document.getElementsByName('champPourSubmit')[0].value == 'true') { // On veut commiter
			// tout
			// de suite la page
			document.getElementById("editForm").submit();
		}
	}

	return {

		/**
		 * Définie la base de l'identifiant de l'élément à modifier pour définir la localité.
		 *
		 * @param {String} id la base de l'identifiant.
		 */
		setBaseElementId : function(id) {
			baseElementId = id;
		},

		/**
		 * Récupère la base de l'identifiant de l'élément à modifier pour définir la localité.
		 *
		 * @returns {String} la base de l'identifiant des éléments à modifier.
		 */
		getBaseElementId : function() {
			return baseElementId;
		},

		/**
		 * Fonction permettant de définir les informations de localité sur une page, conjointement au composant CompRechercheLocalite.
		 *
		 * @param donnees objet contenant les informations nécessaire.
		 */
		choisirLocalite : function(donnees) {
			var nomVille = donnees.nomVille;
			var codePostal = donnees.codePostal;
			var idDepartement = donnees.idDepartement;
			var codeDepartement = donnees.codeDepartement;
			var departement = donnees.departementPourJs;
			var region = donnees.regionPourJs;
			var cible = getBaseElementId();

			// Nous appelons l'ancienne fonction pour conserver le comportement précédent.
			choisirLocalite(nomVille, codePostal, idDepartement, departement, region, cible);

			// Nous ajoutons notre action supplémentaire.
			if (document.getElementsByName('codeDepartement' + cible).length > 0) {
				document.getElementsByName('codeDepartement' + cible)[0].value = codeDepartement;
			}
		}
	};
})(window);


function modifierChamps(balise, baliseACopier)
{
	var elt = document.getElementsByName(balise)[0];
	var eltACopier = document.getElementById(baliseACopier);

	if (eltACopier != null)
	{
		var children = eltACopier.childNodes;

		for(i=0; i < children.length; i++)
			if (children[i].nodeType == 1 && children[i].attributes.length > 0)
				for (j = 0 ; j < children[i].attributes.length ; j++)
					if (children[i].attributes[j].nodeName == "name")
						if (children[i].attributes[j].nodeValue != "")
						{
							//alert("nodeName a mettre [" + children[i].attributes[j].nodeValue + "]");
							elt.value = children[i].attributes[j].nodeValue;
							return;
						}
	}

}

function toggleBloc(idCheckbox, idBloc) {
	var checkbox = document.getElementById(idCheckbox);
	var bloc = document.getElementById(idBloc);
	if (bloc != null) {
		if ((checkbox != null) && (checkbox.checked)) {
			bloc.style.display = 'none';
		}
		else {
			bloc.style.display = 'block';
		}
	}
}

function toggleBlocWithRadio(idRadio, idBloc, tableRow) {
//	alert("toggleBlocWithRadio [" + idRadio + "][" + idBloc + "]");
	var radios = document.getElementsByName(idRadio);
	var bloc = document.getElementById(idBloc);

	if (bloc != null)
	{
		for (var i = 0 ; i < radios.length ; i++)
		{
			if (radios[i].checked && (radios[i].value=="oui" || radios[i].value=="true"))
			{
				if(tableRow){
					bloc.style.display = 'table-row';
				} else {
					bloc.style.display = 'block';
				}
				return;
			}
		}

		bloc.style.display = 'none';
	}
}

function toggleBlocs() {
	for (var i=1; i<=7; i++) {
		toggleBloc('coordonneesPersoIntervenant1_'+i, 'blocCoordonneesPersoIntervenant1_'+i);
		toggleBloc('coordonneesPersoIntervenant2_'+i, 'blocCoordonneesPersoIntervenant2_'+i);
	}
}

// Affiche/masque un bloc selon que le pays est/n'est pas la France (respectivement)
function toggleBlocSelonPays(idBlocToggle, idChampPays, idPaysFrance) {
	var blocToggle = document.getElementById(idBlocToggle);
	var champPays = document.getElementById(idChampPays);
	if ((champPays != null) && (blocToggle != null)) {
		if (champPays.options[champPays.selectedIndex].value == idPaysFrance)
			blocToggle.style.display = 'block';
		else
			blocToggle.style.display = 'none';
	}
}

function toggleBlocsSelonPays(idBlocToggle, idChampPays, idPaysFrance) {
	for (var i=1; i<=7; i++) {
		toggleBlocSelonPays(idBlocToggle+"_"+i, idChampPays+"_"+i, idPaysFrance);
	}
}


// Affiche/masque un bloc selon que le pays est/n'est pas la France (respectivement)
function toggleModaliteSelonCertification(idBlocToggle, idBlocToggle2, idChampCertification, idCertificationSuivi) {
	var blocToggle = document.getElementById(idBlocToggle);
	var blocToggle2 = document.getElementById(idBlocToggle2);
	var champCertification = document.getElementById(idChampCertification);
	if ((champCertification != null) && (blocToggle != null)) {
		if (champCertification.options[champCertification.selectedIndex].value == idCertificationSuivi)
		{
			blocToggle.style.display = 'block';
			blocToggle2.style.display = 'block';
		}
		else
		{
			blocToggle.style.display = 'none';
			blocToggle2.style.display = 'none';
		}
	}
}


function toggleEcheanceSelonModalite(idBlocToggle, idModalite, idAucuneModaliteSuivi) {
	var blocToggle = document.getElementById(idBlocToggle);
	var champModalite = document.getElementById(idModalite);
	if ((champModalite != null) && (blocToggle != null)) {
		if (champModalite.options[champModalite.selectedIndex].value == idAucuneModaliteSuivi)
		{
			blocToggle.style.display = 'none';
		}
		else
		{
			blocToggle.style.display = 'block';
		}
	}
}

function checkNoneExceptMe(idMe)
{
	var boxes = document.getElementsByTagName("input");
	for (var i = 0; i < boxes.length; i++) {
		myType = boxes[i].getAttribute("type");
		if ( myType == "checkbox") {
			if(boxes[i].name.indexOf(idMe) == -1)
				boxes[i].checked=0;
			}
	}
}


function askToCreate() {
	document.getElementById('createStr').className='show2';document.getElementById('createLink').className='noShow';
}

function chargerListeActivitesDisponibles() {
/*	var listeActivitesTableau = document.getElementById('lignesActivites').getElementsByTagName('TR');
	var listeIdActivites = new Array();
	for (var i=0; i<listeActivitesTableau.length; i++) {
		var idActivite = listeActivitesTableau[i].id.substring(9); // Rï¿½cupï¿½ration de l'id dans la chaï¿½ne "activite_id"
		listeIdActivites.push(idActivite);
	}
*/
	var listeIdActivitesDisponiblesTxt = document.getElementById('listeIdActivitesDisponiblesTxt').value;
	var listeIdActivitesDisponibles = listeIdActivitesDisponiblesTxt.split(",");
	for (var i=0; i<listeIdActivitesDisponibles.size(); i++) {
		var idActiviteDisponible = listeIdActivitesDisponibles[i];
		var libelleActiviteDisponible = document.getElementById('id_' + idActiviteDisponible).firstChild.data;
		ajouterOption(idActiviteDisponible, libelleActiviteDisponible);
	}
	var select = document.getElementById('selectActivitesDisponibles');
	if((ie7||ie8) &&select!=null){
		    select.size=6;
		    select.style.height=90;
  	}
}

function ajouterOption(valeurOption, libelleOption)
{
	var nouvelElement = document.createElement('option');
	nouvelElement.text = libelleOption;
	nouvelElement.value = valeurOption;
	var select = document.getElementById('selectActivitesDisponibles');

	try {
		select.add(nouvelElement, null); // standards compliant; doesn't work in IE
	}
	catch(ex) {
		select.add(nouvelElement); // IE only
	}
}

function afficherActivitesSelectionnees() {
	var select = document.getElementById('selectActivitesDisponibles');
	var auMoinsUneActiviteSelectionne = false;
	for (var i=select.length-1; i>=0; i--) {
		var option = select.options[i];
		if (option.selected) {
			auMoinsUneActiviteSelectionne = true;
			document.getElementById('activite_' + option.value).className='activiteShow';
			select.options[i] = null;
		}
	}
	if (!auMoinsUneActiviteSelectionne)
		alert('Vous devez choisir au moins une ligne dans le tableau ci-dessus.');
}

function masquerActivite(idActivite, libelleActivite) {
	ajouterOption(idActivite, libelleActivite);
	document.getElementById('activite_' + idActivite).className='activiteNoShow';
}

function validerDonneesActivites() {
	// TODO : Vï¿½rifier les donnï¿½es saisies (entiers positifs)
	// (pas dans le Java car la page serait rechargï¿½e en cas d'erreur et les donnï¿½es saisies seraient perdues)

	document.getElementById('listeIdActivitesChoisiesTxt').value = listerIdActivitesDeLaStructure();
	return true;
}

function listerIdActivitesDeLaStructure() {
	var listeId = "";

	var listeActivitesTableau = document.getElementById('lignesActivites').getElementsByTagName('TR');
	for (var i=0; i<listeActivitesTableau.length; i++) {
		if (listeActivitesTableau[i].className == 'activiteShow') {
			var idActivite = listeActivitesTableau[i].id.substring(9); // Rï¿½cupï¿½ration de l'id dans la chaï¿½ne "activite_id"
			listeId += idActivite + ',';
		}
	}
	return listeId;
}

function verifierDonneeSaisie(champDeSaisie) {
	var verif = /^[0-9]+$/;
	if (verif.exec(champDeSaisie.value) == null) {
		alert('Vous devez saisir un entier positif.');
	}
}

function toggleChamp(idCheckbox, idChamp) {
	var checkbox = document.getElementById(idCheckbox);
	var p = document.getElementById(idChamp);
	if (p != null) {
		if ((checkbox != null) && (checkbox.checked)) {
			p.style.display = 'block';
		}
		else {
			p.style.display = 'none';
		}
	}
}

function ouvrirDansNouvelleFenetre(url) {
	popupWidth = screen.availWidth-50;
	popupHeight = screen.availHeight-150;
	window.open(url, "popupWindow", "menubar=0,left=25,top=25,resizable=1,width="+popupWidth+",height="+popupHeight+",scrollbars=1");
}

function pasteEsInfos(selecteurFonction1, selecteurFonction2, selecteurBox) {
	var checkbox = document.getElementById(selecteurBox);

	if ((checkbox != null) && (checkbox.checked)) {
		document.getElementById("civilite3").selectedIndex = document.getElementById("civilite").selectedIndex;
		document.getElementById("prenom3").value = document.getElementById("prenom").value;
		document.getElementById("nom3").value = document.getElementById("nom").value;
		document.getElementById(selecteurFonction2).selectedIndex = document.getElementById(selecteurFonction1).selectedIndex;
	} else {
		document.getElementById("civilite3").selectedIndex = 0;
		document.getElementById("prenom3").value = "";
		document.getElementById("nom3").value = "";
		document.getElementById(selecteurFonction2).selectedIndex = 0;
	}
}

function copyPasteSelect(select1, select2, selecteur) {
	var checkbox = document.getElementById(selecteur);
	if ((checkbox != null) && (checkbox.checked))
		document.getElementById(select2).selectedIndex = document.getElementById(select1).selectedIndex;
}

function copyPasteField(champ1, champ2, selecteur) {
	var checkbox = document.getElementById(selecteur);
	if ((checkbox != null) && (checkbox.checked))
		document.getElementById(champ2).value = document.getElementById(champ1).value;
}

function effacerPremierElementSelectSiVide(elementSelect) {
	if ((elementSelect.options[0].text == '') && (elementSelect.options[1].text == '')) {
		elementSelect.options[0] = null;
	}
}

function onchangeEJFiness(id,defaultValue){
	if(document.getElementById(id).value!=defaultValue){
		theform = document.getElementById(id).form;
		theform.submit();
	}
}

function changeEJFiness(id) {
	if(confirm('La modification du FINESS entite juridique va modifier les rattachements des etablissements qui y sont lies. Voulez vous continuer ?')){
		document.getElementById(id).focus();
	}else{
		document.getElementById('valider').focus();
	}
}

function validModifs() {
		var formulaires = document.getElementsByTagName('form');
		for (var i=0; i<formulaires.length; i++) {
			if(formulaires[i].id.indexOf('modifForm', 0) != -1)
				formulaires[i].submit();
		}
}

function afficherResultatVerificationFiness(resultatFiness, cible) {
	var lienFinessConnu = document.getElementById('lienFinessConnu'+(cible!=null?cible:''));
	var lienFinessInconnu = document.getElementById('lienFinessInconnu'+(cible!=null?cible:''));

	lienFinessConnu.style.display = 'none';
	lienFinessInconnu.style.display = 'none';


	if (resultatFiness != null) {
		//alert("["+resultatFiness+"]");
		if (resultatFiness == "{}") {
			// TODO: BUG, on ne devrait jamais recevoir la chaîne "{}"...
		}
		else {
			if (resultatFiness == "1") {
				lienFinessConnu.style.display = 'inline';
			}
			else {
				if (resultatFiness == "0") {
					lienFinessInconnu.style.display = 'inline';
				}
			}
		}
	}

}

function afficherResultatVerificationFinessEs(resultatFiness) {
	afficherResultatVerificationFiness(resultatFiness, "Es");
}

function afficherResultatVerificationFinessEj(resultatFiness) {
	afficherResultatVerificationFiness(resultatFiness, "Ej");
}

function afficherResultatVerificationFinessGcs(resultatFiness) {
	afficherResultatVerificationFiness(resultatFiness, "Gcs");
}


function refreshFiness(href, value,cible){

		i = href.indexOf('?',0);
		if (i>0){
			myurl = href.substring(0,i);
		}else{
			myurl = href;
		}
		myurl = myurl+'/'+value;
        var successHandler = function(transport)
        {
            var reply = transport.responseJSON;

            //zone.show(reply.content);

            afficherResultatVerificationFiness(reply.finess,cible);

            Tapestry.processScriptInReply(reply.finess);
        };


	 new Ajax.Request(myurl, { onSuccess : successHandler });

}



/*
 * Supprime la bordure sur les champs "radio" et "checkbox" pour IE 6
*/

function checkForm() {
	//Global Variables
	var inputs = new Array();
	// on cherche les input de la page
	if(ie){

		for(nfi = 0; nfi < document.getElementsByTagName('input').length; nfi++) {
			inputs.push(document.getElementsByTagName('input')[nfi]);
			if((inputs[nfi].type == "checkbox") || (inputs[nfi].type == "radio")) {
				document.getElementsByTagName('input')[nfi].style.border = "none";
			}
		}
	}
}

function afficheItem(idDivSousEtape)
{
	var divSousEtape=document.getElementById(idDivSousEtape);
	//alert("divsousEtape [" + divSousEtape + "]");
	if(divSousEtape == null)
		var divSousEtape=document.getElementById("rubrique_0");
	divSousEtape.style.display='block';
}


function afficheThrobber(lien){
	document.getElementById('throbber').className='tCenter show';
	lien.parentNode.className="btDesactiv";
	lien.removeAttribute("href");
}

function cacheThrobber(){
	document.getElementById('throbber').style.display='none';
}



function imprimerPopup(idElt,css1,css2,cssPrint)
{
    var debHeaders = "<!DOCTYPE HTML PUBLIC ><HTML><HEAD><title>Impression</title>";
    var css = "<link href=\""+css1+"\" rel=\"stylesheet\" type=\"text/css\" media=\"print, screen\" /><link href=\""+css2+"\" rel=\"stylesheet\" type=\"text/css\" media=\"print, screen\" /><link href=\""+cssPrint+"\" rel=\"stylesheet\" type=\"text/css\" media=\"print\" />";
    var finHeaders = "</HEAD><BODY>";
    var zi = "<div id=\"main\">"+document.getElementById(idElt).innerHTML+"</div>";
    var Footers = "</BODY></HTML>";

    var f = window.open("", "Impression", "height=400, width=450, toolbar=0, menubar=1, scrollbars=1, resizable=1, status=0, location=0, left=10, top=10");

    f.document.write ("" + debHeaders + css + finHeaders + zi +Footers);
	f.window.focus();
	f.window.print();

	//f.window.close();
	return true;
}

// Fonction générale pour les formulaire
function envoyerForm(type)
{
	document.getElementById('typeForm').value=type;
	document.getElementById('typeForm').form.submit();
}

// Gestion de l'affichage pour la demande de creation de structure depuis les demandes de modifications
// (lors de l'inscription).
function affichageDmdModif(typeEtablissement)
{
	// g.71516 - correction finess facultatif pour IACE
	if (typeEtablissement == 2)
	{ // Creation d'une structure de type EJ
		// On affiche la question du type de rattachement
		$('ligneQEj').show();
		if (document.getElementsByName('choix2')[0].checked)
		{ // Rattachement a une IACE
			$('finessFacultatif').show();
			$('finessObligatoire').hide();
			$('champSiren').show();
			$('champSiren2').show();
		} else
		{ // Rattachement a un ES
			$('finessFacultatif').hide();
			$('finessObligatoire').show();
			$('champSiren').hide();
			$('champSiren2').hide();
			$('siren').value='';
		}
	} else
	{ // Creation d'une structure autre que EJ
		$('ligneQEj').hide();
		$('champSiren').show();
		$('champSiren2').show();
		if (typeEtablissement == 7) // IACE
		{
			$('finessObligatoire').hide();
			$('finessFacultatif').show();
		} else
		{
			$('finessObligatoire').show();
			$('finessFacultatif').hide();
		}
	}
}
function affichage_aide_contextuelle(rootPath)
{
	popup = window.open(rootPath+'/PopupAideContextuelle', 'Aide', config='height=500, width=800, toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, directories=no, status=no');
}

// ***************************** //
// **** FONCTIONS GENERALES **** //
// ***************************** //

/**
 * Renvoie la valeur d'un radio item coché
 * @param radioItemName le nom des items radio
 * @return la valeur du premier élément coché.
 *         null, si aucun élément n'est coché
 */
function getRadioItemValue(radioItemName) {
	var elements = document.getElementsByName(radioItemName);
	var elementcount = elements.length;
	for (var i=0 ; i < elementcount ; i++) {
		var element = elements[i];
		if (element.checked) {
			return element.value;
		}
	}
	return null;
}

/**
 * Coche le premier radioItem dont la valeur est celle passée en paramètre
 * @param radioItemName le nom des radioItems à parcourir
 * @param radioItemValue la valeur du radioItem à cocher
 */
function checkRadioItem(radioItemName, radioItemValue) {
	var elements = document.getElementsByName(radioItemName);
	var elementcount = elements.length;
	for (var i=0 ; i < elementcount ; i++)
	{
		var element = elements[i];
		if (element.value == radioItemValue) {
			element.checked = true;
			break;
		}
	}
}

/**
 * Décoche tous les éléments radioitem
 * @param radioItemName le nom des radioItems à parcourir
 */
function uncheckRadioItem(radioItemName) {
	var elements = document.getElementsByName(radioItemName);
	var elementcount = elements.length;
	for (var i=0 ; i < elementcount ; i++)
	{
		var element = elements[i];
		if (element.checked) {
			element.checked = false;
		}
	}
}

/**
 * Vide la valeur (chaine vide) de l'item donné
 * @param itemName le nom de l'item
 */
function clearValue(itemName) {
	var item = $(itemName);
	if (item != null) {
		item.value = '';
	}
}

/**
 * Affiche un élement
 * @param itemName (String) l'id de l'élement
 */
function showItem(itemName) {
	//alert('showItem ['+itemName+']');
	var item = $(itemName);
	if (item != null) {
		item.style.display = '';
	}
}

/**
 * Affiche un élement en mode "block"
 * @param itemName (String) l'id de l'élement
 */
function showItemBlock(itemName) {
	var item = $(itemName);
	if (item != null) {
		item.style.display = 'block';
	}
}

/**
 * Masque un élement
 * @param itemName (String) l'id de l'élement
 */
function hideItem(itemName) {
	//alert('hideItem ['+itemName+']');
	var item = $(itemName);
	if (item != null) {
		item.style.display = 'none';
	}
}

/**
 * Désactive le code javascript des boutons javascript
 * (pour éviter le double click)
 * Grise visuellement les boutons rouge et vert
 * @param id-no-deactivate : (facultatif) id du lien ('<a id=..>') dont on ne doit pas changer l'url
 */
function disableLinkElements() {
	var idtoignore = 'id-no-deactivate';
	if (arguments.length > 0) {
		idtoignore = arguments[0];
	}
	// liens
	var links = $$('a');
	if (links != null) {
		var linkcount = links.length;
		for (var i=0; i < linkcount; i++) {
			var link = links[i];
			link.onclick = null;
			if (link.id != idtoignore) {
				link.href = '#null';
			}
		}
	}
	// Images avec évennement "onclick" : masquer + désactiver click
	var images = $$('img');
	if (images != null) {
		var imagecount = images.length;
		for (var i=0;i < imagecount; i++) {
			var image = images[i];
			if (image.onclick != null) {
				image.onclick = null;
				image.style.display = 'none';
			}
		}
	}
	// Images dans les liens : masquer
	var imagelinks = $$('a img');
	if (imagelinks != null) {
		var imagelinkcount = imagelinks.length;
		for (var i=0; i < imagelinkcount; i++) {
			var imagelink = imagelinks[i];
			imagelink.style.display = 'none';
		}
	}
	// Grise les boutons verts
	var spanvert  = $$('span.btVert');
	if (spanvert != null) {
		var spanvertcount = spanvert.length;
		for (var i = 0; i < spanvertcount ; i++) {
			var span = spanvert[i];
			span.className = 'btDesactiv';
		}
	}
	// Grise les boutons rouge
	var spanrouge = $$('span.btRouge');
	if (spanrouge != null) {
		var spanrougecount = spanrouge.length;
		for (var i = 0; i < spanrougecount ; i++) {
			var span = spanrouge[i];
			span.className = 'btDesactiv';
		}
	}
}

/**
 * Désactive le code javascript des éléments input
 * (pour éviter les modifications après click sur un bouton)
 * <p>à appeler APRES l'appel à submit</p>
 */
function disableInputElements() {
	/*var inputs = $$('input');
	if (inputs != null) {
		var inputcount = inputs.length;
		for (var i=0; i < inputcount; i++) {
			var input = inputs[i];
			if (input.type.toLowerCase() != 'hidden') {
				// on ne désactive pas les inputs de type 'hidden'
				// (pas d'interaction possible avec l'user)
				input.onclick = null;
				input.disabled = true;
			}
		}
	}
	var textareas = $$('textarea');
	if (textareas != null) {
		var textareacount = textareas.length;
		for (var i=0; i < textareacount; i++) {
			var textarea = textareas[i];
			textarea.onclick = null;
			textarea.disabled = true;
		}
	}

	disableBtnNavigation();*/
}

/**
 * Désactive les boutons suivant/précédent et popuSudoku
 */
function disableBtnNavigation(){

	//On désactive les boutons suivant/précédent s'il existent
	var btSuivant = $('btnSuivant');
	var btPrecedent = $('btnPrecedent');
	var btSuivant2 = $('btnSuivant_0');
	var btPrecedent2 = $('btnPrecedent_0');
	var btPopupSudoku = $('btnChargerCritere');
	var btPopupSudoku2 = $('btnChargerCritere_0');

	if(btSuivant != null){
		btSuivant.href = null;
		btSuivant.parentNode.className="btDesactiv";
	}

	if(btPrecedent != null){
		btPrecedent.href = null;
		btPrecedent.parentNode.className="btDesactiv";
	}

	if(btSuivant2 != null){
		btSuivant2.href = null;
		btSuivant2.parentNode.className="btDesactiv";
	}

	if(btPrecedent2 != null){
		btPrecedent2.href = null;
		btPrecedent2.parentNode.className="btDesactiv";
	}

	if(btPopupSudoku != null){
		btPopupSudoku.href = null;
		btPopupSudoku.parentNode.className="btDesactiv";
	}

	if(btPopupSudoku2 != null){
		btPopupSudoku2.href = null;
		btPopupSudoku2.parentNode.className="btDesactiv";
	}
}
/**
 * Fonction à appeler APRES l'appel à submit : désactive complètement les champs
 * input et les liens de la page, et masque les barres de status (erreurs & confirmations)
 * @param id-no-deactivate : (facultatif) id du lien ('<a id=..>') dont on ne doit pas changer l'url
 */
function disableItemsAfterSubmit(){
	hideConfirmBar();
	disableInputElements();

	// lagfix : durée entre submit et désactivation des contrôles
	var lagfix = 200; // 200ms par défaut
	if (ie6) {
		lagfix = 1000; // 1000ms = 1s pour ie6
	}

	// bugfix ie6 : attente quelques millisecondes avant appel
	if (arguments.length == 0) {
		setTimeout(function() {
			disableLinkElements();
		}, lagfix);
	} else {
		// arguments[0] = id du lien à ne pas modifier
		setTimeout(function() {
			disableLinkElements(arguments[0]);
		}, lagfix);
	}
}

/**
 * Masque les messages de confirmation & d'erreur
 */
function hideConfirmBar() {
	var confirmations = $$('p.confirm');
	if (confirmations != null) {
		var confirmationcount = confirmations.length;
		for (var i=0; i < confirmationcount; i++) {
			confirmations[i].style.display = 'none';
		}
	}
	var errors= $$('div.t-error');
	if (errors != null) {
		var errorcount = errors.length;
		for (var i=0; i < errorcount; i++) {
			errors[i].style.display = 'none';
		}
	}
}

/**
 * Passe visuellement le span dont l'id est passé en paramètre en grisé
 * @param idSpan l'id de l'élément span (ex :<span id=...>)
 */
function desactiverSpan(idSpan) {
	var span = $(idSpan);
	if (span != null) {
		span.className = 'btDesactiv';
	}
}

/**
 * Passe visuellement le span dont l'id est passé en paramètre en vert
 * @param idSpan l'id de l'élément span (ex :<span id=...>)
 */
function reactiverSpanVert(idSpan) {
	var span = $(idSpan);
	if (span != null) {
		span.className = 'btVert';
	}
}

/**
 * Passe visuellement le span dont l'id est passé en paramètre en rouge
 * @param idSpan l'id de l'élément span (ex :<span id=...>)
 */
function reactiverSpanRouge(idSpan) {
	var span = $(idSpan);
	if (span != null) {
		span.className = 'btRouge';
	}
}

/**
 * Définit le contenu html d'un élément, s'il existe
 * @param itemId l'id de l'élément
 * @param content le contenu de l'élément
 */
function setInnerHtml(itemId, content) {
	var item = $(itemId);
	if (item != null) {
		item.innerHTML = content;
	}
}

/**
 * Détermine si une chaine se termine par la sous-chaine donnée
 * @param string (String) la chaine
 * @param substring (String) la sous-chaine
 * @return (boolean) true si string se termine par substring, false sinon
 */
function stringEndsWith(string, substring) {
	var stringlength = string.length;
	var substringlength = substring.length;
	// position supposée de la sous-chaine dans la chaine (en partant de la fin)
	var substringposition = stringlength - substringlength;

	if (substringposition < 0) {
		// si la chaine est moins longue que la sous-chaine, elle ne peut pas la contenir
		return false;
	} else {
		// on extrait la fin de la chaine pour voir si elle correspond à la sous-chaine
		return ( string.substr(substringposition, substringlength) == substring );
	}
}

/**
 * Détermine si une chaine commence par la sous-chaine donnée
 * @param string (String) la chaine
 * @param substring (String) la sous-chaine
 * @return (boolean) true si string commence par substring, false sinon
 */
function stringStartsWith(string, substring) {
	var stringlength = string.length;
	var substringlength = substring.length;

	if (stringlength < substringlength) {
		// si la chaine est moins longue que la sous-chaine, elle ne peut pas la contenir
		return false;
	} else {
		// on extrait le début de la chaine pour voir s'il correspond à la sous-chaine
		return ( string.substr(0, substringlength) == substring );
	}
}

/**
 * Détermine si une chaine commence et finit par les sous-chaines données
 * @param string la chaine
 * @param startstring la sous-chaine de début
 * @param endstring la sous-chaine de fin
 */
function stringStartsAndEndsWith(string, startstring, endstring) {
	return (stringStartsWith(string, startstring) && stringEndsWith(string, endstring));
}

/**
 * Détermine si une chaine fait partie de la liste des chaines passées en paraètre
 * @param string (String) la chaine
 * @param otherstrings (array) tableau de chaines à tester
 * @return (boolean) true si string est contenue dans otherstrings, false sinon
 */
function isStringAmong(string, otherstrings) {
	var itemcount = otherstrings.length;
	for (var i = 0 ; i < itemcount ; i++) {
		if (string == otherstrings[i]) {
			return true;
		}
	}
	// string pas trouvée
	return false;
}

/**
 * Déplace la fenêtre sur l'anchre dont le nom est passé en paramètre
 * @param anchorName le nom de l'ancre
 */
function jumpToAnchor(anchorName) {
	window.location = window.location + '#' + anchorName;
}

/**
 * Empeche un évennement d'arriver à terme
 * @param e l'evennement dont on veut interrompre le comportement par défaut
 * @see http://www.openjs.com/articles/prevent_default_action/
 */
function stopEvent(event) {
	if(!event) var event = window.event;

	//e.cancelBubble is supported by IE - this will kill the bubbling process.
	event.cancelBubble = true;
	event.returnValue = false;

	//e.stopPropagation works only in Firefox.
	if (event.stopPropagation) {
		event.stopPropagation();
		event.preventDefault();
	}
	return false;
}

//////////////////////////////////////////////////////////////////////
// Custom JQuery Plugins
//////////////////////////////////////////////////////////////////////

if (typeof jQuery != 'undefined') {

/* JQuery IE6 BGIFrame
 *
 * Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version 2.1.2
 */

(function($){

$.fn.bgiframe = ($.browser.msie && /msie 6\.0/i.test(navigator.userAgent) ? function(s) {
    s = $.extend({
        top     : 'auto', // auto == .currentStyle.borderTopWidth
        left    : 'auto', // auto == .currentStyle.borderLeftWidth
        width   : 'auto', // auto == offsetWidth
        height  : 'auto', // auto == offsetHeight
        opacity : true,
        src     : 'javascript:false;'
    }, s);
    var html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
                   'style="display:block;position:absolute;z-index:-1;'+
                       (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
                       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
                       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
                       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
                       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
                '"/>';
    return this.each(function() {
        if ( $(this).children('iframe.bgiframe').length === 0 )
            this.insertBefore( document.createElement(html), this.firstChild );
    });
} : function() { return this; });

// old alias
$.fn.bgIframe = $.fn.bgiframe;

function prop(n) {
    return n && n.constructor === Number ? n + 'px' : n;
}

})(jQuery);

/*
 * Preload Images
 */
(function($) {
  var cache = [];
  // Arguments are image paths relative to the current page.
  $.preLoadImages = function() {
    var args_len = arguments.length;
    for (var i = args_len; i--;) {
      var cacheImage = document.createElement('img');
      cacheImage.src = arguments[i];
      cache.push(cacheImage);
    }
  };
})(jQuery);
/*
 * Localisation FR DatePicker
 */
(function($){
	$.datepicker.regional['fr'] = {
		closeText: 'Fermer',
		prevText: 'Pr&eacute;c&eacute;dent',
		nextText: 'Suivant',
		currentText: 'Aujourd\'hui',
		monthNames: ['Janvier','F&eacute;vrier','Mars','Avril','Mai','Juin',
		'Juillet','Ao&ucirc;t','Septembre','Octobre','Novembre','D&eacute;cembre'],
		monthNamesShort: ['Janv.','F&eacute;vr.','Mars','Avril','Mai','Juin',
		'Juil.','Ao&ucirc;t','Sept.','Oct.','Nov.','D&eacute;c.'],
		dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
		dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
		dayNamesMin: ['D','L','M','M','J','V','S'],
		weekHeader: 'Sem.',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
})(jQuery);

///////////////////////////////////////
// Code JQuery personnalisé
///////////////////////////////////////

/*
 * Personnalisation DatePicker
 */
(function($){
	$.datepicker.setDefaults( $.datepicker.regional['fr'] );
	$.datepicker.setDefaults({
		changeMonth: true,
		changeYear: true,
		buttonImageOnly: true,
		buttonText: 'Ouvrir le calendrier',
   		showOn: 'button',
   		buttonImageOnly: true
	});
})(jQuery);

/*
 * Personalisation jQuery Validator
 */
if (jQuery.validator) {
	jQuery.validator.setDefaults({
		highlight: function(input) {
			jQuery(input).addClass("ui-state-highlight");
		},
		unhighlight: function(input) {
			jQuery(input).removeClass("ui-state-highlight");
		},
		errorPlacement: function(error, element) {
			error.insertAfter(element);
		},
		success: function(label){
			label.text('').addClass("success");
		}
	});

	// teste si la valeur est un numérique
	jQuery.validator.methods.numeric = function(value) {
		return (! isNaN(value));
	};

	// teste si le nombre de décimales ne dépasse pas le maximum autorisé;
	jQuery.validator.methods.maxdigits = function(value, element, param) {
		var dotpos = value.indexOf('.');
		if (dotpos == -1) {
			return true;
		} else {
			var afterdot = value.substring(dotpos + 1);
			if (afterdot.length > param) return false;
		}
		return true;
	};
}

/*
 * Images
 */
/**
 * Préchargement des images (et stockage du chemin)
 * @param imagePath le chemin des images
 */
function preloadImagesUI(imagePath) {
	imagePath += '/';

	jQuery.datepicker.setDefaults({
   		buttonImage: imagePath + 'picto_calendar.gif'
	});

	jQuery.preLoadImages(
		imagePath + "picto_calendar.gif",
		imagePath + 'ajax-loader.gif',
		imagePath + 'ui-bg_diagonals-thick_90_eeeeee_40x40.png',
		imagePath + 'ui-bg_flat_15_cd0a0a_40x100.png',
		imagePath + 'ui-bg_glass_50_3baae3_1x400.png',
		imagePath + 'ui-bg_glass_80_d7ebf9_1x400.png',
		imagePath + 'ui-bg_glass_100_e4f1fb_1x400.png',
		imagePath + 'ui-bg_highlight-hard_70_000000_1x100.png',
		imagePath + 'ui-bg_highlight-hard_100_f2f5f7_1x100.png',
		imagePath + 'ui-bg_highlight-soft_25_ffef8f_1x100.png',
		imagePath + 'ui-bg_highlight-soft_100_deedf7_1x100.png',
		imagePath + 'ui-icons_2e83ff_256x240.gif',
		imagePath + 'ui-icons_3d80b3_256x240.gif',
		imagePath + 'ui-icons_72a7cf_256x240.gif',
		imagePath + 'ui-icons_2694e8_256x240.gif',
		imagePath + 'ui-icons_ffffff_256x240.gif'
	);
};

/**
 * Initialisation des jQuery DatePicker sur l'ensemble des input possédant la classe "datepicker"
 * (la classe "datepicker" est retirée pour éviter un double init)
 */
function initDatePickers() {
	jQuery( 'input.datepicker' )
		.removeClass('datepicker')
		.datepicker();
}

/**
 * On repositionne le dialogue "loading" au centre de la fenêtre
 */
function loading_center_dialog() {
	if (loading_div != null) {
		loading_div.position({my: 'center', at: 'center', of: window, offset:0});
	}
}


// la fenêtre de chargement
var loading_div = null;
var loading_handlers_active = false;

/**
 * Fonction appelée pour afficher l'overlay de chargement en plein écran
 */
function loading(element) {
	if(element == "none") {

		// La fenêtre de chargement
		loading_div = jQuery(
		  '<div id="loadingdiv" class="ui-dialog ui-widget ui-widget-content ui-corner-all" style="position:relative; z-index: 10000">'
		+ '	<div class="ui-dialog-content ui-corner-all ui-widget ui-widget-content loading" >'
		+ '		<p>'
		+ '		<img src="'+SARAImgRootPath+'/ajax-loader.gif" alt="Chargement en cours" width="220" height="19" ><br/>'
		+ '		Chargement en cours...</p>'
		+ '	</div>'
		+ '</div>'
		).appendTo('body');

		// On ne ferme pas l'overlay sur un appui de la touche echap
		var options = {
			'options': {
				'closeOnEscape': false
			}
		};
		jQuery.extend(loading_div, options);

		loading_center_dialog();

		var overlay = new jQuery.ui.dialog.overlay(loading_div);
		jQuery.ui.dialog.overlay.resize();

		if (! ie6) { // Sur les navigateurs autres que IE6, on peut déslectionner l'élément mis en valeur
			loading_div.focus();
		}
		if (ie) { // Sur IE7 & IE8, on doit déclencher 2 fois l'évennement pour qu'il soit pris en compte
			loading_center_dialog();
		}

		if (! loading_handlers_active) {
			// Gestion du Redimensionnement de la page
			jQuery(window).bind('resize', loading_center_dialog);

			// Gestion du Scroll de la page
			jQuery(window).bind('scroll', loading_center_dialog);

			// on indique que les évennements sont déjà en place
			loading_handlers_active = true;
		}
	}
	else {
		ajaxLoading(element);
	}
}

function stop_loading() {
	jQuery(loading_div).remove();
	jQuery('div.ui-widget-overlay').remove();
	loading_div = null;
	jQuery('#ajaxloadingdiv').remove();
}

/**
 * Fonction appelée pour afficher l'overlay de chargement sur une div avant rechargement AJAX [gx82744]
 */
function ajaxLoading(element) {

	element = jQuery(element);

	if (ie6) { // IE6 ==> on masque les select
		element.find('select').hide();
	}
	var overlay = jQuery('<div class="ui-widget-overlay"></div>').appendTo(element);
	if (ie6) { // IE6 => on redimensionne le masque (propriété CSS height=100% ignorée)..
		overlay.height( element.height() );
	}

	var loader = jQuery(
	  '<div id="ajaxloadingdiv" class="ui-dialog ui-widget ui-widget-content ui-corner-all" style="position:absolute; z-index: 10000; margin: auto">'
	+ '	<div class="ui-dialog-content ui-corner-all ui-widget ui-widget-content loading" >'
	+ '		<p>'
	+ '		<img src="' + SARAImgRootPath + '/ajax-loader.gif" alt="Chargement en cours" width="220" height="19"><br/>'
	+ '		Chargement en cours...</p>'
	+ '	</div>'
	+ '</div>'
	).appendTo(element);
	loader.css({
		'top'  : element.height()/2 - loader.height()/2,
		'left' : element.width()/2 - loader.width()/2
	});

}

} // End if (typeof jQuery != 'undefined')

/////////////////////////////
// Fin JQuery
/////////////////////////////

///////////////////
// AJAX Tapestry //
///////////////////

function updateDivAjaxTapestry(zoneId, url) {
	var zone = $(zoneId).zone;
	var successHandler = function(transport)
    {
        var reply = transport.responseJSON;
        zone.show(reply.content);
        Tapestry.processScriptInReply(reply);
    };

	new Ajax.Request(url, { onSuccess : successHandler });
}

function updateDivAjaxTapestryActionLink(zoneId, actionlinkId) {
	var actionlink = $(actionlinkId);
	var url = actionlink.href;
	updateDivAjaxTapestry(zoneId, url);
}

/**
 * [gx82744] Intercepter et empêcher l'appui sur la touche escape
 * (éviter qu'un chargement de page ne soit interrompu)
 */
document.onkeydown = function(event) {
    if (!event) event = window.event;
    if (event.keyCode == 27) {
        return stopEvent(event);
    }
    return true;
};

function redirectionOngletPec(idLi){
	if(idLi != null && idLi != 'undefined' && idLi != ""){
		var li = document.getElementById(idLi);
		if(li != null && li != 'undefined' && li != ""){
			var filsLi = document.getElementById(idLi).children;
			if(filsLi != null && filsLi != 'undefined' && filsLi != ""){
				redirectWithCatchDblClick(filsLi[0]);
			}
		}
	}
}

/**
 * Permet de faire une redirection en évitant les doubles click
 * On crée un lien caché avec un href valable, et un lien avez cette fonction en guise de href
 */
function redirectWithCatchDblClick(lienReference){
	if(lienReference != null && lienReference != 'undefined' && lienReference != ""){
		var url = lienReference.href;
		if(url != null && url != 'undefined' && url != ""){
			lienReference.href='javascript:void(0);';
			if(url != 'javascript:void(0);')
				window.location.href = url;
		}
	}
}


/******************************************************************************/
/*fonction permettant de véifier que les champs mail et mail conf sont identiques*/
function checkEmailEmailConf(){
	//recupération email
	var email=jQuery("#email").val();
	//recuperation email conf
	var emailConf=jQuery("#emailConf").val();
	var imgEmailConf = jQuery("#emailConf").parent().find(".t-error-icon");
	var erreurEmailConfMasquee =imgEmailConf.is(':hidden');

	var imgEmail = jQuery("#email").parent().find(".t-error-icon");
	var erreurEmailMasquee =imgEmail.is(':hidden');


	if(email !="" && emailConf!="" && emailConf == email ){

		/*Afficher l'image de validation si aucune erreur*/

		if(erreurEmailMasquee==true&&erreurEmailConfMasquee==true){

			jQuery("#EmailValid").show();

		}else{
			jQuery("#EmailValid").hide();
		}

	}else{
		jQuery("#EmailValid").hide();
	}
}

/* permet de faire une requete ajax fin de rafraichir la zone d'affichage des structures
 *  ayant une raison sociale qui contient la chaine saisie*/
function autocompleteStructure(form,idField){
	var field = document.getElementById(idField);
	var textLength = field.value.length;
	if(textLength > 2)
	{
		refreshTapestryURL(document.listStructureExistantForm.action+'?'+$(form.id).serialize(),'zoneRechercheStructure');
	}
}

function updateHiddenCheck(idDivUpdCheck, eltSrc, idElt) {
	updateHiddenCheck(idDivUpdCheck, eltSrc, idElt, "-", true);
}

function updateHiddenCheck(idDivUpdCheck, eltSrc, idElt, separateur, separateurfin,ajouter,ajouterGris) {
	  var coche = eltSrc.checked;
	  var idsStructureOrig = document.getElementsByName(idDivUpdCheck);
	  var checks = idsStructureOrig[0].value;
	  if (true==coche) {
	    if (checks.indexOf(idElt+separateur)==-1) {
		    if (true == separateurfin){
		    	checks += idElt+separateur;
		    }
		    else{
		    	if (checks != ""){
		    		checks += separateur;
		    	}
		    	checks += idElt;
		    }
	    }
	  } else {
	    var iElt = checks.indexOf(idElt+separateur);
	    if (iElt!=-1) {
	       checks = checks.substring(0,iElt)+checks.substring(iElt+idElt.length+separateur.length);

	    }
	  }
	  var idsStructure = document.getElementsByName(idDivUpdCheck);
	  idsStructure[0].value = checks;
	  griserDegriser(ajouter,ajouterGris);

	}

function updateAllHiddenCheck(idDivUpdCheck, idDivUpdCheckTemp) {
	  var idsStructure = document.getElementsByName(idDivUpdCheck);
	  var idsStructureTemp = document.getElementsByName(idDivUpdCheckTemp);

	  idsStructure[0].value = idsStructureTemp[0].value;

	}

function updateCheck(idDivUpdCheck, eltSrc, idElt, separateur, separateurfin,ajouter,ajouterGris) {
	  var coche = eltSrc.checked;
	  var idsStructureOrig = document.getElementsByName(idDivUpdCheck);
	  var checks = idsStructureOrig[0].innerHTML;
	  if (true==coche) {
	    if (checks.indexOf(idElt+separateur)==-1) {
		    if (true == separateurfin){
		    	checks += idElt+separateur;
		    }
		    else{
		    	if (checks != ""){
		    		checks += separateur;
		    	}
		    	checks += idElt;
		    }
	    }
	  } else {
	    var iElt = checks.indexOf(idElt+separateur);
	    if (iElt!=-1) {
	       checks = checks.substring(0,iElt)+checks.substring(iElt+idElt.length+separateur.length);
	    } else {
	    	iElt = checks.indexOf(separateur+idElt);
		    if (iElt!=-1) {
		       checks = checks.substring(0,iElt)+checks.substring(iElt+idElt.length+separateur.length);
		    } else {
		    	iElt = checks.indexOf(idElt);
		    	 if (iElt!=-1) {
		  	       checks = checks.substring(0,iElt)+checks.substring(iElt+idElt.length);
		  	    }
		    }
	    }
	  }
	  var idsStructure = document.getElementsByName(idDivUpdCheck);
	  idsStructure[0].innerHTML = checks;
	  griserDegriser(ajouter,ajouterGris);
}

function griserDegriser(ajouter,ajouterGris){
	var nbInputChecked=jQuery('table.activiteTable input[name=checkboxActivite]:checked');
	  var nbStrSelected=jQuery("table[name=tableStructures] input:checked");
	  var nameBtn="boutonAjouter";
	  var bouton=jQuery("img[name='"+nameBtn+"']");
	  if(nbInputChecked.length>0 && bouton.length>0 && nbStrSelected.length>0){
		  jQuery('img[name=boutonAjouter]').attr('src',ajouter);
	  }else if(bouton.length>0){
		  jQuery('img[name=boutonAjouter]').attr('src',ajouterGris);
	  }
}

function updateChecksAndRadios(idCheckboxes, idDivChecks) {
	updateChecksAndRadios(idCheckboxes, idDivChecks, "-");
}
function updateChecksAndRadios(idCheckboxes, idDivChecks, separateur) {

	decocherAll(idCheckboxes);
    var checks = document.getElementsByName(idDivChecks)[0].value;
    var checkArray = checks.split(separateur);
    for (var iChecks=0;iChecks<checkArray.length-1;iChecks++) {
      try {
          var eltCheck = document.getElementById(checkArray[iChecks]);
          if (undefined!=eltCheck) {
             eltCheck.checked = true;
          }
      } catch (e) {}
    }
}

function decocherAll(idCheckboxes) {
	var chk = document.getElementsByName(idCheckboxes);
	for (i = 0; i < chk.length; i++)
	{
	   if (chk[i].checked == true)
	   {
		   chk[i].checked = false;
	   }
	}
}

function checkEmail() {
	var email=jQuery("#email").val();
	var emailConf=jQuery("#emailConf").val();

	var imgEmailNonValid = jQuery("#email").parent().find(".t-error-icon");

	var imgEmailConfValid = jQuery("#EmailValid");
	var imgEmailConfNonValid = jQuery("#emailConf").parent().find(".t-error-icon");

	if(email !="" && emailConf!="" && emailConf == email ){
		/* Image de validation */
		jQuery(imgEmailNonValid).hide();
		jQuery(imgEmailConfValid).show();
		jQuery(imgEmailConfNonValid).hide();

		jQuery("#infosAdminForm .alertJS").hide();
	}
	else {
		/* Image de non validation */
		jQuery(imgEmailNonValid).show();
		jQuery(imgEmailConfValid).hide();
		jQuery(imgEmailConfNonValid).show();

		/* Message d'alerte */
		jQuery("#infosAdminForm .alertJS").html("Les deux E-mail ne sont pas identiques. Veuillez v\351rifier votre saisie.");
		jQuery("#infosAdminForm .alertJS").show();
	}
}


/**
 * Methode par defaut de traitement des erreurs ajax
 */
function defaultAjaxErrorHandler(jqXHR, options) {
	var opts = options?options:{}; 
	if (opts.ignoreControlStatus === true || jqXHR.readyState == 4) {
		// On récupère et affiche le message d'erreur
		var div = opts.div ? opts.div : "blocMenusGD";
		var type = opts.type ? opts.type : "warning";
		var message = {
			text : decodeURI(jqXHR.getResponseHeader("ErrorMessage")!=null?jqXHR.getResponseHeader("ErrorMessage"):"Le traitement asynchrone n'a pas abouti au serveur"),
			type : type
		};
		
		if(opts.ttl){
			message.timeout=opts.ttl;
		}
		
		if(opts.forceHideMessage){
			message.forceHideMessage=opts.forceHideMessage;
		}
		
		jQuery("#" + div).message(message);
	}
}



/**
 * Centre l'element au centre de l'ecran.
 * @param elementJQ: element jQuery dont on souhaite centrer sur l'ecran.
 */
function windowCenter(elementJQ) {

	var elementH = elementJQ.height();
	var elementW = elementJQ.width();

	var margingTop = (-1) * Math.floor(elementH/2);
	var margingLeft = (-1) *Math.floor( elementW/2);


	elementJQ.css({'position' : 'fixed', 'left' : '50%', 'margin-left' : margingLeft, 'top' : '50%', 'margin-top' : margingTop });

}

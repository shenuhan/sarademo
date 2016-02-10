/**
 * comp-memo.js : Fichier JavaScript associe au composant Memo (CompMemo.tml, CompMemo.java).
 * Depends des librairies js suivantes :
 *  - jquery 1.4.4 ou superieure
 *  - jquery-ui 1.8.9 ou superieure
 *  - jquery.easing 1.3 ou superieure
 *  - json2.js
 */

/**
 * Constructeur de l'objet. Permet d'initialiser des attributs/constantes.
 */
function CompMemo() {
	this.memoBottomOffset = 40;
	this.memoRightOffset = 10;
	this.memoMaxResizeOffset = 50;
	this.memoHeight = 200;
	this.memoWidth = 400;
	this.resizeTime = new Date(1, 1, 2000, 12, 00, 00);
	this.resizeTimeout = false;
	this.resizeDelta = 200;
	this.resizeOpenedMemo = undefined;
}

/**
 * Methodes de l'objet CompMemo.
 */
CompMemo.prototype = {
	
	/**
	 * Initialisation du composant.
	 */
	initialize : function initialize() {
		/* Positionnement du memo */
		compMemo.positionMemo(true);
		/* Au chargement de la page, les memos sont caches. */
		compMemo.hideAllMemos();
		/* Gestion des evenements. */
		compMemo.wireUpEvents();
	},
	
	/**
	 * @return : Retourne un objet jQuery correspondant à l'ensemble des memos de la page.
	 */
	getLesMemos : function getLesMemos() {
		return jQuery('.memo_show_hide');
	},
	
	/**
	 * Positionnement du memo.
	 * 
	 * @param setInitHeightWidth : Booleen indiquant s'il faut utiliser les constantes par defaut de largeur et hauteur pour le memo.
	 */
	positionMemo : function positionMemo(setInitHeightWidth) {
		var lesMemos = compMemo.getLesMemos();
		
		lesMemos.each(function(index, memo) {
			var memoPosFromTop = (jQuery(window).height() - jQuery(memo).height() - compMemo.memoBottomOffset);
			
			jQuery(memo).css({
				position : 'absolute'
			});
			if (setInitHeightWidth) {
				jQuery(memo).css({
					height : compMemo.memoHeight,
					width : compMemo.memoWidth
				});
			} else {
				jQuery(memo).css({
					height : jQuery(memo).height(),
					width : jQuery(memo).width()
				});
			}
			jQuery(memo).css({
				top : memoPosFromTop,
				right : compMemo.memoRightOffset
			});
			
			jQuery(memo).stickySidebar({
				padding : memoPosFromTop
			});
		});
	},
	
	/**
	 * Gestion des evenements
	 */
	wireUpEvents : function wireUpEvents() {
		/* Connexion des evenements aux fonctions qui les gerent. */
		jQuery('.memo_icon').click(function(event) {
			compMemo.memoIconClick(event);
		});
		jQuery('.memo_close').click(function(event) {
			compMemo.memoCloseButtonClick(event);
		});
		jQuery('.memo_save').click(function(event) {
			compMemo.memoSaveButtonClick(event);
		});
		jQuery('.memo_text').change(function(event) {
			compMemo.memoTextChange(event);
		});
		
		/* Connexion des evenements lie a la navigation dans la page */
		jQuery("a").bind("click", function(event) {
			compMemo.leavePageWithUnsaveMemo(event);
		}); /* Attach the event click for all links in the page */
		jQuery("form").bind("submit", function(event) {
			compMemo.leavePageWithUnsaveMemo(event);
		}); /* Attach the event submit for all forms in the page */
		jQuery("input[type=submit]").bind("click", function(event) {
			compMemo.leavePageWithUnsaveMemo(event);
		}); /*
																													 * Attach the event click for all inputs in
																													 * the page
																													 */
		
		/* Connexion de l'evenement lie au redimensionnement du navigateur. */
		jQuery(window).resize(function() {
			compMemo.resizeBrowser();
		});
	},
	
	/**
	 * Recupere sous forme d'un objet la chaine json definissant l'etat du memo.
	 * 
	 * @param memo : Le memo concerne.
	 * @return : Retourne un objet javascript.
	 */
	getMemoSettings : function getMemoSettings(memo) {
		return jQuery.parseJSON(jQuery(jQuery(memo).parent().children()[2]).val());
	},
	
	/**
	 * Permet de renseigner le champ cache du memo qui contient les settings au format json.
	 * 
	 * @param memo : Memo sur lequel on veut changer les settings.
	 * @param jsonData : Objet Javascript a mettre dans le champ cache du memo.
	 */
	setMemoSettings : function setMemoSettings(memo, jsonData) {
		jQuery(jQuery(memo).parent().children()[2]).val(JSON.stringify(jsonData));
	},
	
	/**
	 * Permet de renseigner la valeur du setting isModified. Cette valeur est un booleen.
	 * 
	 * @param isModified : Valeur du booleen.
	 * @param memo : Memo sur lequel on veut changer le setting.
	 */
	setMemoSettingsIsModified : function setMemoSettingsIsModified(isModified, memo) {
		var memoSettings = compMemo.getMemoSettings(memo);
		memoSettings.isModified = isModified;
		compMemo.setMemoSettings(memo, memoSettings);
	},
	
	/**
	 * Permet de renseigner la valeur du setting isOpened. Cette valeur est un booleen.
	 * 
	 * @param isOpened : Valeur du booleen.
	 * @param memo : Memo sur lequel on veut changer le setting.
	 */
	setMemoSettingsIsOpened : function setMemoSettingsIsOpened(isOpened, memo) {
		var memoSettings = compMemo.getMemoSettings(memo);
		memoSettings.isOpened = isOpened;
		compMemo.setMemoSettings(memo, memoSettings);
	},
	
	/**
	 * Determine si le memo dans etre cache ou masque en fonction de son etat de visibilite.
	 * 
	 * @param memo : Le memo concerne
	 * @return : Retourne un booleen indiquant si le memo dans être visible ou cache.
	 */
	needToShowOrHideMemo : function needToShowOrHideMemo(memo) {
		var showMemo = false;
		if (jQuery(memo).is(':visible')) {
			showMemo = false;
		} else {
			showMemo = true;
		}
		
		return showMemo;
	},
	
	/**
	 * Implemente la logique d'affichage et masquage du memo en fonction de son etat.
	 * 
	 * @param memo : Le memo concerne.
	 * @param lesMemos : Les memos de la page.
	 * @param showMemo : Booleen indiquant s'il faut afficher ou masque le memo.
	 */
	showOrHideMemo : function showOrHideMemo(memo, lesMemos, showMemo) {
		var memo_settings = compMemo.getMemoSettings(memo);
		if (showMemo) {
			jQuery(memo).show();
			/* Retablit l'icone de l'ensemble des memos de la page. */
			lesMemos.each(function(index, obj) {
				var objSettings = jQuery.parseJSON(jQuery(jQuery(obj).parent().children()[2]).val());
				if (objSettings.idMemo == -1) {
					jQuery(jQuery(obj).parent().children()[0]).attr('src', SARAImgRootPath + '/memo_icon.gif');
				} else {
					jQuery(jQuery(obj).parent().children()[0]).attr('title', 'Afficher le memo');
					jQuery(jQuery(obj).parent().children()[0]).attr('src', SARAImgRootPath + '/memo_icon.gif');
					jQuery(jQuery(obj).parent().children()[0]).attr('title', 'Afficher le memo');
				}
			});
			/* Change l'icone indiquant que le memo est selectionne. */
			compMemo.updateIconSelectedMemo(memo);
			/* Indique que le memo est ouvert */
			compMemo.setMemoSettingsIsOpened(true, memo);
		} else {
			jQuery(memo).hide();
			if (memo_settings.idMemo == -1) {
				jQuery(jQuery(memo).parent().children()[0]).attr('src', SARAImgRootPath + '/memo_icon.gif');
			} else {
				jQuery(jQuery(memo).parent().children()[0]).attr('title', 'Afficher le memo');
				jQuery(jQuery(memo).parent().children()[0]).attr('src', SARAImgRootPath + '/memo_icon.gif');
				jQuery(jQuery(memo).parent().children()[0]).attr('title', 'Afficher le memo');
			}
			/* Indique que le memo est ferme */
			compMemo.setMemoSettingsIsOpened(false, memo);
		}
	},
	
	/**
	 * Affiche une boite de confirmation Oui Non.
	 * 
	 * @param yesFunction : Fonction a executer lorsque l'utilisateur repond 'Oui'.
	 * @param noFunction: Fonction a executer lorsque l'utilisateur repond 'Non'.
	 * @param arg1 : 1er argument passe a la fonction yesFunction et noFunction.
	 * @param arg2 : 2e argument passe a la fonction yesFunction et noFunction.
	 */
	showConfirmDialog : function showConfirmDialog(yesFunction, noFunction, arg1, arg2) {
		/* Message de confirmation, si le memo a ete modifie et non enregistrer */
		jQuery('<div></div>').appendTo('body').html('<div>Le mémo a été modifié. Voulez vous quitter sans sauvegarder ?</div>').dialog({
			modal : true,
			draggable : false,
			zIndex : 10000,
			autoOpen : true,
			width : 'auto',
			resizable : false,
			buttons : {
				'Oui' : function() {
					yesFunction(arg1, arg2);
					jQuery(this).dialog("close");
				},
				'Non' : function() {
					noFunction(arg1, arg2);
					jQuery(this).dialog("close");
				}
			},
			open : function(event, ui) {
				/* Cache l'entete et le bouton ferme de la boite de dialogue par defaut de jQuery-ui. */
				jQuery(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
				jQuery(this).closest(".ui-dialog").find(".ui-dialog-titlebar:first").hide();
			}
		});
	},
	
	/**
	 * @return : Retourne l'url vers la page pour les requetes ajax.
	 */
	getAjaxPageUrl : function getAjaxPageUrl() {
		var protocol = document.location.protocol;
		var host = document.location.host;
		var websiteName = compMemo.getWebsiteName();
		
		return protocol + "//" + host + "/" + websiteName + "/ajax/compmemoajax";
	},
	
	/**
	 * @return : Retourne le nom du site (partie apres le port dans l'url)
	 */
	getWebsiteName : function getWebsiteName() {
		var pathNames = document.location.pathname.split("/");
		
		return pathNames[1];
	},
	
	/**
	 * Gestion de l'affichage du memo.
	 * 
	 * @param memo : Le memo concerne.
	 * @param refreshAndRestoreValue : Booleen indiquant si on doit rafraichir le memo avec les valeurs stockees dans les settings du memo.
	 */
	memoDisplay : function memoDisplay(memo, refreshAndRestoreValue) {
		/* Determine si on doit cacher ou afficher le memo. */
		var showMemo = compMemo.needToShowOrHideMemo(memo);
		
		/* Initialisation de la position et du css du memo. */
		var memoPosFromTop = (jQuery(window).height() - jQuery(memo).height() - compMemo.memoBottomOffset);
		
		/* Application du comportement redimensionnable. */
		jQuery(memo).resizable({
			handles : 'nw',
			minHeight : compMemo.memoHeight,
			minWidth : compMemo.memoWidth,
			maxHeight : jQuery(window).height() - compMemo.memoMaxResizeOffset,
			maxWidth : jQuery(window).width() - compMemo.memoMaxResizeOffset,
			alsoResize : jQuery(jQuery(memo).children()[1]).children()[0],
			stop : function(event, ui) {
				var memoPosFromTop = (jQuery(window).height() - ui.size.height - compMemo.memoBottomOffset);
				jQuery(memo).stickySidebar({
					padding : memoPosFromTop
				});
			}
		});
		/* Affichage de l'icone de redimensionnement. */
		jQuery('.ui-resizable-nw').addClass('ui-icon-gripsmall-diagonal-nw');
		jQuery('.ui-resizable-nw').css({
			top : 0,
			left : 0
		});
		jQuery('.ui-icon-gripsmall-diagonal-nw').css('background-image', 'url(' + SARAImgRootPath + '/memo_resize-nw.gif)');
		
		/* Positionnement du bouton 'fermer'. */
		jQuery('.memo_close').css('background-image', 'url(' + SARAImgRootPath + '/memo_close.gif)');
		jQuery('.memo_close').css({
			height : 24,
			width : 24,
			position : 'absolute',
			right : 0,
			top : 0
		});
		
		/* Application du comportement premier plan et animation lors du scroll. */
		jQuery(memo).stickySidebar({
			padding : memoPosFromTop
		});
		
		if (refreshAndRestoreValue) {
			compMemo.refreshInfosDerniereModification(memo);
			compMemo.restoreLastSavedValue(memo);
		}
		
		/* On cache tous les memos */
		compMemo.hideAllMemos();
		/* On affiche/masque le memo (div memo_show_hide) correspondant. */
		compMemo.showOrHideMemo(memo, compMemo.getLesMemos(), showMemo);
	},
	
	/**
	 * Evenement : Clic sur l'icone du memo.
	 * 
	 * @param event : Objet javascript correspondant a l'evenement.
	 */
	memoIconClick : function memoIconClick(event) {
		event.stopPropagation();
		event.preventDefault();
		var openingMemo = jQuery(jQuery(event.target).parent().children()[1]);
		/*
		 * Dans le cas ou on ferme le memo ouvert en cliquant sur l'icone du memo, ou l'icone d'un autre memo.
		 */
		if (compMemo.needConfirmDialogOnIconClosing()) {
			var closingMemo = compMemo.getOpenedMemo();
			/* Cas ou on ferme le memo ouvert en cliquant sur l'icone d'un autre memo. */
			if (openingMemo[0] != closingMemo) /* [0] pour comparer les 2 objets jquery et pas l'objet DOM. */
			{
				/* Message de confirmation, si le memo a ete modifie et non enregistrer */
				compMemo.showConfirmDialog(compMemo.yesConfirmDialogIconCloseMemo, compMemo.noConfirmDialogCloseMemo, closingMemo, openingMemo);
			} else /* Cas ou on ferme le memo ouvert en cliquant sur l'icone du memo ouvert. */
			{
				/* Message de confirmation, si le memo a ete modifie et non enregistrer */
				compMemo.showConfirmDialog(compMemo.yesConfirmDialogCloseMemo, compMemo.noConfirmDialogCloseMemo, closingMemo, openingMemo);
			}
		} else {
			compMemo.memoDisplay(openingMemo, true);
		}
	},
	
	/**
	 * Evenement : Clic sur le boutton "Fermer" d'un memo.
	 * 
	 * @param event : Objet javascript correspondant a l'evenement.
	 */
	memoCloseButtonClick : function memoCloseButtonClick(event) {
		event.stopPropagation();
		event.preventDefault();
		/* On recupere la div memo_show_hide correspondante au memo. */
		var memo = jQuery(event.target).parent();
		
		/* Message de confirmation, si le memo a ete modifie et non enregistrer */
		var memoSettings = compMemo.getMemoSettings(memo);
		if (memoSettings.isModified) {
			compMemo.showConfirmDialog(compMemo.yesConfirmDialogCloseMemo, compMemo.noConfirmDialogCloseMemo, memo, undefined);
		} else {
			/* Determine si on doit cacher ou afficher le memo. */
			var showMemo = compMemo.needToShowOrHideMemo(memo);
			/* Gestion de la fermeture du memo et de l'icone dans la page correspondant au memo. */
			compMemo.showOrHideMemo(memo, compMemo.getLesMemos(), showMemo);
		}
	},
	
	/**
	 * Evenement : Clic sur le bouton "Enregistrer" d'un memo.
	 * 
	 * @param event : Objet javascript correspondant a l'evenement.
	 */
	memoSaveButtonClick : function memoSaveButtonClick(event) {
		/* On recupere le memo qui a declenche l'enregistrement */
		var memo = jQuery(event.target).parent().parent();
		var memo_settings = compMemo.getMemoSettings(memo);
		var texte = jQuery(jQuery(memo.children()[1]).children()[0]).val();
		var idRapportSurModule = jQuery(jQuery(memo.children()[1]).children()[1]).val();
		/* On sauvegarde en Ajax. */
		jQuery.ajax({
			dataType : "json",
			type : 'post',
			url : compMemo.getAjaxPageUrl(),
			data : {
				"idMemo" : memo_settings.idMemo,
				"texte" : texte,
				"rapportSurModule" : idRapportSurModule
			},
			success : function(jsonData) {
				compMemo.memoSaveButtonClickSuccess(jsonData, memo);
			}
		});
	},
	
	/**
	 * Callback declenchee lors du retour de la methode ajax appelees sur le boutton d'enregistrement.
	 * 
	 * @param jsonData : Objet javascript correspondant au settings du memo.
	 * @param memo : Le memo concerne.
	 */
	memoSaveButtonClickSuccess : function memoSaveButtonClickSuccess(jsonData, memo) {
		/* On actualise les settings du memo. */
		compMemo.setMemoSettings(memo, jsonData);
		/* On change l'icone du memo, si necessaire. */
		compMemo.updateIconSelectedMemo(memo);
		/* On rafraichit les infos de derniere modification. */
		compMemo.refreshInfosDerniereModification(memo);
	},
	
	/**
	 * Permet de mettre a jour l'icone du memo en cours d'utilisation.
	 * 
	 * @param memo
	 */
	updateIconSelectedMemo : function updateIconSelectedMemo(memo) {
		var memo_settings = compMemo.getMemoSettings(memo);
		if (memo_settings.idMemo == -1) {
			jQuery(jQuery(memo).parent().children()[0]).attr('src', SARAImgRootPath + '/memo_icon_new_selected.gif');
			jQuery(jQuery(memo).parent().children()[0]).attr('title', 'Afficher le memo');
		} else {
			jQuery(jQuery(memo).parent().children()[0]).attr('src', SARAImgRootPath + '/memo_icon_selected.gif');
			jQuery(jQuery(memo).parent().children()[0]).attr('title', 'Afficher le memo');
		}
	},
	
	/**
	 * Evenement : Changement du texte dans le textarea.
	 * 
	 * @param event : Objet javascript correspondant a l'evenement.
	 */
	memoTextChange : function memoTextChange(event) {
		/* On recupere le memo qui a declenche l'enregistrement */
		var memo = jQuery(event.target).parent().parent();
		
		/*
		 * On detecte qu'une modification du texte du memo a eu lieu, donc on active le marqueur de modification dans les settings du memo.
		 */
		compMemo.setMemoSettingsIsModified(true, memo);
	},
	
	/**
	 * Methode de gestion du bouton Oui de la boite de confirmation dans le cas ou on quitte la page courante.
	 * 
	 * @param arg1 : 1er argument non utilise.
	 * @param event : evenement qui a ete annule et qui faudra redeclencher.
	 */
	yesConfirmDialogLeavePage : function yesConfirmDialogLeavePage(arg1, event) {
		/* On redeclenche l'evenement qui avait ete stoppe pour attendre le choix de l'utilisateur. */
		var link = jQuery(event.target).attr('href');
		if (link != undefined) /* Cas d'un lien "<a>". */
		{
			window.location = link;
		} else /* Cas d'un submit(). */
		{
			jQuery(event.target).parent()[0].submit();
		}
	},
	
	/**
	 * Methode de gestion du bouton Oui de la boite de confirmation dans le cas ou on ferme le memo a partir d'un clic sur l'icone du memo.
	 * 
	 * @param closingMemo : Memo qui doit se fermer.
	 * @param openingMemo : Memo qui doit s'ouvrir.
	 */
	yesConfirmDialogIconCloseMemo : function yesConfirmDialogIconCloseMemo(closingMemo, openingMemo) {
		/* On restaure la valeur avant modification. */
		compMemo.restoreLastSavedValue(closingMemo);
		
		/* Fermeture du memo qui doit se fermer. */
		compMemo.yesConfirmDialogCloseMemo(closingMemo, openingMemo);
		
		/* Affichage du memo qui doit s'ouvrir. */
		compMemo.memoDisplay(openingMemo, true);
	},
	
	/**
	 * Methode de gestion du bouton Oui de la boite de confirmation dans le cas ou on ferme le memo a partir du bouton Fermer du memo.
	 * 
	 * @param closingMemo : Memo qui doit se fermer.
	 * @param openingMemo : Memo qui doit s'ouvrir.
	 */
	yesConfirmDialogCloseMemo : function yesConfirmDialogCloseMemo(closingMemo, openingMemo) {
		/* On restaure la valeur avant modification */
		compMemo.restoreLastSavedValue(closingMemo);
		/* Retire le marqueur de modification */
		compMemo.setMemoSettingsIsModified(false, closingMemo);
		/* Gestion de la fermeture du memo et de l'icone dans la page correspondant au memo. */
		compMemo.showOrHideMemo(closingMemo, compMemo.getLesMemos(), false);
	},
	
	/**
	 * Methode de gestion du bouton Non de la boite de confirmation.
	 * 
	 * @param memo : Memo qui doit se fermer.
	 * @param arg2 : 2e argument non utilise.
	 */
	noConfirmDialogCloseMemo : function noConfirmDialogCloseMemo(memo, arg2) {
		/* Gestion de la fermeture du memo et de l'icone dans la page correspondant au memo. */
		compMemo.showOrHideMemo(memo, compMemo.getLesMemos(), true);
	},
	
	/**
	 * @return Retourne le memo ouvert actuellement. Si aucun memo n'est ouvert, cela renvoi undefined.
	 */
	getOpenedMemo : function getOpenedMemo() {
		var lesMemos = compMemo.getLesMemos();
		
		var openedMemo = undefined;
		
		lesMemos.each(function(index, currentMemo) {
			var currentMemoSettings = compMemo.getMemoSettings(currentMemo);
			if (currentMemoSettings.isOpened == true) {
				openedMemo = currentMemo;
				return false; /* Stop la boucle each jquery quand l'element est trouve. */
			}
		});
		
		return openedMemo;
	},
	
	/**
	 * @return Retourne un booleen indiquant s'il faut afficher la boite de dialogue de confirmation lorsqu'un memo est fermé par un clic sur son icone ou un
	 *         clic sur un autre memo.
	 */
	needConfirmDialogOnIconClosing : function needConfirmDialogOnIconClosing() {
		var needConfirmDialog = false;
		
		/* On regarde si un memo est ouvert. */
		var openedMemo = compMemo.getOpenedMemo();
		if (openedMemo != undefined) {
			/* On regarde si le memo ouvert est modifie. */
			var memoSettings = compMemo.getMemoSettings(openedMemo);
			if (memoSettings.isModified) {
				needConfirmDialog = true;
			}
		}
		
		return needConfirmDialog;
	},
	
	/**
	 * Cache tous les memos.
	 */
	hideAllMemos : function hideAllMemos() {
		var lesMemos = compMemo.getLesMemos();
		lesMemos.each(function(index, currentMemo) {
			compMemo.setMemoSettingsIsOpened(false, currentMemo);
			jQuery(currentMemo).hide();
		});
	},
	
	/**
	 * Evenement : Gestion de l'affichage de la boite de dialogue dans le cas ou on tente de quitter la page par navigation alors qu'un memo est ouvert et non
	 * sauvegarde.
	 * 
	 * @param event : Evenement declencheur de quittage de la page.
	 */
	leavePageWithUnsaveMemo : function leavePageWithUnsaveMemo(event) {
		var openedMemo = compMemo.getOpenedMemo();
		if (openedMemo != undefined) {
			var openedMemoSettings = compMemo.getMemoSettings(openedMemo);
			if (openedMemoSettings.isModified) {
				event.preventDefault();
				compMemo.showConfirmDialog(compMemo.yesConfirmDialogLeavePage, compMemo.noConfirmDialogCloseMemo, openedMemo, event);
			}
		}
	},
	
	/**
	 * Restaure la derniere valeur sauvegarde pour le memo dans son textarea.
	 * 
	 * @param memo : Le memo concerne.
	 */
	restoreLastSavedValue : function restoreLastSavedValue(memo) {
		/* On recupere la valeur du dernier texte sauvegarde a partir du memoSettings. */
		var memoSettings = compMemo.getMemoSettings(memo);
		/* On remplace le texte dans le textarea. */
		jQuery(jQuery(jQuery(memo).children()[1]).children()[0]).val(memoSettings.lastSavedValue);
		if (!memoSettings.isEcriture) {
			jQuery(jQuery(jQuery(memo).children()[1]).children()[0]).attr('readonly', true);
		} else {
			jQuery(jQuery(jQuery(memo).children()[1]).children()[0]).removeAttr('readonly');
		}
	},
	
	/**
	 * Rafraichit la zone affichant les informations de derniere modification.
	 * 
	 * @param memo : Le memo concerne.
	 */
	refreshInfosDerniereModification : function refreshInfosDerniereModification(memo) {
		var memoSettings = compMemo.getMemoSettings(memo);
		/* Si on doit afficher les infos de derniere modification */
		if (memoSettings.dateModification != "") {
			/* On remplace la date de derniere modification. */
			jQuery(memo).find('.memo_date').text(memoSettings.dateModification);
			/* On remplace l'auteur de la derniere modification. */
			jQuery(memo).find('.memo_author').text(memoSettings.author);
			/* On affiche la zone. */
			jQuery(memo).find('.memo_last_modif').show();
		} else {
			/* On masque la zone des infos de derniere modification. */
			jQuery(memo).find('.memo_last_modif').hide();
		}
	},
	
	/**
	 * Evenement : Resize du browser. Astuce permettant de declencher du code que lorsque l'utilisatur termine le redimensionnement de son navigateur et pas a
	 * chaque fois que le navigateur declenche le l'evenement resize().
	 */
	resizeBrowser : function resizeBrowser() {
		/*
		 * A la detection du resize, on sauvegarde le memo ouvert s'il y en a un. Et on cache tous les memos.
		 */
		compMemo.resizeOpenedMemo = compMemo.getOpenedMemo();
		compMemo.getLesMemos().hide();
		
		compMemo.resizeTime = new Date();
		if (compMemo.resizeTimeout === false) {
			compMemo.resizeTimeout = true;
			setTimeout(function() {
				compMemo.resizeBrowserEnd();
			}, compMemo.resizeDelta);
		}
	},
	
	/**
	 * Evenement : Fin du resize du browser.
	 */
	resizeBrowserEnd : function resizeBrowserEnd() {
		if (new Date() - compMemo.resizeTime < compMemo.resizeDelta) {
			setTimeout(function() {
				compMemo.resizeBrowserEnd();
			}, compMemo.resizeDelta);
		} else {
			compMemo.resizeTimeout = false;
			
			/* Si un memo etait ouvert avant le resize, on affiche le memo de nouveau. */
			if (compMemo.resizeOpenedMemo != undefined) {
				compMemo.memoDisplay(compMemo.resizeOpenedMemo, false);
			}
		}
	},
	
	/**
	 * Methode de debug des settings des memos. Utilise la console web de Firefox.
	 */
	debugInfo : function debugInfo() {
		var lesMemos = compMemo.getLesMemos();
		lesMemos.each(function(index, currentMemo) {
			var currentMemoSettings = compMemo.getMemoSettings(currentMemo);
			console.log(JSON.stringify(currentMemoSettings));
		});
	}
};

/**
 * Instantiation et utilisation de la classe CompMemo.
 */
var compMemo = new CompMemo();
jQuery(document).ready(function() {
	compMemo.initialize();
});

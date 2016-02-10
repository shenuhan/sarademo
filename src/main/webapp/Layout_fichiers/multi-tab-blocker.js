/**
 * 21/11/2012
 * Classe javascript permettant de bloquer l'utilisation du site a un seul onglet/fenetre par navigateur.
 */

function MultiTabBlocker()
{
	/* Activation/Desactivation des alerts de debug */
	this.isDebug = false;
	/* Attributs relatifs a la gestion du cookie */
	this.cookieName = 'multi_tab_blocker_sara_' + document.location.hostname;
	this.cookieOptions = {path: '/'};
	this.cookie = '';
	/* Attributs relatifs a l'interception de la fermeture d'un onglet/fenetre  */
	this.validNavigation = false;
	/* Nom du controller de la page d'identification (accueil) */
	this.loginControllerName = "login";
	/* Nom du controller de la page vers laquelle on redirige */
	this.redirectionControllerName = "multiTabBlockerError";
}

MultiTabBlocker.prototype = {
	
	initialize : function initialize()
	{
		if(this.getControllerName() !== this.redirectionControllerName)
		{
			this.setWindowName();
			this.checkCookies();
			this.wireUpEvents();
		}
	},
		
		
	/**
	 * Genere un morceau de chaine aleatoire de 4 caracteres.
	 * On l'utilise pour generer un identifiant d'onglet/fenetre (guid).
	 */
	s4 : function s4()
	{
		return(Math.floor(Math.random() * 0x10000 /* 65536 */).toString(16));
	},
	
	/**
	 * Genere un identifiant d'onglet/fenetre.
	 */
	guid : function guid()
	{
	    return (
	                this.s4() + this.s4() + "-" +
	                this.s4() + "-" +
	                this.s4() + "-" +
	                this.s4() + "-" +
	                this.s4() + this.s4() + this.s4()
	            );
	},
	
	/**
	 * Affecte un guid a l'onglet/fenetre si elle n'en a pas encore.
	 */
	setWindowName : function setWindowName()
	{
		if (!window.name.match(/^GUID-/))
		{
		        window.name = "GUID-" + this.guid();
		}
	},
	
	/**
	 * Verifie l'existence du cookie permettant de stocker le guid du premier onglet/fenetre ouvert.
	 * Si le cookie n'existe pas, on le cree.
	 * Si le cookie existe et que le guid de l'onglet/fenetre n'est pas celui contenu dans le cookie:
	 *    on redirige vers la page d'erreur.
	 */
	checkCookies : function checkCookies()
	{
		/* On tente de recuperer le cookie */
		this.cookie = jQuery.cookie(this.cookieName);
		if(this.cookie != null)
		{
			/* Si le cookie existe et qu'on est pas sur l'onglet/fenetre avec lequel il a ete cree,
			 * on redirige l'utilisateur vers la sortie.
			 */
		    if(this.cookie !== window.name)
		    {
		    	var redirectionUrl = this.getRedirectionPageUrl(this.redirectionControllerName);
		    	this.debugAlert("Redirection: " + redirectionUrl);
		    	window.location.replace(redirectionUrl);
		    }   
		}
		else
		{
			/* Sinon, c'est le premier onglet/fenetre, on creer le cookie. */
			this.createCookie(window.name);
		}
	},
	
	
	beforeUnload : function beforeUnload()
	{
	    if (!multiTabBlocker.validNavigation)
	    {
	    	/* Suppression du cookie uniquement si c'est l'onglet qui a creer le cookie. */
	    	var multiTabBlockerCookieValue = jQuery.cookie(multiTabBlocker.cookieName);
	    	if(multiTabBlockerCookieValue != null)
	    	{
	    		if(multiTabBlockerCookieValue === window.name)
	    		{
	    			/* Suppresion du cookie. */
	    			multiTabBlocker.removeCookie(false);
	    		}
	    	}
	    }
	},
	
	
	/**
	 * Gestion de l'interception de la fermeture d'un onglet/fenetre,
	 * afin de pouvoir si necessaire supprimer le cookie.
	 */
	wireUpEvents : function wireUpEvents()
	{
		window.onbeforeunload = this.beforeUnload;
	
		/* Attach the event keypress to exclude the F5 refresh */
		jQuery('document').bind('keypress', function(e) {
		    if (e.keyCode == 116) {
		    	multiTabBlocker.validNavigation = true;
		    }
		});
	
		/* Attach the event click for all links in the page */
		jQuery("a").bind("click", function() {
			multiTabBlocker.validNavigation = true;
		});
	
		/* Attach the event submit for all forms in the page */
		jQuery("form").bind("submit", function() {
			multiTabBlocker.validNavigation = true;
		});
	
		/* Attach the event click for all inputs in the page */
		jQuery("input[type=submit]").bind("click", function() {
			multiTabBlocker.validNavigation = true;
		});
	},
	
	/**
	 * Recupere l'url vers la page de login.
	 */
	getRedirectionPageUrl : function getRedirectionPageUrl(targetControllerName)
	{
		var protocol = document.location.protocol;
		var host = document.location.host;
		var websiteName = this.getWebsiteName(); 
		
		return protocol + "//" + host + "/" + websiteName + "/" + targetControllerName;
	},
	
	/**
	 * Recupere le nom du site (partie apres le port dans l'url)
	 */
	getWebsiteName : function getWebsiteName()
	{
		var pathNames = document.location.pathname.split("/");
		
		return pathNames[1];
	},
	
	/**
	 * Recupere le nom du controller (derniere partie dans l'url)
	 */
	getControllerName : function getControllerName()
	{
		var pathNames = document.location.pathname.split("/");
		
		return pathNames[pathNames.length - 1];
	},
	
	/**
	 * Fonction de debuggage
	 */
	debugAlert : function debugAlert(message)
	{
		if(this.isDebug)
		{
			alert(message);
		}
	},
	
	/**
	 * Suppression du cookie.
	 */
	removeCookie : function removeCookie(isRedirectingToLogin)
	{
		/* Lecture du cookie */
		var multiTabBlockerCookieValue = jQuery.cookie(multiTabBlocker.cookieName);
		/* Supression du cookie */
		jQuery.removeCookie(multiTabBlocker.cookieName, multiTabBlocker.cookieOptions);
		multiTabBlocker.debugAlert('cookie deleted :' +  multiTabBlockerCookieValue);
		
		/* Si on doit redirige vers la page de login*/
		if(isRedirectingToLogin)
		{
			var redirectionUrl = multiTabBlocker.getRedirectionPageUrl(multiTabBlocker.loginControllerName);
			multiTabBlocker.debugAlert("Redirection : " + redirectionUrl);
	    	window.location.replace(redirectionUrl);
		}
	},
	
	/**
	 * Creation du cookie.
	 */
	createCookie : function createCookie(guid)
	{
		jQuery.cookie(this.cookieName, guid, this.cookieOptions);
		this.debugAlert('cookie created : ' + jQuery.cookie(this.cookieName));
	}
};

/**
 * Instantiation et utilisation de la classe.
 */
var multiTabBlocker = new MultiTabBlocker();

jQuery(document).ready(function() {
		multiTabBlocker.initialize();
});

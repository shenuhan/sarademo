(function($) {
	$.fn.memo = function(options) {
		var result = new Memo(this, options);
		return result;
	};
	
	// empeche l'autofocus sur le premier input
	$.ui.dialog.prototype._focusTabbable = function() {
	};
})(jQuery);

/**
 * Gestion des messages de notifications.
 */
function Memo(el, options) {
	this.ctx = jQuery(el);
	this.id = this.ctx.attr("id");
	this.options = options;
	if (!(this.options && this.options.SARAImgRootPathToUse)) {
		if (!this.options) {
			this.options = {};
		}
		this.options.SARAImgRootPathToUse = SARAImgRootPath;
	}
	this.change = false;
	var self = this;
	this.initialize();
	jQuery(window).on("resize", function(e) {
		self.move();
		if (self.div) {
			self.div.resizable("option", {
				"maxHeight" : jQuery(window).height() - 10,
				"maxWidth" : jQuery(window).width() - 10
			});
		}
	});
	this.opened = false;
	return this;
}

Memo.prototype = {
	
	/**
	 * Placement de la div en fonction de la fenêtre. Ce placement s'effectue en partant du coin haut/gauche car en partant du bas/droite, jQuery bug ... la
	 * aussi ...
	 */
	move : function() {
		if (this.conteneur) {
			this.conteneur.css({
				top : jQuery(window).height() - 210,
				left : jQuery(window).width() - 410
			});
		}
	},
	
	/**
	 * Initialisation du lien permettant d'ouvrir le composant mémo. NB: si l'option options.hiden est a true alors le composant memo ne sera pas affiche.
	 */
	initialize : function() {
		var suffixe = "";
		if (this.options && this.options.type) {
			suffixe = "_" + this.options.type;
		}
		var self = this;
		
		if ((this.options.hiden == true) || (this.options.hiden == "true")) {
			this.ctx.hide();
		} else {
			this.link = jQuery("<a/>", {
				href : "#show_" + this.id
			}).append(jQuery("<img/>", {
				src : this.options.SARAImgRootPathToUse + "/memo_icon" + suffixe + ".gif",
				title : "Afficher le memo"
			}).addClass("memo_icon"));
			this.ctx.append(this.link);
			this.link.on("click", function(e) {
				e.stopPropagation();
				if(self.opened){
					self.hide();
				} else {
					self.show();
				}
			});
		}
	},
	
	/**
	 * @param text
	 */
	val : function(text) {
		jQuery(".memo_txt textarea", this.conteneur).val(text);
	},
	
	/**
	 * @param name Nom de la dernière personne ayant modifiée le mémo
	 * @param date Date de la dernière modification au format dd/MM/yyyy HH:mm
	 */
	renderInfo : function(name, date) {
		jQuery(".memo_info", this.div).html("Derni\350re modification le <span class='bold'>" + date + "</span> par <span class='bold'>" + name + "</span>");
	},
	
	/**
	 * 
	 */
	render : function() {
		
		/*
		 * bug jQuery : on ne peut rendre redimensionnable une div fixed (cf. http://bugs.jqueryui.com/ticket/3628)
		 */
		var self = this;
		
		/*
		 * Création d'une div si celle-ci n'a pas déjà été créée précédemment, sinon ré-utilisation de cette dernière.
		 */
		if (jQuery("#show_" + this.id).length === 0) {
			this.conteneur = jQuery("<div/>", {
				id : "show_" + this.id
			}).addClass("memo_conteneur");
			this.div = jQuery("<div/>").addClass("memo");
			this.close = jQuery("<div/>").addClass("memo_close");
			var textarea = jQuery("<div/>").addClass("memo_txt").append(jQuery("<textarea/>", {
				maxlength : 2800
			}));
			this.div.prepend(textarea);
			this.div.prepend(this.close);
			this.div.prepend(jQuery("<div/>").addClass("memo_info"));
			this.move();
			this.conteneur.append(this.div);
			jQuery("body").append(this.conteneur);
			
			/*
			 * Utilisation du paramètre "options.readonly"
			 */
			var readonly = false;
			if (this.options && this.options.readonly) {
				readonly = (this.options.readonly == true) || (this.options.readonly == "true");
			}
			
			if (readonly === true) {
				jQuery("textarea", textarea).attr("disabled", "disabled");
			} else {
				var save = jQuery("<div/>").append(jQuery("<button/>", {
					name : "bt_vert",
					click : function(e) {
						self.save();
					}
				}).button({
					label : "Enregistrer"
				})).addClass("memo_save");
				this.div.append(save);
			}
			
			this.close.on("click", function(e) {
				e.stopPropagation();
				self.hide();
			});
			
			jQuery(".memo_txt textarea", this.conteneur).on("change", function(e) {
				self.change = true;
			});
			
			jQuery(".memo_txt textarea", this.conteneur).keyup(function(event) {
				self.modification();
			});
			
			jQuery(".memo_save img", this.conteneur).on("click", function(e) {
				self.save();
			});
		}
		
		/*
		 * Execution du handler passé en paramètre.
		 */
		if (this.options && this.options.onRender) {
			this.options.onRender.call(this);
		}
		
		this.backup = jQuery(".memo_txt textarea", this.conteneur).val();
		
	},
	
	/**
	 * 
	 */
	rollback : function() {
		jQuery(".memo_txt textarea", this.conteneur).val(this.backup);
	},
	
	/**
	 * 
	 */
	show : function() {
		
		var self = this;
		
		/*
		 * On vérifie si le mémo n'a pas déjà été affiché
		 */
		if (this.hidePrevious()) {
			this.render();
			
			/*
			 * Modification du lien hypertexte amenant le mémo
			 */
			var img = jQuery("img", this.link);
			var src = img.attr("src").split(".gif");
			src[0] = src[0] + "_selected";
			img.attr("src", src[0] + ".gif");
			
			/* MANTIS 0017525 */
			/* A l'initialisation; le bouton enregistrer est inactif */
			jQuery('.memo_save button').attr("disabled", true).addClass("ui-state-disabled");
			if (this.conteneur == null) {
				this.conteneur = jQuery("div#show_" + this.id);
				this.div = jQuery("div.memo");
				this.close = jQuery("div.memo_close");
				
			}
			this.conteneur.show({
				effect : "drop",
				direction : "up",
				complete : function() {
					self.conteneur.draggable({
						disabled : true
					});
					self.div.resizable({
						handles : "nw",
						alsoResize : "#show_" + self.id + " textarea",
						minHeight : 200,
						minWidth : 400,
						maxHeight : jQuery(window).height() - 10,
						maxWidth : jQuery(window).width() - 10
					});
					jQuery("body").data("memo", self);
				}
			});
			
			this.opened = true;
		}
	},
	
	/**
	 * Suppression du message et de la div associée.
	 * 
	 * @returns {Boolean}
	 */
	hide : function() {
		var self = this;
		var result = true;
		if (!this.change && this.conteneur) {
			var img = jQuery(">img", this.link);
			var src = img.attr("src").split("_selected");
			img.attr("src", src[0] + src[1]);
			this.div.hide({
				complete : function() {
					// self.conteneur.remove();
					jQuery("body").removeData("memo");
					self.conteneur.hide();
					self.div.show();
				}
			});
			
			this.opened = false;
		}
		if (this.change) {
			var div = jQuery("<div/>", {
				title : "Attention"
			}).html("<p>Le m\351mo a \351t\351 modifi\351. Voulez vous quitter sans sauvegarder ?</p>").appendTo(this.conteneur);
			div.dialog({
				resizable : false,
				draggable : false,
				modal : true,
				dialogClass : "dialogbox",
				buttons : [{
					name : "bt_vert",
					text : "Oui",
					click : function() {
						self.change = false;
						self.hide();
						self.rollback();
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
			result = false;
		}
		return result;
	},
	
	/**
	 * Suppression de tous les mémos existants
	 * 
	 * @returns {Boolean}
	 */
	hidePrevious : function() {
		var result = true;
		var tmp = jQuery("body").data("memo");
		if (tmp) {
			if (tmp.id !== this.id) {
				
				/*
				 * Si un autre mémo est ouvert, alors on le ferme
				 */
				result = tmp.hide();
			} else {
				
				/*
				 * Mémo déjà ouvert, pas la peine de la réouvrir
				 */
				result = false;
			}
		}
		return result;
	},
	
	/**
	 * 
	 */
	save : function() {
		
		var self = this;
		
		/*
		 * Execution du handler passé en paramètre.
		 */
		if (this.options && this.options.onSave) {
			this.options.onSave.call(this);
		}
		this.change = false;
		this.backup = jQuery(".memo_txt textarea", this.conteneur).val();
		var img = jQuery("img", this.link);
		img.attr("src", img.attr("src").replace("_new", ""));
		
		self.activateLinks();
	},
	
	/**
	 * 
	 */
	modification : function() {
		
		var self = this;
		
		/* MANTIS 0016415 */
		/* Le nombre de caractères ne doit pas excéder 2800 caractères */
		var texte = jQuery(".memo_txt textarea", this.conteneur).val();
		if (texte.length <= 2800) {
			/* MANTIS 0017525 */
			/* Après modification, le bouton enregistrer est actif */
			if (texte != this.backup) {
				jQuery('.memo_save button').attr("disabled", false).removeClass("ui-state-disabled");
				
				self.deactivateLinks(self);
			} else {
				jQuery('.memo_save button').attr("disabled", true).addClass("ui-state-disabled");
				
				self.activateLinks();
			}
		} else {
			var newTexte = String(texte);
			jQuery(".memo_txt textarea", this.conteneur).val(newTexte.substr(0, 2800));
		}
	},
	
	deactivateLinks : function(self) {
		jQuery("#blocMenu a, #header a, #sepRub a, div.blocFilAriane a").each(function(i, element) {
			var el = jQuery(element);
			el.unbind("click");
			el.on("click", function(e) {
				self.showPopupModification(e, self);
			});
		});
	},
	
	activateLinks : function() {
		jQuery("#blocMenu a, #header a, #sepRub a, div.blocFilAriane a").each(function(i, element) {
			var el = jQuery(element);
			el.unbind("click");
		});
	},
	
	showPopupModification : function(e, self) {
		e.preventDefault();
		e.stopPropagation();
		
		var eventTarget = e.target;
		
		var div = jQuery("<div/>", {
			title : "Attention"
		}).html("<p>Le m\351mo a \351t\351 modifi\351. Voulez-vous quitter sans sauvegarder ?</p>").appendTo(this.conteneur);
		div.dialog({
			resizable : false,
			draggable : false,
			modal : true,
			dialogClass : "dialogbox",
			buttons : [{
				name : "bt_vert",
				text : "Oui",
				click : function() {
					
					self.change = false;
					self.rollback();
					self.hide();
					
					self.activateLinks();
					
					jQuery(this).dialog("close");
					jQuery(this).remove();
					
					document.location = jQuery(eventTarget).attr('href');
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
};
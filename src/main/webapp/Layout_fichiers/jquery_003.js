(function($) {
	$.fn.grid = function(options) {
		return new Grid(this, options);
	};
})(jQuery);

/**
 * Création d'un tableau dont la source de données et un tableau HTML, et gérant
 * le tri ainsi que la pagination.
 * 
 * @param el
 *            Elément HTML de type contenant un élément HTML "table"
 * @param options
 *            Liste des options du composant : 
 *            - messages.foot : Message à afficher au bas du tableau (string)
 *            - messages.previous : Message du bouton précédent du pager (string)
 *            - messages.next : Message du bouton suivant du pager (string)
 *            - dateformat : Format d'affichage des dates dans le tableau à la manière du dateFormatter Java. Necessite la classe "grid_date" (string)
 *            - howtoRead : Traitement permettant de définir la méthode de lecture d'une case du tableau (string function(Element td))
 *            - howtoCompare : Traitement permettant de définir la méthode de comparaison de 2 lignes du tableau (boolean function(Element td))
 *            - sort : Algorithme de tri :"bubble" ou "quickSort" (quickSort par défaut)
 * @returns Une référence sur le composant créé
 */
function Grid(el, options) {
	this.ctx = jQuery(el);
	this.pagerCtx = jQuery(".grid_foot", this.ctx);
	this.options = options;

	this.renderDates();

	this.head = jQuery("thead th", this.ctx);
	this.rows = jQuery("tbody>tr", this.ctx);
	this.pager = jQuery(".grid_pager", this.pagerCtx);
	this.filter = jQuery(".grid_filter", this.pagerCtx);

	this.currentPage = 1;
	this.nbPages = this.rows.length;
	var self = this;

	this.filter.on("change",
			function() {
				self.filter.val(jQuery(this).val());
				var firstLine = jQuery("tbody>tr:visible:first", self.ctx);
				for ( var i = 0; i < self.rows.length; i++) {
					if (self.rows[i] === firstLine[0]) {
						self.currentPage = Math.floor(i
								/ parseInt(jQuery(this).val())) + 1;
						break;
					}
				}
				self.renderLines();
			});

	jQuery("th", this.ctx).on("click", function(e) {
		if (!jQuery(this).hasClass("grid_no-sort")) {
			var th = jQuery(this, self.ctx);
			/* Cas particulier si le footer contient un th, alors on ne tri pas ... */
			if(jQuery(th).attr("class") != "nosort") {
				var order = "asc";
				if (th.hasClass("grid_asc")) {
					th.removeClass("grid_asc");
					th.addClass("grid_desc");
					order = "desc";
				} else {
					th.removeClass("grid_desc");
					th.addClass("grid_asc");
				}
				self.sort(order, this);
			}
		}
	});

	/*
	 * Gestion du pied du tableau
	 */
	if (this.options.foot !== "none" && jQuery("tfoot", this.ctx).length === 0) {
		jQuery("table", this.ctx).append("<tfoot><tr><td></td></tr></tfoot>");
		jQuery("tfoot td", this.ctx).attr("colspan", this.head.length);
	}

	/*
	 * Gestion du tri par défaut
	 */
	var defaultSort = jQuery(".grid_asc,.grid_desc", this.ctx);
	if (defaultSort.length === 0) {
		this.renderLines();
	} else {
		var order = "asc";

		/*
		 * On ne prend que le premier élément trié
		 */
		if (jQuery(defaultSort[0]).hasClass("grid_desc")) {
			order = "desc";
		}
		this.sort(order, defaultSort[0]);
	}
}

Grid.prototype = {

	/**
	 * Génération du pager.
	 */
	renderPager : function() {
		var self = this;
		this.pager.text("");
		if (this.nbPages > 1) {
			var span = jQuery("<span/>");
			for ( var i = this.currentPage - 1; i < this.currentPage + 2; i++) {
				if (i >= 1 && i <= this.nbPages) {
					this.renderPagerElement(i).appendTo(span);
				}
			}
			var previousMsg = "Previous";
			var nextMsg = "Next";
			if (this.options.messages.previous) {
				previousMsg = this.options.messages.previous;
			}
			if (this.options.messages.next) {
				nextMsg = this.options.messages.next;
			}
			var previous = jQuery("<a/>", {
				"name" : "pager_previous",
				"href" : location.href + ".grid/"
						+ (this.currentPage - 1),
				text : previousMsg,
				click : function(e) {
					e.stopPropagation();
					e.preventDefault();
					if (self.currentPage !== 1) {
						self.currentPage = self.currentPage - 1;
						self.renderLines();
					}
				}
			});
			var next = jQuery("<a/>", {
				"name" : "pager_next",
				"href" : location.href + ".grid/"
						+ (this.currentPage + 1),
				text : nextMsg,
				click : function(e) {
					e.stopPropagation();
					e.preventDefault();
					if (self.currentPage !== self.nbPages) {
						self.currentPage = self.currentPage + 1;
						self.renderLines();
					}
				}
			});
			if (this.currentPage === 1) {
				previous.addClass("disabled");
			}
			if (this.currentPage === this.nbPages) {
				next.addClass("disabled");
			}
			this.pager.append(previous);
			if (this.currentPage > 2) {
				this.renderPagerElement(1).appendTo(this.pager);
				this.pager.append("...");
			}
			this.pager.append(span);
			if (this.currentPage < (this.nbPages - 1)) {
				this.pager.append("...");
				this.renderPagerElement(this.nbPages).appendTo(this.pager);
			}
			this.pager.append(next);
		}
	},

	/**
	 * Génération d'une page du pager.
	 * 
	 * @param num
	 *            numéro de la page
	 * @returns Référence sur la page nouvellement créée
	 */
	renderPagerElement : function(num) {
		var self = this;
		var result = jQuery("<a/>", {
			"name" : "pager_" + num,
			"href" : location.href + ".grid/" + num,
			text : num,
			click : function(e) {
				e.stopPropagation();
				e.preventDefault();
				self.currentPage = num;
				self.renderLines();
			}
		});
		if (num === this.currentPage) {
			result.addClass("grid_current_page");
		}
		return result;
	},

	/**
	 * Recalcul du rendu du tableau en fonction de la page sélectionnée et du
	 * nombre d'éléments à afficher.
	 */
	renderLines : function() {
		var size, firstVisible;
		var visible = 0;

		/*
		 * Détermination du nombre de pages du pager
		 */
		this.nbPages = Math.ceil(this.rows.length / this.filter.val());

		for ( var i = 0; i < this.head.length; i++) {
			var th = jQuery(this.head[i]);
			if (jQuery(".grid_sort_img", th).length === 0
					&& !th.hasClass("grid_no-sort")) {
				jQuery("<span/>").addClass("grid_sort_img").prependTo(th);
			}
		}
		if (jQuery.type(this.filter.val()) === "undefined") {
			size = this.rows.length;
			firstVisible = 0;
		} else {
			size = parseInt(this.filter.val());
			firstVisible = (this.currentPage - 1) * size;
		}
		for ( var i = 0; i < this.rows.length; i++) {
			if (i >= firstVisible && i <= (firstVisible + size - 1)) {
				jQuery(this.rows[i]).removeClass("grid_odd grid_even");
				if ((i % size) % 2 !== 0)
					jQuery(this.rows[i]).addClass("grid_odd");
				else
					jQuery(this.rows[i]).addClass("grid_even");
				jQuery(this.rows[i]).show();
				visible++;
			} else {
				jQuery(this.rows[i]).hide();
			}
		}
		if (this.options.foot !== "none") {
			if (this.rows.length === 0) {
				jQuery("tfoot td", this.ctx).text(this.options.messages.empty);
			} else {
				jQuery("tfoot td", this.ctx)
						.text(
								visible + this.options.messages.foot
										+ this.rows.length);
			}
		}
		if (this.pager.length !== 0) {
			this.renderPager();
		}
		jQuery(this).trigger("render");
	},

	/**
	 * L'utilisation de dates dans le tableau nécessite la librairie tiers
	 * jquery.dateFormat (cf. https://github.com/phstc/jquery-dateFormat).
	 * 
	 * Gestion des dates pour permettre l'affichage ainsi que le tri selon une
	 * regex déterminée par le paramètre "dateformat" (valeur "dd/MM/yyyy
	 * HH:mm:ss" par défaut). Les colonnes du tableau doivent posséder un entête
	 * possédant la classe ".grid_date", et les valeurs contenus doivent être
	 * formatés comme indiqués sur le lien
	 * https://github.com/phstc/jquery-dateFormat#expected-input-dates-formats.
	 * 
	 */
	renderDates : function() {
		var self = this;
		var headers = jQuery("th", this.ctx);
		var format = "dd/MM/yyyy HH:mm:ss";
		if (this.options.dateformat) {
			format = this.options.dateformat;
		}
		for ( var i = 0; i < headers.length; i++) {
			if (jQuery(headers[i]).hasClass("grid_date")) {
				jQuery("tbody td:nth-child(" + (i + 1) + ")", this.ctx).each(
						function(i, el) {
							var container = jQuery(el);
							var tmp = jQuery.format.date(container.text(),
									"yyyy;MM;dd;HH;mm;ss;SSS").split(";");
							for ( var i = 0; i < tmp.length; i++) {
								if (tmp[i] === "") {
									tmp[i] = 0;
								} else {
									tmp[i] = parseInt(tmp[i]);
								}
							}
							if (self.options.howtoRead) {
								container = self.options.howtoRead(container);
							}
							container.attr("original-date", new Date(tmp[0],
									tmp[1], tmp[2], tmp[3], tmp[4], tmp[5],
									tmp[6], tmp[7]).getTime());
							container.text(jQuery.format.date(container.text(),
									format));
						});
			}
		}
	},

	/**
	 * Tri du tableau à l'aide d'un algorithme de type tri à bulles qui n'est
	 * pas très optimimum en soi et qui convient surtout à des tableaux ne
	 * comportant pas trop d'éléments.
	 * 
	 * @param order
	 *            Ordre du tri à effectuer ("asc" ou "desc")
	 * @param el
	 *            Elément HTML th représentant l'entête de la colonne sur
	 *            laquelle le tableau doit être trié. Cet entête doit contenir
	 *            une une classe permettant de définir le type de la donnée afin
	 *            de permettre le tri ("string", "numeric", ...). Enfin si
	 *            l'entête possède la classe "grid_no-sort", aucun tri n'est
	 *            effectué.
	 * @param p
	 *            Indice de la colonne triée
	 * @param strategy
	 *            Stratégie de tri à appliquer sur la colonne
	 */
	bubbleSort : function(order, el, p, strategy) {
	    var hasSwap = true;
	    for (var i = 0; i < this.rows.length; i++) {
	        hasSwap = false;
	        for (var j = 0, endIndex = this.rows.length - 1 - i; j < endIndex; j++) {
	        	var tr = this.rows[j];
		    	var td = jQuery("td:nth-child(" + (p + 1) + ")", tr);
	        	var ntr = this.rows[j + 1];
	        	var ntd = jQuery("td:nth-child(" + (p + 1) + ")", ntr);
	            if (this.test(td, ntd, order, strategy)) {
	            	this.rows[j] = ntr;
					this.rows[j + 1] = tr;
	                hasSwap = true;
	            };
	        };
	        if (!hasSwap) {
	            break;
	        }
	    }
	},

	/**
	 * Test de comparaison de deux lignes lors d'un tri.
	 * 
	 * @param e1
	 *            Texte contenu dans la colonne triée d'une ligne d'un tableau
	 * @param e2
	 *            Texte contenu dans la colonne triée de la ligne suivant e1
	 * @param order
	 *            Ordre du tri ("asc" ou "desc")
	 * @param strategy
	 *            stratégie de tri à utiliser ("numeric" ou "string")
	 * @returns Un booléen indiquant si les lignes doivent être inversés
	 */
	test : function(e1, e2, order, strategy) {
		var str1 = e1.text();
		var str2 = e2.text();
		if (this.options.howtoRead) {
			e1 = this.options.howtoRead(e1);
			e2 = this.options.howtoRead(e2);
		}
		if (this.options.howtoCompare) {
			str1 = this.options.howtoCompare(e1);
			str2 = this.options.howtoCompare(e2);
		}
		var comparison = 0;
		switch (strategy) {
		case "numeric":
			if (str1 === "")
				str1 = "0";
			if (str2 === "")
				str2 = "0";
			var f1 = parseFloat(str1);
			var f2 = parseFloat(str2);
			if (f1 < f2) {
				comparison = -1;
			} else if (f1 > f2){
				comparison = 1;
			}
			break;
		case "string":
			if (str1.toLowerCase() < str2.toLowerCase()) {
				comparison = -1;
			} else if (str1.toLowerCase() > str2.toLowerCase()){
				comparison = 1;
			}
			break;
		case "date":
			var f1 = parseInt(e1.attr("original-date"));
			var f2 = parseInt(e2.attr("original-date"));
			if (f1 < f2) {
				comparison = -1;
			} else if (f1 > f2){
				comparison = 1;
			}
			break;
		default:
			if (str1 < str2) {
				comparison = -1;
			} else if (str1 > str2){
				comparison = 1;
			}
			break;
		}
		return comparison != 0 && (order === "asc"  && comparison > 0 || comparison < 0 && order === "desc");
	},

	/**
	 * Déclenchement du tri en fonction l'algorithme choisi.
	 * 
	 * @param order
	 *            Ordre du tri à effectuer ("asc" ou "desc")
	 * @param el
	 *            Elément HTML th représentant l'entête de la colonne sur
	 *            laquelle le tableau doit être trié. Cet entête doit contenir
	 *            une une classe permettant de définir le type de la donnée afin
	 *            de permettre le tri ("string", "numeric", ...). Enfin si
	 *            l'entête possède la classe "grid_no-sort", aucun tri n'est
	 *            effectué.
	 */
	sort : function(order, el) {
		var p = 0;
		var headers = jQuery("th", this.ctx);
		var strategy = "string";
		for ( var i = 0; i < headers.length; i++) {
			if (headers[i] === el) {
				p = i;
				if (jQuery(headers[i]).hasClass("grid_numeric")) {
					strategy = "numeric";
				}
				if (jQuery(headers[i]).hasClass("grid_date")) {
					strategy = "date";
				}
			} else {
				jQuery(headers[i]).removeClass("grid_asc");
				jQuery(headers[i]).removeClass("grid_desc");
			}
		}
		this.bubbleSort(order, el, p, strategy);
		jQuery("tbody", this.ctx).empty().append(this.rows);
		this.renderLines();
	},
	
	/**
	 * Rafraîchissement des lignes du tableau.
	 */
	flush : function() {
		this.rows = jQuery("tbody>tr", this.ctx);

		/*
		 * Gestion du tri par défaut
		 */
		var defaultSort = jQuery(".grid_asc,.grid_desc", this.ctx);
		if (defaultSort.length === 0) {
			this.renderLines();
		} else {
			var order = "asc";

			/*
			 * On ne prend que le premier élément trié
			 */
			if (jQuery(defaultSort[0]).hasClass("grid_desc")) {
				order = "desc";
			}
			this.sort(order, defaultSort[0]);
		}
	}

};
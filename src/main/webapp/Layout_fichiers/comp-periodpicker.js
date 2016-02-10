/**
 * Fichier javascript associe au composant CompPeriodPicker (CompPeriodPicker.java).
 * Ce code est inspire et detourne du plugin javascript http://ppicker.paulds.fr.
 * Le code a ete adapte pour le transformer en composant Tapestry.
 * 
 * Requiert jQuery 1.8.3 ou superieur.
 */

/**
 * Constructeur du period picker.
 * el : input type=text de la date de debut.
 * opts : options du plugin (format json).
 */
function Period_picker(el, opts) {
	if (typeof (opts) != "object") {
		opts = {};
	}
	
	jQuery.extend(this, Period_picker.DEFAULT_OPTS, opts);

	this.input = jQuery(el);
	this.bindMethodsToObj("showOrHide", "show", "hide", "reset", "strToDate",
			"dateToStr", "strpad", "selectMonth", "selectPeriod",
			"hideIfClickOutside");

	this.build();

	this.hide();
};

Period_picker.DEFAULT_OPTS = {
	month_names : [ "Janvier", "F&eacute;vrier", "Mars", "Avril", "Mai",
			"Juin", "Juillet", "Ao&ucirc;t", "Septembre", "Octobre",
			"Novembre", "D&eacute;cembre" ],
	short_day_names : [ "D", "L", "M", "M", "J", "V", "S" ],
	start_of_week : 1,
	date_min : '',
	date_max : ''
};

Period_picker.prototype = {

	/**
	 * Initialisation du plugin.
	 */
	build : function() {

		/*
		 * Recupere les objets DOM correspondants au input DateBegin et DateEnd.
		 */
		this.input0TextField = jQuery(this.input);
		this.input1TextField = jQuery(this.input).next().next();
		jQuery(this.input0TextField).bind('click', this.showOrHide);
		jQuery(this.input1TextField).bind('click', this.showOrHide);
		
		/*
		 * Recupere la div correspondante a la partie visible contenant les
		 * champs DateBegin et DateEnd. On nommera cette partie "label".
		 */
		this.label = jQuery(this.input).parents('.period_picker_label');
		/*
		 * Recupere la div correspondante a la partie deroulante contenant le
		 * calendrier. On nommera cette partie "pannel".
		 */
		this.pannel = jQuery(jQuery(this.input).parents('.period_picker_wrapper')
				.children()[1]);
		
		/*
		 * Recupere la div correspondante au conteneur global d'un periodPicker.
		 */
		this.wrapper = jQuery(this.input).parents('.period_picker_wrapper');
		/*
		 * On regarde si la class css "" est presente sur le conteneur global.
		 * Si oui, alors le parametre isEmptyDateEndAllowed est egal a "true".
		 * Sinon, alors le parametre isEmptyDateEndAllowed est egal a "false".
		 */
		this.isEmptyDateEndAllowed = (this.wrapper
				.hasClass('empty_date_end_allowed')) ? true : false;

		/* Bind du boutton "croix" de la partie label sur l'evenement click. */
		jQuery('a', this.label).click(this.reset);

		/* Bind de l'event click du pannel. */
		jQuery(this.pannel).click(this.pannelClick);

		/*
		 * Bind des boutons "suivant" et "precedent", permettant la navigation
		 * entre mois dans la partie pannel, sur l'evenement click.
		 */
		jQuery('.move_left', this.pannel).click(this.bindToObj(function() {
			this.moveMonthBy(-1);
		}));
		jQuery('.move_right', this.pannel).click(this.bindToObj(function() {
			this.moveMonthBy(1);
		}));

		/*
		 * Selection de la date courante en fonction de si c'est rempli ou pas.
		 */
		this.initCurrentPeriod();
	},

	initCurrentPeriod : function() {
		/*
		 * Selection de la date courante en fonction de si c'est rempli ou pas.
		 */
		/*
		 * Initialise les attributs permettant de stocker les DateBegin et
		 * DateEnd temporaire.
		 */
		this.input0Temp = this.input0TextField.val();
		this.input1Temp = this.input1TextField.val();

		var reg = new RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
		if (this.input0Temp != '') {
			var matches = this.input0Temp.match(reg);
			this.currentMonth = this.strToDate(matches[0]);
		} else {
			this.currentMonth = new Date();
		}
		this.selectMonth(this.currentMonth, 'firstMonth');
	},

	/**
	 * Handler de gestion de l'evenement click sur le pannel. Permet de gerer
	 * correctement le masquage du calendrier lorsqu'on clic en dehors du
	 * caldendrier.
	 * 
	 * @param event
	 */
	pannelClick : function(event) {
		event.stopPropagation();
	},

	/**
	 * Determine s'il faut afficher ou masque la partie pannel.
	 */
	showOrHide : function() {
		if (this.pannel.is(':visible')) {
			this.hide();
		} else {

			/* Repositionne la zone deroulante */
			var x = jQuery(this.wrapper).position().left;
			x = x - 85; /* Décalage vers la gauche */
			if(x < 0) { /* Si on sort de l'écran on repositionne vers la droite */
				x = 10;
			}
			
			jQuery(this.pannel).css({
				position:'absolute',
				left:x, 
				zIndex:1000
			});
			
			this.show();
		}
	},

	/**
	 * Affiche la partie pannel.
	 */
	show : function() {
		jQuery([ window, document.body ]).click(this.hideIfClickOutside);
		this.initCurrentPeriod();
		this.pannel.show();
	},

	/**
	 * Masque la partie pannel.
	 */
	hide : function() {
		if (this.pannel.is(':visible')) {
			

			if ((this.input1Temp == '') && (this.isEmptyDateEndAllowed)) {
				if(this.input0TextField.val() != this.input0Temp || this.input1TextField.val() != this.input1Temp){
					/* Mise a jour de la valeur des champs. */
					this.input0TextField.val(this.input0Temp);
					this.input1TextField.val(this.input1Temp);
					/* Declenchement de l'evenement onChange() */				
					this.pannel.hide();
					this.input0TextField.change();
					this.input1TextField.change();
				}
			} else if (this.input1Temp != '') {
				if(this.input0TextField.val() != this.input0Temp || this.input1TextField.val() != this.input1Temp){
					/* Mise a jour de la valeur des champs. */
					this.input0TextField.val(this.input0Temp);
					this.input1TextField.val(this.input1Temp);
					/* Declenchement de l'evenement onChange() */				
					this.pannel.hide();
					this.input0TextField.change();
					this.input1TextField.change();
				} else {
					this.pannel.hide();
				}
			} else {
				this.pannel.hide();
				jQuery(this.input1TextField).removeClass('highlight');
				jQuery(this.input0TextField).addClass('highlight');
			}
		}
	},

	/**
	 * Vide les champs input contenant les dates.
	 */
	emptyInputFields : function() {
		jQuery(this.input0TextField).val('');
		this.input0Temp = jQuery(this.input0TextField).val();
		jQuery(this.input1TextField).val('');
		this.input1Temp = jQuery(this.input1TextField).val();
		/* Declenchement de l'evenement onChange() */
		this.input0TextField.change();
		this.input1TextField.change();
	},

	/**
	 * Reset des champs DateBegin et DateEnd.
	 */
	reset : function() {
		/* On vide les champs date. */
		this.emptyInputFields();
		this.printSelection();
	},

	/**
	 * Generation d'un bloc affichant un mois de calendrier.
	 */
	selectMonth : function(date, dest) {
		var newMonth = new Date(date.getFullYear(), date.getMonth(), 1);

		if (dest == 'firstMonth') {
			this.currentMonth = newMonth;
		}
		var rangeStart = this.rangeStart(date), rangeEnd = this.rangeEnd(date);
		var numDays = this.daysBetween(rangeStart, rangeEnd);
		var dayCells = "<tr><th colspan='7' class='monthName'>"
				+ this.month_names[date.getMonth()] + " " + date.getFullYear()
				+ "</th></tr><tr>";

		jQuery(this.adjustDays(this.short_day_names)).each(function() {
			dayCells += "<th>" + this + "</th>";
		});

		dayCells += "</tr>";

		for ( var i = 0; i <= numDays; i++) {
			var currentDay = new Date(rangeStart.getFullYear(), rangeStart
					.getMonth(), rangeStart.getDate() + i, 12, 00);

			if (this.isFirstDayOfWeek(currentDay))
				dayCells += "<tr>";

			if (currentDay.getMonth() == date.getMonth()
					&& (this.date_min == '' || this.daysBetween(currentDay,
							this.strToDate(this.date_min)) <= 0)
					&& (this.date_max == '' || this.daysBetween(currentDay,
							this.strToDate(this.date_max)) >= 0)) {
				dayCells += '<td class="selectable_day" date="'
						+ this.dateToStr(currentDay) + '">'
						+ currentDay.getDate() + '</td>';
			} else {
				dayCells += '<td class="unselected_month" date="'
						+ this.dateToStr(currentDay) + '">'
						+ currentDay.getDate() + '</td>';
			}
			;

			if (this.isLastDayOfWeek(currentDay))
				dayCells += "</tr>";
		}

		jQuery('.period_picker_' + dest, this.pannel).html(
				"<table>" + dayCells + "</table>");

		jQuery("td[date='" + this.dateToStr(new Date()) + "']", this.tbody)
				.addClass("today");

		jQuery("td.selectable_day", this.tbody).mouseover(function() {
			jQuery(this).addClass("hover");
		});
		jQuery("td.selectable_day", this.tbody).mouseout(function() {
			jQuery(this).removeClass("hover");
		});

		if (dest == 'firstMonth') {
			var newMonth = new Date(this.currentMonth.getFullYear(),
					this.currentMonth.getMonth() + 1, 1);
			this.selectMonth(newMonth, 'secondMonth');
		} else {
			jQuery('td td', this.pannel).unbind('click');
			jQuery('td td', this.pannel).click(this.selectPeriod);
			this.printSelection();
		}
	},

	/**
	 * Change de mois
	 * 
	 * @param move :
	 *            "-1" recule de un mois. "1" avance de 1 mois.
	 */
	moveMonthBy : function(move) {
		if (move < 0) {
			var newMonth = new Date(this.currentMonth.getFullYear(),
					this.currentMonth.getMonth() + move + 1, -1);
			this.selectMonth(newMonth, 'firstMonth');
		} else {
			var newMonth = new Date(this.currentMonth.getFullYear(),
					this.currentMonth.getMonth() + move, 1);
			this.selectMonth(newMonth, 'firstMonth');
		}
	},

	/**
	 * Gestion de la selection d'un periode. Remplit les champs dateBegin et
	 * dateEnd lors de la selection d'un jour dans le caldendrier.
	 * 
	 * @param event :
	 *            evenement envoye par le jour clique.
	 */
	selectPeriod : function(event) {
		var el = event.target;

		if ((this.date_min == '' || this.daysBetween(this.strToDate(jQuery(el).attr(
				'date')), this.strToDate(this.date_min)) <= 0)
				&& (this.date_max == '' || this.daysBetween(this
						.strToDate(jQuery(el).attr('date')), this
						.strToDate(this.date_max)) >= 0)) {
			if (jQuery(this.input0TextField).hasClass('highlight')) {
				this.input1Temp = '';
				this.input0Temp = jQuery(el).attr('date');

				jQuery(this.input0TextField).removeClass('highlight');
				jQuery(this.input1TextField).addClass('highlight');
			} else {
				if (this.daysBetween(this.strToDate(this.input0Temp), this
						.strToDate(jQuery(el).attr('date'))) >= 0) {
					this.input1Temp = jQuery(el).attr('date');
				} else {
					this.input1Temp = this.input0Temp;
					this.input0Temp = jQuery(el).attr('date');
				}

				jQuery(this.input1TextField).removeClass('highlight');
				jQuery(this.input0TextField).addClass('highlight');
			}
		}

		this.printSelection();
	},

	daysBetween : function(start, end) {
		start = Date
				.UTC(start.getFullYear(), start.getMonth(), start.getDate());
		end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
		return (end - start) / 86400000;
	},

	changeDayTo : function(dayOfWeek, date, direction) {
		var difference = direction
				* (Math.abs(date.getDay() - dayOfWeek - (direction * 7)) % 7);
		return new Date(date.getFullYear(), date.getMonth(), date.getDate()
				+ difference);
	},

	rangeStart : function(date) {
		return this.changeDayTo(this.start_of_week, new Date(
				date.getFullYear(), date.getMonth()), -1);
	},

	rangeEnd : function(date) {
		return this.changeDayTo((this.start_of_week - 1) % 7, new Date(date
				.getFullYear(), date.getMonth() + 1, 0), 1);
	},

	isFirstDayOfWeek : function(date) {
		return date.getDay() == this.start_of_week;
	},

	isLastDayOfWeek : function(date) {
		return date.getDay() == (this.start_of_week - 1) % 7;
	},

	dateToStr : function(date) {
		return this.strpad(date.getDate()) + "/" + this.strpad(date.getMonth() + 1) + "/"
				+ this.strpad(date.getFullYear());
	},

	strToDate : function(string) {
		var matches;
		var reg = new RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

		if (matches = string.match(reg)) {
			if (matches[1] == 0 && matches[3] == 0 && matches[2] == 0)
				return new Date();
			else
				return new Date(matches[3], matches[2] - 1, matches[1]);
		} else {
			return new Date();
		}
		;
	},

	strpad : function(num) {
		if (parseInt(num) < 10)
			return "0" + parseInt(num);
		else
			return parseInt(num);
	},

	hideIfClickOutside : function(event) {
		if ((event.target != this.input0TextField[0])
				&& (event.target != this.input1TextField[0])) {
			this.hide();
		}
	},

	printSelection : function() {
		jQuery('.selected', this.pannel).removeClass('selected');
		jQuery('.selected_fade', this.pannel).removeClass('selected_fade');

		if (this.input0Temp != '' && this.input1Temp != '') {
			var start = (this.strToDate(this.input0Temp) < this.strToDate(jQuery(
					'td td:first', this.pannel).attr('date')) ? this
					.strToDate(jQuery('td td:first', this.pannel).attr('date'))
					: this.strToDate(this.input0Temp));
			var end = (this.strToDate(this.input1Temp) > this.strToDate(jQuery(
					'td td:last', this.pannel).attr('date')) ? this
					.strToDate(jQuery('td td:last', this.pannel).attr('date'))
					: this.strToDate(this.input1Temp));

			for ( var i = 0; i <= this.daysBetween(start, end); i++) {
				jQuery(
						'td.selectable_day[date="'
								+ this.dateToStr(new Date(start.getFullYear(),
										start.getMonth(), start.getDate() + i))
								+ '"]', this.pannel).addClass('selected');
				jQuery(
						'td.unselected_month[date="'
								+ this.dateToStr(new Date(start.getFullYear(),
										start.getMonth(), start.getDate() + i))
								+ '"]', this.pannel).addClass('selected_fade');
			}
			
			// Mantis 4335
			// Fermer automatiquement la boite en renseignant les inputs
			this.hide();
			
		} else if (this.input0Temp != '') {
			jQuery('td.selectable_day[date="' + this.input0Temp + '"]', this.pannel)
					.addClass('selected');
			jQuery('td.unselected_month[date="' + this.input0Temp + '"]',
					this.pannel).addClass('selected_fade');
		}
	},

	adjustDays : function(days) {
		var newDays = [];
		for ( var i = 0; i < days.length; i++) {
			newDays[i] = days[(i + this.start_of_week) % 7];
		}
		;
		return newDays;
	},

	/**
	 * Binding entre methode et objet.
	 */
	bindMethodsToObj : function() {
		for ( var i = 0; i < arguments.length; i++) {
			this[arguments[i]] = this.bindToObj(this[arguments[i]]);
		}
		;
	},

	bindToObj : function(fn) {
		var self = this;
		return function() {
			return fn.apply(self, arguments);
		};
	}

};

/*
$.fn.Period_picker = function(opts) {
	return this.each(function() {
		new Period_picker(this, opts);
	});
};
$.Period_picker = {
	initialize : function(opts) {
		$("input.period_picker").Period_picker(opts);
	}
};


jQuery(jQuery.Period_picker.initialize);
*/

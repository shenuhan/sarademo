// accordion.js v2.0
//
// Copyright (c) 2007 stickmanlabs
// Author: Kevin P Miller | http://www.stickmanlabs.com
// 
// Accordion is freely distributable under the terms of an MIT-style license.
//
// I don't care what you think about the file size...
//   Be a pro: 
//	    http://www.thinkvitamin.com/features/webapps/serving-javascript-fast
//      http://rakaz.nl/item/make_your_pages_load_faster_by_combining_and_compressing_javascript_and_css_files
//

/*-----------------------------------------------------------------------------------------------*/

if (typeof Effect == 'undefined') 
	throw("accordion.js requires including script.aculo.us' effects.js library!");

var accordion = Class.create();
accordion.prototype = {

	//
	//  Setup the Variables
	//
	showAccordion : null,
	currentAccordion : null,
	duration : null,
	effects : [],
	animating : false,
	
	//  
	//  Initialize the accordions
	//
	initialize: function(container, options) {
	  if (!$(container)) {
	    throw(container+" doesn't exist!");
	    return false;
	  }
	  
		this.options = Object.extend({
			resizeSpeed : 8,
			classNames : {
				toggle : 'accordion_toggle',
				toggleActive : 'accordion_toggle_active',
				content : 'accordion_content'
			},
			defaultSize : {
				height : null,
				width : null
			},
			direction : 'vertical',
			onEvent : 'click'
		}, options || {});
		
		this.duration = ((11-this.options.resizeSpeed)*0.15);

		var accordions = $$('#'+container+' .'+this.options.classNames.toggle);
		accordions.each(function(accordion) {
			Event.observe(accordion, this.options.onEvent, this.activate.bind(this, accordion), false);
			if (this.options.onEvent == 'click') {
			  accordion.onclick = function() {return false;};
			}
			
			if (this.options.direction == 'horizontal') {
				var options = $H({width: '0px'});
			} else {
				var options = $H({height: '0px'});			
			}
			options.merge({display: 'none'});			
			
			this.currentAccordion = $(accordion.next(0)).setStyle(options);			
		}.bind(this));
	},
	
	//
	//  Activate an accordion
	//
	activate : function(accordion) {
		if (this.animating) {
			return false;
		}
		
		this.effects = [];
	
		this.currentAccordion = $(accordion.next(0));
		this.currentAccordion.setStyle({
			display: 'block',
			height: 'auto',
			width: 'auto',
			fontSize: '100%'
		});		
		
		this.currentAccordion.previous(0).addClassName(this.options.classNames.toggleActive);

		if (this.options.direction == 'horizontal') {
			this.scaling = $H({
				scaleX: true,
				scaleY: false
			});
		} else {
			this.scaling = $H({
				scaleX: false,
				scaleY: true
			});			
		}
			
		if (this.currentAccordion == this.showAccordion) {
		  this.deactivate();
		} else {
		  this._handleAccordion();
		}
	},
	// 
	// Deactivate an active accordion
	//
	deactivate : function() {
		var options = $H({
		  duration: this.duration,
			scaleContent: false,
			transition: Effect.Transitions.sinoidal,
			queue: {
				position: 'end', 
				scope: 'accordionAnimation'
			},
			scaleMode: { 
				originalHeight: this.options.defaultSize.height ? this.options.defaultSize.height : this.currentAccordion.scrollHeight,
				originalWidth: this.options.defaultSize.width ? this.options.defaultSize.width : this.currentAccordion.scrollWidth
			},
			afterFinish: function() {
				this.showAccordion.setStyle({
          height: 'auto',
					display: 'none'
				});				
				this.showAccordion = null;
				this.animating = false;
			}.bind(this)
		});    
    options.merge(this.scaling);

    this.showAccordion.previous(0).removeClassName(this.options.classNames.toggleActive);
    this.showAccordion.setStyle({
          height: 'auto',
					display: 'none'
				});	
				this.showAccordion = null;
				this.animating = false;
	//	new Effect.Scale(this.showAccordion, 0, options);
	},

  //
  // Handle the open/close actions of the accordion
  //
	_handleAccordion : function() {
		var options = $H({
			sync: true,
			scaleFrom: 0,
			scaleContent: false,
			transition: Effect.Transitions.sinoidal,
			scaleMode: { 
				originalHeight: this.options.defaultSize.height ? this.options.defaultSize.height : this.currentAccordion.scrollHeight,
				originalWidth: this.options.defaultSize.width ? this.options.defaultSize.width : this.currentAccordion.scrollWidth
			}
		});
		options.merge(this.scaling);
		
		this.effects.push(
			new Effect.Scale(this.currentAccordion, 100, options)
		);

		if (this.showAccordion) {
			this.showAccordion.previous(0).removeClassName(this.options.classNames.toggleActive);
			
			options = $H({
				sync: true,
				scaleContent: false,
				transition: Effect.Transitions.sinoidal
			});
			options.merge(this.scaling);
			
			this.effects.push(
				new Effect.Scale(this.showAccordion, 0, options)
			);				
		}
		
    new Effect.Parallel(this.effects, {
			duration: this.duration, 
			queue: {
				position: 'end', 
				scope: 'accordionAnimation'
			},
			beforeStart: function() {
				this.animating = true;
			}.bind(this),
			afterFinish: function() {
				if (this.showAccordion) {
					this.showAccordion.setStyle({
						display: 'none'
					});				
				}
				$(this.currentAccordion).setStyle({
				  height: 'auto'
				});
				this.showAccordion = this.currentAccordion;
				this.animating = false;
			}.bind(this)
		});
	}
}


/*
 * Fonction permettant d ouvrir le menu sur les elements courants
 * idBLoc : idRessource (Niv2), obligatoire
 * idLien : idRessource (Niv3), facultatif
 * idMethodeEval : idMethodeEval, facultatif
 */
function menuNiv2(idBloc,idLien,idMethodeEval)
{
	if(idBloc!=null && idBloc.length>1 && idBloc!='null')
	{
		if(idLien!=null && idLien.length>1 && idLien!='null' && document.getElementById('contenu_bloc_'+idBloc)!=null) 
		{
			// CAS : NIV2 et NIV3
			document.getElementById('bloc_'+idBloc).setAttribute('class','accordion_toggle accordion_toggle_active');
			document.getElementById('contenu_bloc_'+idBloc).style.display='block';
			document.getElementById('contenu_bloc_'+idBloc).style.height='auto';
			
			// mettre en gras niv3
			var lien=document.getElementById('lien_'+idLien);
			if(lien!=null)
			{
				var baliseLien=lien.getElementsByTagName('a')[0];
				if(baliseLien!=null)
				{
					baliseLien.setAttribute('style','font-weight:bold;');
					// pour IE
					baliseLien.style.fontWeight='bold';
				}		
			}
		}else{
			if(idLien!=null && idLien.length>1 && idLien!='null' && jQuery("[id^='contenu_bloc_']").filter("[id$='_"+idMethodeEval+"']") != null) 
			{
				var currentBlocId = jQuery("[id^='bloc_']").filter("[id$='_"+idMethodeEval+"']").attr('id');				
				var currentContenuBlocId = jQuery("[id^='contenu_bloc_']").filter("[id$='_"+idMethodeEval+"']").attr('id');
				if(currentBlocId != undefined && currentContenuBlocId!= undefined){
					document.getElementById(currentBlocId).setAttribute('class','accordion_toggle accordion_toggle_active');
					document.getElementById(currentContenuBlocId).style.display='block';
					document.getElementById(currentContenuBlocId).style.height='auto';
				}
				
			}else{
				// CAS : NIV2
				// mettre en gras niv2
				var lien=document.getElementById('bloc_'+idBloc);
				if(lien!=null)
				{
					var baliseLien=lien.getElementsByTagName('a')[0];
					if(baliseLien!=null)
					{
						baliseLien.setAttribute('style','color:#01458e;');
						// pour IE
						baliseLien.style.color='#01458e';
					}		
				}	
			}
		}
	}
}
	
package fr.jean.sara.components;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.function.Predicate;

import org.apache.commons.lang3.StringUtils;
import org.apache.tapestry5.EventConstants;
import org.apache.tapestry5.ValueEncoder;
import org.apache.tapestry5.annotations.AfterRender;
import org.apache.tapestry5.annotations.Component;
import org.apache.tapestry5.annotations.InjectComponent;
import org.apache.tapestry5.annotations.OnEvent;
import org.apache.tapestry5.annotations.Parameter;
import org.apache.tapestry5.annotations.Persist;
import org.apache.tapestry5.annotations.Property;
import org.apache.tapestry5.annotations.SetupRender;
import org.apache.tapestry5.corelib.components.Form;
import org.apache.tapestry5.corelib.components.TextField;
import org.apache.tapestry5.corelib.components.Zone;
import org.apache.tapestry5.hibernate.annotations.CommitAfter;
import org.apache.tapestry5.ioc.annotations.Inject;
import org.apache.tapestry5.services.ajax.AjaxResponseRenderer;
import org.apache.tapestry5.services.ajax.JavaScriptCallback;
import org.apache.tapestry5.services.javascript.JavaScriptSupport;
import org.hibernate.Session;
import org.slf4j.Logger;

import fr.jean.sara.entities.Category;
import fr.jean.sara.entities.CompteQualite;
import fr.jean.sara.entities.Demarche;
import fr.jean.sara.entities.Perimetre;
import fr.jean.sara.entities.Tracabilite;
import fr.jean.sara.entities.Visite;
import fr.jean.sara.services.DemarcheService;

public class DocumentContextDialog {
	@Property
	private Tracabilite documentContext;

	@Property
	private Tracabilite current;

	@Property
	private String categoryLabel;

	@Property
	private Category category;

	@Property
	@Persist
	private Demarche demarche;

	@Property
	private int index;

	@Property
	private List<Tracabilite> documentContexts;

	@Inject
	private Logger logger;

	@Parameter(required = true)
	private int demarcheid;

	@InjectComponent
	private Form ajaxForm;

	@InjectComponent
	private Zone formzone;
	
	@InjectComponent
	private Zone contextzonemodal;

	@Inject
	private Session session;

	@Inject
	private DemarcheService service;

	@Property
	@Persist
	private List<Category> categories;

	@Property
	private String format = "dd/MM/yyyy";
	
	@Property
	@Persist
	private boolean isNew;
	
	@Component(parameters={"Autocomplete.minChars=0"})
	//@Mixins({"Autocomplete"})
	private TextField label;

	@SetupRender
	void loadDocumentContext() {
		logger.info("demarch id" + demarcheid);
		demarche = service.get(demarcheid, session);
		documentContexts = service.getDocumentContexts(demarcheid, session);
	}
 
    /**
     * Do the cross-field validation
     */
	@OnEvent(value=EventConstants.VALIDATE)
    void validateCatégories() {
        if (categories.isEmpty()) {
            ajaxForm.recordError("Selectionner au moins une catégorie.");
        }
    }

	@CommitAfter
	void onSuccess() {
		logger.info("Demarche id "
				+ (demarche == null ? null : demarche.getId()));
		demarche = service.get(demarche.getId(), session);
		documentContext.setDemarche(demarche);
		documentContext.setCategories(new ArrayList<Category>());
		for (Category c : categories) {
			if (c != null) {
				documentContext.getCategories().add(c);
				c.setTracabilite(documentContext);
			}
		}
		logger.info("id " + documentContext.getId());
		
		if (documentContext.getId() == 0) {
			session.save(documentContext);
		} else {
			session.update(documentContext);
		}
		loadDocumentContext();
		categories = null;
		ajaxResponseRenderer.addRender(contextzonemodal).addCallback(new JavaScriptCallback() {
			
			@Override
			public void run(JavaScriptSupport javascriptSupport) {
				javascriptSupport.require("filter/contextModal").invoke("search");
			}
		});
	}
	

	@Inject
	private JavaScriptSupport js;
	
	@AfterRender
	private void afterRender() {
		js.require("filter/contextModal").invoke("search");
	}

	void onFailure() {
		logger.info("Failure");
		loadDocumentContext();
		ajaxResponseRenderer.addRender(contextzonemodal).addCallback(new JavaScriptCallback() {
			@Override
			public void run(JavaScriptSupport javascriptSupport) {
				javascriptSupport.require("filter/contextModal").invoke("search");
				javascriptSupport.require("filter/contextModal").invoke("formVisible").with(true);	
			}
		});
	}

	public boolean getShowForm() {
		return categories != null;
	}

	Object onAddRowFromCategories() {
		Category c = new Category();
		c.setIndex(categories.isEmpty() ? 1 : (categories.get(categories.size() - 1).getIndex() + 1));
		categories.add(c);
		logger.info("add " + c.getIndex() + " " + categories.size());
		return c;
	}

	void onRemoveRowFromCategories(final Category category) {
		categories.removeIf(new Predicate<Category>() {
			@Override
			public boolean test(Category t) {
				return category.getIndex()==t.getIndex();
			}
			
		});
		logger.info("remove " + category.getIndex() + " " + categories.size());
	}

	@Property
	private ValueEncoder<Category> categoryEncoder = new ValueEncoder<Category>() {
		@Override
		public String toClient(Category value) {
			logger.info("toclient " + categories.indexOf(value) + " " + categories.size());
			return String.valueOf(value.getIndex());
		}

		@Override
		public Category toValue(final String clientValue) {
			logger.info("toValue " + clientValue + " " + categories.size());
			return categories.stream().filter(new Predicate<Category>() {
				@Override
				public boolean test(Category t) {
					return clientValue.equals(String.valueOf(t.getIndex()));
				}
				
			}).findFirst().get();
		}
	};

	public void onEditTracabilite(final int id) {
		isNew = false;
		documentContext = (Tracabilite) session.get(Tracabilite.class, id);
		categories = new ArrayList<Category>(documentContext.getCategories());
		ajaxResponseRenderer.addRender(formzone).addCallback(new JavaScriptCallback() {
			@Override
			public void run(JavaScriptSupport javascriptSupport) {
				javascriptSupport.require("filter/contextModal").invoke("activateResult").with(id);				
				javascriptSupport.require("filter/contextModal").invoke("formVisible").with(true);				
			}
		});
	}
	
	public void onNewTracabilite() {
		isNew = true;
		categories = new ArrayList<Category>();
		documentContext = new Tracabilite();
		documentContext.setDate(new Date());
		ajaxResponseRenderer.addRender(formzone).addCallback(new JavaScriptCallback() {
			@Override
			public void run(JavaScriptSupport javascriptSupport) {
				javascriptSupport.require("filter/contextModal").invoke("activateResult");
				javascriptSupport.require("filter/contextModal").invoke("formVisible").with(true);
			}
		});
	}
	
	@Inject
	private AjaxResponseRenderer ajaxResponseRenderer;

	@CommitAfter
	public void onSupprimerTracabilite(int id) {
		documentContext = (Tracabilite) session.get(Tracabilite.class, id);
		session.delete(documentContext);
		loadDocumentContext();
		categories = null;
		ajaxResponseRenderer.addRender(contextzonemodal).addCallback(new JavaScriptCallback() {
			@Override
			public void run(JavaScriptSupport javascriptSupport) {
				javascriptSupport.require("filter/contextModal").invoke("search");
				javascriptSupport.require("filter/contextModal").invoke("activateResult");
				javascriptSupport.require("filter/contextModal").invoke("formVisible").with(false);
			}
		});
	}
	
	public void onAnnulerTracabilite() {
		loadDocumentContext();
		categories = null;
		ajaxResponseRenderer.addRender(contextzonemodal).addCallback(new JavaScriptCallback() {
			
			@Override
			public void run(JavaScriptSupport javascriptSupport) {
				javascriptSupport.require("filter/contextModal").invoke("search");
				javascriptSupport.require("filter/contextModal").invoke("activateResult");
				javascriptSupport.require("filter/contextModal").invoke("formVisible").with(false);
			}
		});
	}
	
	public boolean getIsNotNew() {
		return !isNew;
	}
	
	private static final String PERIMETRE = "Tous perimetres";  
	private static final String COMPTEQUATLITE = "Tous comptes qualites";  
	private static final String VISITE = "Toutes visites";  

	String[] onProvideCompletionsFromLabel(String input) {
		logger.info("input " + input);
		if (StringUtils.isEmpty(input)) {
			return new String[]{PERIMETRE, COMPTEQUATLITE, VISITE};
		}
		input = StringUtils.stripAccents(input.toLowerCase());
		List<String> result = new ArrayList<String>(); 
		demarche = service.get(demarche.getId(), session);
		for (Perimetre p : demarche.getPerimetres()) {
			if (StringUtils.stripAccents(p.getNom().toLowerCase()).contains(input)) {
				logger.info("autocomplete " + p.getNom() + " " + input + " " + p.getNom().contains(input));
				result.add(p.getNom());
			}
		}
		for (CompteQualite p : demarche.getCompteQualites()) {
			if (StringUtils.stripAccents(p.getIdentifiant().toLowerCase()).contains(input)) {
				logger.info("autocomplete " + p.getIdentifiant());
				result.add(p.getIdentifiant());
			}
		}
		for (Visite p : demarche.getVisites()) {
			if (StringUtils.stripAccents(p.getIdentifiant().toLowerCase()).contains(input)); {
				logger.info("autocomplete " + p.getIdentifiant());
				result.add(p.getIdentifiant());
			}
		}
		logger.info("autocomplete " + result.size());
		return result.toArray(new String[result.size()]);
	}


	public boolean getIsFirst() {
		return index == 0;
	}

	public boolean getIsNotFirst() {
		return index != 0;
	}
}

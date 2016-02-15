package fr.jean.sara.components;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.apache.tapestry5.Block;
import org.apache.tapestry5.ValueEncoder;
import org.apache.tapestry5.annotations.InjectComponent;
import org.apache.tapestry5.annotations.Log;
import org.apache.tapestry5.annotations.PageActivationContext;
import org.apache.tapestry5.annotations.Parameter;
import org.apache.tapestry5.annotations.Persist;
import org.apache.tapestry5.annotations.Property;
import org.apache.tapestry5.annotations.SetupRender;
import org.apache.tapestry5.corelib.components.Form;
import org.apache.tapestry5.corelib.components.Zone;
import org.apache.tapestry5.hibernate.annotations.CommitAfter;
import org.apache.tapestry5.ioc.annotations.Inject;
import org.apache.tapestry5.services.Request;
import org.eclipse.jetty.util.ajax.JSON;
import org.hibernate.Session;
import org.slf4j.Logger;

import fr.jean.sara.entities.Category;
import fr.jean.sara.entities.Demarche;
import fr.jean.sara.entities.Tracabilite;
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

	@Inject
	private Request request;

	@InjectComponent
	private Form ajaxForm;

	@InjectComponent
	private Zone formzone;

	@Inject
	private Session session;

	@Inject
	private DemarcheService service;

	@Property
	@Persist
	private List<Category> categories;
	
	@Property
	private String format = "dd/MM/yyyy";

	@SetupRender
	void loadDocumentContext() {
		logger.info("demarch id" + demarcheid);
		demarche = service.get(demarcheid, session);
		documentContexts = service.getDocumentContexts(demarcheid, session);
		categories = null;
	}

	@CommitAfter
	Object onSuccess() {
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
		logger.info("categories " + documentContext.getCategories());
		session.save(documentContext);
		return request.isXHR() ? formzone.getBody() : null;
	}

	Object onFailure() {
		return request.isXHR() ? formzone.getBody() : null;
	}
	
	public boolean getShowForm() {
		return categories != null;
	}

	Object onAddRowFromCategories() {
		Category c = new Category();
		categories.add(c);
		return c;
	}

	void onRemoveRowFromCategories(Category category) {
		categories.set(categories.indexOf(category), null);
	}
	
	public Object onEditTracabilite(int id) {
		documentContext = (Tracabilite) session.get(Tracabilite.class, id);
		categories = new ArrayList<Category>(documentContext.getCategories());
		return formzone.getBody();
	}
	
	public Object onNewTracabilite() {
		categories = new ArrayList<Category>();
		documentContext = new Tracabilite();
		return formzone.getBody();
	}
	
	@Property
	private ValueEncoder<Category> categoryEncoder = new ValueEncoder<Category>() {
		@Override
		public String toClient(Category value) {
			return String.valueOf(categories.indexOf(value));
		}

		@Override
		public Category toValue(String clientValue) {
			return categories.get(Integer.parseInt(clientValue));
		}
	};

	public boolean getIsFirst() {
		return index == 0;
	}

	public boolean getIsNotFirst() {
		return index != 0;
	}
}

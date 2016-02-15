package fr.jean.sara.components;

import java.util.List;

import org.apache.tapestry5.annotations.InjectComponent;
import org.apache.tapestry5.annotations.Parameter;
import org.apache.tapestry5.annotations.Property;
import org.apache.tapestry5.annotations.SetupRender;
import org.apache.tapestry5.corelib.components.BeanEditForm;
import org.apache.tapestry5.corelib.components.Zone;
import org.apache.tapestry5.hibernate.annotations.CommitAfter;
import org.apache.tapestry5.ioc.annotations.Inject;
import org.apache.tapestry5.services.Request;
import org.hibernate.Session;
import org.slf4j.Logger;

import fr.jean.sara.entities.Demarche;
import fr.jean.sara.entities.Tracabilite;
import fr.jean.sara.services.DemarcheService;

public class DocumentContextDialog {
	@Property
	private Tracabilite documentContext;

	@Property
	private Tracabilite current;
	
	@Property
	private String category;

	@Property
	private Demarche demarche;

	@Property
	private List<Tracabilite> documentContexts;
    
	@Inject
    private Logger logger;
	
	@Parameter(required=true)
	private int demarcheid;

	@Inject
	private Request request;

	@InjectComponent
	private BeanEditForm ajaxForm;
	
    @InjectComponent
    private Zone formZone;
    
    @Inject
    private Session session;
    
    @Inject
    private DemarcheService service;
    
	@SetupRender
    void loadDocumentContext() {
		demarche = service.get(demarcheid, session);
		documentContexts = service.getDocumentContexts(demarcheid, session);
		logger.info("d: " + demarcheid);
    }
    
	@CommitAfter
	Object onSuccess() {
		session.save(documentContext);
		return request.isXHR() ? formZone.getBody() : null;
	}

	Object onFailure() {
		return request.isXHR() ? formZone.getBody() : null;
	}

}

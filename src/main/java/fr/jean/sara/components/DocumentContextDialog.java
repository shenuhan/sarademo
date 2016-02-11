package fr.jean.sara.components;

import org.apache.tapestry5.annotations.InjectComponent;
import org.apache.tapestry5.annotations.Property;
import org.apache.tapestry5.corelib.components.BeanEditForm;
import org.apache.tapestry5.corelib.components.Zone;
import org.apache.tapestry5.ioc.annotations.Inject;
import org.apache.tapestry5.services.Request;

import fr.jean.sara.entities.Tracabilite;

public class DocumentContextDialog {
	@Property
	private Tracabilite documentContext;

	@Inject
	private Request request;

	@InjectComponent
	private BeanEditForm ajaxForm;
	
    @InjectComponent
    private Zone formZone;
    
	Object onSuccess() {
		return request.isXHR() ? formZone.getBody() : null;
	}

	Object onFailure() {
		return request.isXHR() ? formZone.getBody() : null;
	}

}

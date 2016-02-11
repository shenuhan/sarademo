package fr.jean.sara.components;

import org.apache.tapestry5.annotations.Import;
import org.apache.tapestry5.annotations.Property;

import fr.jean.sara.entities.Tracabilite;

public class DocumentContextDialog {
	@Property
	private Tracabilite documentContext;
	
	void onSuccess() {
		
	}
}

package fr.jean.sara.components;

import org.apache.tapestry5.annotations.Property;

import fr.jean.sara.model.CallHistory;

public class PhoneHistoryDialog {
	@Property
	private CallHistory call;
	
	void onSuccess() {
		
	}
}

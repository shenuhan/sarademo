package fr.jean.sara.components;

import javax.inject.Inject;

import org.apache.tapestry5.BindingConstants;
import org.apache.tapestry5.Block;
import org.apache.tapestry5.annotations.AfterRender;
import org.apache.tapestry5.annotations.Import;
import org.apache.tapestry5.annotations.Parameter;
import org.apache.tapestry5.annotations.Property;
import org.apache.tapestry5.services.javascript.JavaScriptSupport;

@Import(module={"jquery"})
public class Dialog {
	@Parameter(value = "prop:componentResources.id", defaultPrefix = BindingConstants.LITERAL)
	private String dialogId;

	public String getDialogId() {
		return dialogId;
	}

	public void setDialogId(String dialogId) {
		this.dialogId = dialogId;
	}

	@Parameter(required = true)
	@Property
	private Block content;

	@Property
	@Parameter(required = false, defaultPrefix = "literal")
	private String title;

	@Inject
	private JavaScriptSupport js;
	
	@AfterRender
	private void afterRender() {
		js.require("modal/modal").invoke("activate").with(dialogId);
	}
}

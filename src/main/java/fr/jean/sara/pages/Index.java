package fr.jean.sara.pages;


import java.util.Date;

import org.apache.tapestry5.Block;
import org.apache.tapestry5.EventContext;
import org.apache.tapestry5.annotations.Import;
import org.apache.tapestry5.annotations.Log;
import org.apache.tapestry5.ioc.annotations.Inject;
import org.apache.tapestry5.services.HttpError;
import org.apache.tapestry5.services.ajax.AjaxResponseRenderer;
import org.apache.tapestry5.services.ajax.JavaScriptCallback;
import org.apache.tapestry5.services.javascript.JavaScriptSupport;
import org.slf4j.Logger;

/**
 * Start page of application demo.
 */
@Import(module={"bootstrap/modal","jquery"})
public class Index
{
  @Inject
  private Logger logger;

  @Inject
  private AjaxResponseRenderer ajaxResponseRenderer;

  @Inject
  private Block modalblock;

  @Inject
  private JavaScriptSupport javaScriptSupport;


  // Handle call with an unwanted context
  Object onActivate(EventContext eventContext)
  {
    return eventContext.getCount() > 0 ?
        new HttpError(404, "Resource not found") :
        null;
  }


  @Log
  void onComplete()
  {
    logger.info("Complete call on Index page");
  }

  @Log
  Object onAjax()
  {
    logger.info("Ajax call on Index page");
//    ajaxResponseRenderer.addRender("modalzone", modalblock);
//    ajaxResponseRenderer.addCallback(new JavaScriptCallback() {
//		@Override
//		public void run(JavaScriptSupport arg0) {
//		    javaScriptSupport.require("modal/modal").invoke("activate").with("identi");;
//		}
//	});
    return modalblock;
  }

  public Date getCurrentTime()
  {
    return new Date();
  }
}

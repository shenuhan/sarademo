package fr.jean.sara.pages;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.tapestry5.Block;
import org.apache.tapestry5.EventContext;
import org.apache.tapestry5.ValueEncoder;
import org.apache.tapestry5.annotations.Import;
import org.apache.tapestry5.annotations.InjectComponent;
import org.apache.tapestry5.annotations.Log;
import org.apache.tapestry5.annotations.Property;
import org.apache.tapestry5.annotations.SetupRender;
import org.apache.tapestry5.corelib.components.Form;
import org.apache.tapestry5.hibernate.annotations.CommitAfter;
import org.apache.tapestry5.ioc.annotations.Inject;
import org.apache.tapestry5.services.HttpError;
import org.apache.tapestry5.services.Request;
import org.apache.tapestry5.services.ajax.AjaxResponseRenderer;
import org.apache.tapestry5.services.javascript.JavaScriptSupport;
import org.hibernate.Session;
import org.slf4j.Logger;

import fr.jean.sara.entities.Category;
import fr.jean.sara.entities.CompteQualite;
import fr.jean.sara.entities.Demarche;
import fr.jean.sara.entities.Perimetre;
import fr.jean.sara.entities.Rapport;
import fr.jean.sara.entities.Tracabilite;
import fr.jean.sara.entities.Visite;
import fr.jean.sara.services.DemarcheService;

/**
 * Start page of application demo.
 */
@Import(module = { "bootstrap/modal", "jquery" }, stylesheet = {
		"context:css/font-awesome.css", "context:css/bootstrap.css",
		"context:css/demo.css", "context:css/bootstrap-timepicker.css" })
public class Index {
	@Inject
	private Logger logger;

	@Inject
	private AjaxResponseRenderer ajaxResponseRenderer;

	@Inject
	private Block modalblock;

	@Inject
	private JavaScriptSupport javaScriptSupport;

	@Inject
	private Session session;

	@Inject
	private DemarcheService demarcheService;
	
	@Property
	private int demarcheId;

	// Handle call with an unwanted context
	Object onActivate(EventContext eventContext) {
		return eventContext.getCount() > 0 ? new HttpError(404,
				"Resource not found") : null;
	}

	@Log
	void onComplete() {
		logger.info("Complete call on Index page");
	}

	@Log
	@CommitAfter
	Object onAjax() {
		logger.info("Ajax call on Index page");
		// createDemarche();

		return modalblock;
	}

	@Property
	private Tracabilite documentContext;

	@SetupRender
	@CommitAfter
	void init() {
		//createDemarche();
		Demarche d = (Demarche) session.createQuery("select d from Demarche d").list().iterator().next();
		demarcheId = d.getId();
		logger.info("id --> " + demarcheId);
	}

	@SuppressWarnings("serial")
	private void createDemarche() {
		Demarche d = new Demarche();

		Calendar c = Calendar.getInstance();
		c.set(2014, 04, 28);

		d.setCode(30000);
		d.setDateDeCreation(c.getTime());

		List<Perimetre> perimetres = new ArrayList<Perimetre>() {
			{
				add(new Perimetre() {
					{
						setNumeroFiness(920000001);
						setNom("ES1 TEST");
					}
				});
				add(new Perimetre() {
					{
						setNumeroFiness(920000002);
						setNom("ES2 TEST");
					}
				});
			}
		};

		List<CompteQualite> compteQualites = new ArrayList<CompteQualite>() {
			{
				add(new CompteQualite() {
					{
						setIdentifiant("Compte qualite (1)");
						setRapports(new ArrayList<Rapport>() {
							{
								add(new Rapport() {
									{
										setIdentifiant("RP(1.1)");
										setType("Rapport");
									}
								});
							}
						});
					}
				});
				add(new CompteQualite() {
					{
						setIdentifiant("Compte qualite (2)");
					}
				});
			}
		};

		List<Visite> visites = new ArrayList<Visite>() {
			{
				add(new Visite() {
					{
						setIdentifiant("Visite de renouvellement (1)");
						setRapports(new ArrayList<Rapport>() {
							{
								add(new Rapport() {
									{
										setIdentifiant("RV(1.1)");
										setType("Rapport");
									}
								});
								add(new Rapport() {
									{
										setIdentifiant("RPO(1.1)");
										setType("Rapport pour observations");
									}
								});
								add(new Rapport() {
									{
										setIdentifiant("RAC(1.1)");
										setType("Rapport de certification");
									}
								});
								add(new Rapport() {
									{
										setIdentifiant("RPO(1.2)");
										setType("Rapport pour observations");
									}
								});
							}
						});
					}
				});
				add(new Visite() {
					{
						setIdentifiant("Visite de renouvellement (2)");
						setRapports(new ArrayList<Rapport>() {
							{
								add(new Rapport() {
									{
										setIdentifiant("RV(2.1)");
										setType("Rapport");
									}
								});
							}
						});
					}
				});
			}
		};
		d.setPerimetres(perimetres);
		d.setCompteQualites(compteQualites);
		d.setVisites(visites);

		demarcheService.save(d, session);
	}

	public Date getCurrentTime() {
		return new Date();
	}

}

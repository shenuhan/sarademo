package fr.jean.sara.services;

import java.util.List;

import org.hibernate.Session;
import org.springframework.stereotype.Service;

import com.gargoylesoftware.htmlunit.javascript.host.dom.Document;

import fr.jean.sara.entities.Demarche;
import fr.jean.sara.entities.Tracabilite;

@Service
public class DemarcheService {
	public Demarche save(Demarche demarche, Session session) {
		if (demarche.getId() != 0) {
			session.persist(demarche);
		} else {
			demarche = (Demarche) session.merge(demarche);
		}
		return demarche;
	}

	public Demarche get(int id, Session session) {
		return (Demarche) session.get(Demarche.class, id);
	}

	public List<Tracabilite> getDocumentContexts(int demarcheId, Session session) {
		List<Tracabilite> l = session
				.createQuery("select t from Tracabilite t join t.demarche d where d.id=:id")
				.setInteger("id", demarcheId).list();
		return l;
	}
}

package fr.jean.sara.services;

import org.hibernate.Session;
import org.springframework.stereotype.Service;

import fr.jean.sara.entities.Demarche;

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
}

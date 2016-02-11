package fr.jean.sara.entities;

import javax.persistence.Entity;

@Entity
public class Rapport extends BasicEntity {
	private String identifiant;
	
	private String type;

	public String getIdentifiant() {
		return identifiant;
	}

	public void setIdentifiant(String identifiant) {
		this.identifiant = identifiant;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}

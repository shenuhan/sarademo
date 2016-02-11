package fr.jean.sara.entities;

import javax.persistence.Entity;

@Entity
public class Perimetre extends BasicEntity {
	private int numeroFiness;
	
	private String nom;

	public int getNumeroFiness() {
		return numeroFiness;
	}

	public void setNumeroFiness(int numeroFiness) {
		this.numeroFiness = numeroFiness;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}
}

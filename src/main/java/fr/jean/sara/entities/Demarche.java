package fr.jean.sara.entities;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;

@Entity
public class Demarche extends BasicEntity {
	private int code;

	private Date dateDeCreation;

	@OneToMany(cascade = CascadeType.ALL)
	private List<Perimetre> perimetres;

	@OneToMany(cascade = CascadeType.ALL)
	private List<CompteQualite> compteQualites;

	@OneToMany(cascade = CascadeType.ALL)
	private List<Visite> visites;

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public Date getDateDeCreation() {
		return dateDeCreation;
	}

	public void setDateDeCreation(Date dateDeCreation) {
		this.dateDeCreation = dateDeCreation;
	}

	public List<Perimetre> getPerimetres() {
		return perimetres;
	}

	public void setPerimetres(List<Perimetre> perimetres) {
		this.perimetres = perimetres;
	}

	public List<CompteQualite> getCompteQualites() {
		return compteQualites;
	}

	public void setCompteQualites(List<CompteQualite> compteQualites) {
		this.compteQualites = compteQualites;
	}

	public List<Visite> getVisites() {
		return visites;
	}

	public void setVisites(List<Visite> visites) {
		this.visites = visites;
	}

}

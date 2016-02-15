package fr.jean.sara.entities;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.apache.tapestry5.beaneditor.NonVisual;
import org.apache.tapestry5.beaneditor.Validate;
import org.hibernate.validator.constraints.Length;

@Entity
public class Tracabilite extends BasicEntity {
	@Validate("required")
	@Length(max=255)
	@Size(max=255)
	private String source;
	@Validate("required")
	private Date date;
	@NotNull
	@Length(max=255)
	@Size(max=255)
	@Validate("required")
	private String titre;
	private boolean impact;
	@Length(max=4095)
	@Size(max=4095)
	private String contenu;

	@OneToMany(cascade = CascadeType.ALL, mappedBy="tracabilite", orphanRemoval=true)
	@Size(min=1)
	private List<Category> categories;
	
	@ManyToOne
	@NonVisual
	private Demarche demarche;
	
	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getTitre() {
		return titre;
	}

	public void setTitre(String titre) {
		this.titre = titre;
	}

	public boolean isImpact() {
		return impact;
	}

	public void setImpact(boolean impact) {
		this.impact = impact;
	}

	public String getContenu() {
		return contenu;
	}

	public void setContenu(String contenu) {
		this.contenu = contenu;
	}

	public List<Category> getCategories() {
		return categories;
	}

	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}

	public Demarche getDemarche() {
		return demarche;
	}

	public void setDemarche(Demarche demarche) {
		this.demarche = demarche;
	}

}

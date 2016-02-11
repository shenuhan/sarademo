package fr.jean.sara.entities;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Length;

@Entity
public class Tracabilite extends BasicEntity {
	@NotNull
	@Length(max=255)
	@Size(max=255)
	private String source;
	@NotNull
	private Date date;
	@NotNull
	@Length(max=255)
	@Size(max=255)
	private String titre;
	private boolean impact;
	private String contenu;

	@OneToMany(cascade = CascadeType.ALL)
	@Size(min=1)
	private List<Categories> categories;

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

	public List<Categories> getCategories() {
		return categories;
	}

	public void setCategories(List<Categories> categories) {
		this.categories = categories;
	}

}

package fr.jean.sara.entities;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
public class Category extends BasicEntity {
	private String label;

	@ManyToOne
	private Tracabilite tracabilite;
	
	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	} 
	
	public Tracabilite getTracabilite() {
		return tracabilite;
	}

	public void setTracabilite(Tracabilite tracabilite) {
		this.tracabilite = tracabilite;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof Category)) return false;
		Category c = (Category) obj;
		return (c.getId() != 0 && c.getId() == getId()) || (c.getLabel() == getLabel());
	}
}

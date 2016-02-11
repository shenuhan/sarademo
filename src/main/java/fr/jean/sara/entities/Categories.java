package fr.jean.sara.entities;

import javax.persistence.Entity;

@Entity
public class Categories extends BasicEntity {
	private String category;

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	} 
}

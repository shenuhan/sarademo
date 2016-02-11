package fr.jean.sara.entities;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import org.apache.tapestry5.beaneditor.NonVisual;

@MappedSuperclass
public abstract class BasicEntity implements DomainEntity {
	@Id
	@GeneratedValue
	@NonVisual
	private int id;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
}

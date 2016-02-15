package fr.jean.sara.components;

import java.util.List;

import javax.inject.Inject;

import org.apache.tapestry5.annotations.Parameter;
import org.apache.tapestry5.annotations.Persist;
import org.apache.tapestry5.annotations.Property;
import org.apache.tapestry5.annotations.SetupRender;
import org.apache.tapestry5.corelib.components.Zone;
import org.slf4j.Logger;

import fr.jean.sara.entities.Category;

public class CategoryLoop {
	@Parameter(required = true)
	List<Category> categories;

	@Property
	@Persist
	List<Category> propertyCategories;

	@Property
	int index;

	@Property
	Category category;

	@Property
	Zone catZone;
	
	@Inject
	Logger logger;

	@SetupRender
	public void init() {
		propertyCategories = categories;
	}

	public Object onClickFromAdd() {
		logger.info("test " + propertyCategories);
		propertyCategories.add(new Category() {{setLabel("");}});
		return catZone.getBody();
	}

	public Object onClickFromRemove(int index) {
		propertyCategories.remove(index);
		return catZone.getBody();
	}

	public boolean getIsFirst() {
		return index == 0;
	}

	public boolean getIsNotFirst() {
		return index != 0;
	}
}

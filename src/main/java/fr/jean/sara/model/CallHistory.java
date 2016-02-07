package fr.jean.sara.model;

import java.util.Date;

import org.apache.tapestry5.beaneditor.Validate;

public class CallHistory {
	private String callee;
	private Date date;
	private String phoneNumber;

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getCallee() {
		return callee;
	}

	public void setCallee(String callee) {
		this.callee = callee;
	}
}

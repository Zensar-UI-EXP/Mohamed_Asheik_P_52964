const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
class Newsletter {
	constructor(rowLimit) {
	    this.rowLimit = rowLimit;
	    this.newsletterFormObject = {};
  	}

	addNewFriend (rowIndex, clone) {
		const rowCount = document.getElementsByClassName("newsletter__formlistcont").length;
		const insertElement = document.getElementById("newsletterform");
		const cloneContainer = document.getElementById(`newsletter${rowIndex}`);
		const responseJson = this.validatingNCreateObject(cloneContainer, rowIndex);
		if (responseJson && clone) {
			cloneContainer.classList.remove("newsletter--lastsection");
			if (rowCount < newsletter.rowLimit) {
				insertElement.appendChild(responseJson);
				responseJson.children[0].children[1].focus();
			}
		} else if (responseJson && !clone) {
			alert("Submitted successfully, to see the constructed json please check in console.");
		}
	}

	validatingNCreateObject (cloneContainer, rowIndex) {
		const nextIndex = rowIndex + 1;
		const clonedElement = cloneContainer.cloneNode(true);
			clonedElement.id = `newsletter${nextIndex}`;
		for (let element of clonedElement.children) {
			const index = element.attributes.dataIndex.nodeValue;
			element.children[1].value = "";
			const childElements = cloneContainer.children[index].children;
			if (index < 3 && (!childElements[1].value || (index == 2 && childElements[1].value && !emailRegex.test(childElements[1].value)))) {
				const className = childElements[1].value ? "newsletter--emailinvalid" : "newsletter--required";
				const errorIndex = childElements[1].value ? 3 : 2;
				childElements[errorIndex].classList.add(className);
				childElements[1].focus();
				return false;
			}
			if (index == 3) {
				element.children[0].attributes.onclick.nodeValue = `newsletter.remove(${nextIndex})`;
				element.children[1].attributes.onclick.nodeValue = `newsletter.addNewFriend(${nextIndex}, true)`;
			} else {
				element.children[0].attributes.for.nodeValue = element.children[0].attributes.for.nodeValue.replace(rowIndex, nextIndex);
				element.children[1].id = element.children[1].id.replace(rowIndex, nextIndex);
			}
		}
		return clonedElement;
	}

	remove (rowIndex) {
		const rowCont = document.getElementsByClassName("newsletter__formlistcont");
		const removeElement = document.getElementById(`newsletter${rowIndex}`);
		if (rowCont.length == newsletter.rowLimit) {
			removeElement.remove();
			rowCont[rowCont.length - 1].classList.add("newsletter--lastsection");
		} else {
			removeElement.remove();
		}
		delete this.newsletterFormObject[rowIndex];
	}

	validationCheck (thisParam, type) {
		const rowId = thisParam.parentElement.parentElement.id.replace("newsletter", "");
		const requiredErrorCont = thisParam.parentElement.children[2];
		const invalidErrorCont = thisParam.parentElement.children[3];
		if (!thisParam.value || (thisParam.value && type === "emailaddress" && !emailRegex.test(thisParam.value))) {
	  		const contParam = thisParam.value ? invalidErrorCont : requiredErrorCont;
	  		const className = thisParam.value ? "newsletter--emailinvalid" : "newsletter--required";
	  		this.showHideError(thisParam, contParam, className, rowId, type);
		} else if (requiredErrorCont.classList.contains("newsletter--required") || (invalidErrorCont && invalidErrorCont.classList.contains("newsletter--emailinvalid"))) {
			this.clearError(thisParam);
		} else {
			this.newsletterFormObject[rowId] = this.newsletterFormObject[rowId] ? this.newsletterFormObject[rowId] : {};
			this.newsletterFormObject[rowId][type] = thisParam.value;
		}
	}

	showHideError (thisParam, errorCont, className, rowId, type) {
	  	if (errorCont.classList.contains(className)) {
			const existValue = this.newsletterFormObject[rowId] && this.newsletterFormObject[rowId][type] ? this.newsletterFormObject[rowId][type] : "";
  			this.clearError(thisParam);
  			thisParam.value = existValue;
  		} else {
			errorCont.classList.add(className);
			thisParam.focus();
  		}
	}

	clearError (thisParam) {
		if (thisParam.parentElement.children[2].classList.contains("newsletter--required")) {
			thisParam.parentElement.children[2].classList.remove("newsletter--required");
		} else if (thisParam.parentElement.children[3] && thisParam.parentElement.children[3].classList.contains("newsletter--emailinvalid")) {
			thisParam.parentElement.children[3].classList.remove("newsletter--emailinvalid");
		}
	}

	submitForm () {
		const formListElement = document.getElementsByClassName("newsletter__formlistcont");
		const rowId = formListElement[formListElement.length-1].id.replace("newsletter", "");
		this.addNewFriend(rowId, false);
		console.log(this.newsletterFormObject);
	}
}

let newsletter = new Newsletter(5);
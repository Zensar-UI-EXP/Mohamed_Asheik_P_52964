const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
class Newsletter {
	constructor(rowLimit) {
	    this.rowLimit = rowLimit;
	    this.newsletterFormObject = {};
  	}

	addNewFriend (rowIndex, clone) {
		const rowCount = document.getElementsByClassName("newsletter__formlistcont").length;
		let insertObject = {};
		const insertElement = document.getElementById("newsletterform");
		const nextIndex = rowIndex + 1;
		const cloneContainer = document.getElementById("newsletter" + rowIndex);
		const clonedElement = cloneContainer.cloneNode(true);
		clonedElement.id = "newsletter" + nextIndex;
		for (var i = 0; i < clonedElement.children.length; i++) {
			clonedElement.children[i].children[1].value = "";
			let messageNKey = i === 0 ? "name" : i === 1 ? "surname" : "email";
			if ((i < 3 && !cloneContainer.children[i].children[1].value) || (i === 2 && cloneContainer.children[i].children[1].value && !emailRegex.test(cloneContainer.children[i].children[1].value))) {
				if (cloneContainer.children[i].children[1].value) {
					cloneContainer.children[i].children[3].classList.add('newsletter--emailinvalid');
				} else {
					cloneContainer.children[i].children[2].classList.add("newsletter--required");
				}
				cloneContainer.children[i].children[1].focus();
				return false;
			} else if (i < 3) {
				insertObject[messageNKey] = cloneContainer.children[i].children[1].value;
			}
			if (i === 3) {
				clonedElement.children[i].children[0].attributes.onclick.nodeValue = "newsletter.remove(" + nextIndex + ")";
				clonedElement.children[i].children[1].attributes.onclick.nodeValue = "newsletter.addNewFriend(" + nextIndex + ", " + true +")";
			}
		};
		if (rowCount < newsletter.rowLimit && clone) {
			cloneContainer.classList.remove("newsletter--lastsection");
			insertElement.appendChild(clonedElement);
			clonedElement.children[0].children[1].focus();
		} else if (clone) {
			alert("Exceeds limit");
		} else {
			alert("submitted successfully, to see the constructed json please check in console.");
		}
		this.newsletterFormObject[rowIndex] = insertObject;
	}

	remove (rowIndex) {
		const removeElement = document.getElementById("newsletter" + rowIndex);
			removeElement.remove();
		delete this.newsletterFormObject[rowIndex];
	}

	validationCheck (thisParam, type) {
		const rowId = thisParam.parentElement.parentElement.id.replace("newsletter", '');
		const existValue = this.newsletterFormObject[rowId] && this.newsletterFormObject[rowId][type] ? this.newsletterFormObject[rowId][type] : "";
	  	if (!thisParam.value) {
	  		if (thisParam.parentElement.children[2].classList.contains("newsletter--required")) {
	  			this.clearError(thisParam);
	  			thisParam.value = existValue;
	  		} else {
				thisParam.parentElement.children[2].classList.add("newsletter--required");
				thisParam.focus();
	  		}
		} else if (thisParam.parentElement.children[2].classList.contains("newsletter--required")) {
			this.clearError(thisParam);
		} else if (type === "email" && !emailRegex.test(thisParam.value)) {
			if (thisParam.parentElement.children[3].classList.contains("newsletter--emailinvalid")) {
	  			this.clearError(thisParam);
	  			thisParam.value = existValue;
	  		} else {
				thisParam.parentElement.children[3].classList.add("newsletter--emailinvalid");
				thisParam.focus();
	  		}
		} else if (thisParam.parentElement.children[3] && thisParam.parentElement.children[3].classList.contains('newsletter--emailinvalid')) {
			this.clearError(thisParam);
		} else {
			this.newsletterFormObject[rowId] = this.newsletterFormObject[rowId] ? this.newsletterFormObject[rowId] : {};
			this.newsletterFormObject[rowId][type] = thisParam.value;
		}
	}

	clearError (thisParam) {
		if (thisParam.parentElement.children[2].classList.contains("newsletter--required")) {
			thisParam.parentElement.children[2].classList.remove("newsletter--required");
		} else if (thisParam.parentElement.children[3] && thisParam.parentElement.children[3].classList.contains('newsletter--emailinvalid')) {
			thisParam.parentElement.children[3].classList.remove("newsletter--emailinvalid");
		} 
	}
}

let newsletter = new Newsletter(5);

submitForm = () => {
	const formListElement = document.getElementsByClassName("newsletter__formlistcont");
	const rowId = formListElement[formListElement.length-1].id.replace("newsletter", "");
	newsletter.addNewFriend(rowId, false);
	console.log(newsletter.newsletterFormObject);
}
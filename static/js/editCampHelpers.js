const successfulUpdate = function () {
	let changeTarget = document.querySelector("#msg-container");
	let successMsgTarget = document.querySelector("#success-msg");
	let errMsgTarget = document.querySelector("#error-msg");
	changeTarget.classList.contains("d-none")
		? changeTarget.classList.toggle("d-none")
		: null;
	successMsgTarget.classList.contains("d-none")
		? successMsgTarget.classList.toggle("d-none")
		: null;
	!errMsgTarget.classList.contains("d-none")
		? errMsgTarget.classList.toggle("d-none")
		: null;
	setTimeout(() => {
		window.location.href = `/campgrounds/${id}`;
	}, 1500);
};
const updateError = async function (req) {
    let res = await req.json()
    errorForm(res.status,res.message)
	let changeTarget = document.querySelector("#msg-container");
	let successMsgTarget = document.querySelector("#success-msg");
	let errMsgTarget = document.querySelector("#error-msg");
	changeTarget.classList.contains("d-none")
		? changeTarget.classList.toggle("d-none")
		: null;
	errMsgTarget.classList.contains("d-none")
		? errMsgTarget.classList.toggle("d-none")
		: null;
	!successMsgTarget.classList.contains("d-none")
		? successMsgTarget.classList.toggle("d-none")
		: null;
};
let form = document.querySelector("#edit-camp-form");
const submitButton = document.querySelector("#editCampSubmit");
const deleteButton = document.querySelector("#editCampDelete");
let changeTracker = [];
let id = form.dataset.dbId;
form = form.elements;
for (let node of form) {
	node.addEventListener("change", () => {
		node.name === "campState" || node.name === "campCity"
			? changeTracker.push("location")
			: changeTracker.push(node.name);
	});
}

async function submitFormData() {
	let editObject = {};
	const currentObject = {
		title: form.editCampTitle.value,
		price: form.editCampPrice.value,
		description: form.editCampDescription.value,
		location: `${form.campCity.value}, ${form.campState.value}`
	};
	for (let change of changeTracker) {
		editObject[change] = currentObject[change];
	}
	const req = await fetch(`/campgrounds/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(editObject)
	});
	req.status === 200 ? successfulUpdate() : updateError(req);
}

async function deleteCamp() {
	const req = await fetch(`/campgrounds/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json"
		}
	});
	if (req.status === 204) {
		// alert("Campground Deleted");
		window.location.replace("/campgrounds");
	} else {
		const res = await req.json();
		errorForm(res.status, res.message);
	}
}
submitButton.addEventListener("click", validateForm);
deleteButton.addEventListener("click", deleteCamp);

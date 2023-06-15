const validatePassword = function (form) {
    const requirementThreshold = 4
    let requirementMet = 0
    const upperCaseRegEx = /['A-Z']/
    const lowerCaseRegEx = /['a-z']/
    const digitRegEx = /[0-9]/
    const specialCharRegEx = /[+!@#$%^&*?_-~]/
    const passwordEntry = form.elements.password.value
    if(passwordEntry.length >= 8 && passwordEntry.length <= 24){
        requirementMet += 1
        if(passwordEntry.match(upperCaseRegEx)){
            requirementMet +=1
        }
        if(passwordEntry.match(lowerCaseRegEx)){
            requirementMet +=1
        }
        if(passwordEntry.match(digitRegEx)){
            requirementMet += 1
        }
        if(passwordEntry.match(specialCharRegEx)){
            requirementMet +=1
        }
        requirementMet >= requirementThreshold ? submitFormData(form):informPasswordError()
    } else {
        return false
    }
}

const validateForm = function () {
    let formToValidate = document.querySelector('.form-to-validate')
    if(!formToValidate.checkValidity()){
        console.log('Something is invalid')
    } else {
        if(formToValidate.id === 'userRegistrationForm'){
            validatePassword(formToValidate)
        } else if(formToValidate.id === 'new-camp-form'){
            validateRoute(formToValidate)
        } else {
            submitFormData(formToValidate)
        }
    }
    formToValidate.classList.add('was-validated')
}

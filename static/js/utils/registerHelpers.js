const informPasswordError = function () {
    const passwordErrorMessage = document.querySelector('#password').nextElementSibling
    passwordErrorMessage.display='block'
}

async function submitFormData (form) {
    let submitObject = {}
    for(let node of form){
        submitObject[node.name] = node.value
    }
    const req = await fetch('/register', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submitObject)
    })
    const res = await req.json()
    console.log('Converted to JSON')
    if(res.status === 200){
        window.location.replace('/campgrounds') 
    } else {
        console.log('Something went wrong')
    }
}
const submitButton = document.querySelector('#newUserSubmit')
submitButton.addEventListener('click', validateForm)
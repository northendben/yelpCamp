// async function submitFormData (form) {
//     let submitObject = {}
//     for(let node of form){
//         submitObject[node.name] = node.value
//     }
//     console.log(submitObject)
//     const req = await fetch('/login', {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(submitObject)
//     })
//     if(req.status === 200){ 
//         console.log('yeah')
//     } else {
//         const res = await req.json()
//         alert(res)
//     }
// }

// const submitButton = document.querySelector('#loginSubmit')
// submitButton.addEventListener('click', validateForm)
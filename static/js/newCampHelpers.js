const submitButton = document.querySelector('#newCampSubmit')
let form = document.querySelector('#new-camp-form').elements
const formSubmit = document.querySelector('#new-camp-form')

async function submitFormData () {
    // formSubmit.submit()
    const submitObject = new FormData()
    submitObject.set('title', form.newCampTitle.value)
    submitObject.set('price',parseInt(form.newCampPrice.value) ) 
    submitObject.set('description',form.newCampDescription.value) 
    submitObject.set('location', `${form.campCity.value}, ${form.campState.value}`)
    if(form.campImg.files.length > 0){
        // let names = []
        // for(let file of form.campImg.files){
        //     names.push(file.name)
        // }
        // for(let i = 0; i < form.campImg.files.length; i++){
        //     submitObject.append('image', form.campImg.files[i],names[i] + form.newCampTitle.value)
        // }
        for(let file of form.campImg.files){
            submitObject.append('image', file, file.name.split('.')[0] + '_' + form.newCampTitle.value)
        } 

    }
    const req = await fetch('/campgrounds/new', {
        method: "POST",
        body: submitObject
    })
    if(req.status === 200){
        const res = await req.json()
        window.location.href = `/campgrounds/${res.Id}`
    } else {
        const res = await req.json()
        errorForm(res.status,res.message)
    }
}

async function validateRoute () {
    const submitObject = {
            title: form.newCampTitle.value,
            price: parseInt(form.newCampPrice.value),
            description: form.newCampDescription.value,
            location: `${form.campCity.value}, ${form.campState.value}`,
        }
    const req = await fetch('/campgrounds/validate', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitObject)
    })
    if(req.status === 200){
        submitFormData()
    } else {
        const res = await req.json()
        errorForm(res.status,res.message)
    }
}
    // console.log(evt)
    // const submitObject = {
    //     title: form.newCampTitle.value,
    //     price: parseInt(form.newCampPrice.value),
    //     description: form.newCampDescription.value,
    //     location: `${form.campCity.value}, ${form.campState.value}`,
    //     image: form.campImg.value
    // }
    // console.log(submitObject)
    // console.log(JSON.stringify(submitObject))
    // const req = await fetch('/campgrounds/new', {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(submitObject)
    // })
//     if(req.status === 200){
//         const res = await req.json()
//         window.location.href = `/campgrounds/${res.Id}`
//     } else {
//         const res = await req.json()
//         errorForm(res.status,res.message)
//     }
// }
submitButton.addEventListener('click', validateForm)
const images = document.querySelector('.image-manage-container') 
const imageUploader = document.querySelector('#newCampImg')
const imageSubmitButton = document.querySelector('#addImageSubmit')
imageUploader.addEventListener('change', checkIfShowSaveButton)
const imageDeleteButton = document.querySelector('#imageDeleteButton')
imageDeleteButton.addEventListener('click', deleteSelected)
images.addEventListener("click", changeSelected)
imageSubmitButton.addEventListener('click', updateImages)


function changeSelected (e) {
    const target = e.target
    target.classList.contains('img-fluid') ? target.classList.toggle('selected-image') : null
    const selectedImages = document.querySelectorAll('.selected-image')
    if(selectedImages.length > 0){
        if(imageDeleteButton.classList.contains('hide')){
            imageDeleteButton.classList.remove('hide')
        }
    } else {
        if(!imageDeleteButton.classList.contains('hide')){
            imageDeleteButton.classList.add('hide')
        }
    }
}
async function deleteSelected () {
    const imageIds = []
    const selectedImages = document.querySelectorAll('.selected-image')
    for(let image of selectedImages){
        imageIds.push(image.dataset.filename)
    }
    const req = await fetch(`/campgrounds/${idToUpdate}/images`, {
        method: 'POST',
        body: JSON.stringify(imageIds),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(req.status === 200){
        const res = await req.json()
        window.location.href = `/campgrounds/${idToUpdate}/edit/images`
    } else {
        const res = await req.json()
        console.log(res)
        errorForm(res.status,res.message)
    }
}


function checkIfShowSaveButton () {
    if(imageUploader.files.length > 0){
        imageSubmitButton.classList.contains('hide') ? imageSubmitButton.classList.remove('hide'):null
    } else {
        imageSubmitButton.classList.contains('hide') ? null:imageSubmitButton.classList.add('hide')
    }
}

async function updateImages () {
    const form = document.querySelector('#newCampImg')
    const submitObject = new FormData()
    for(let file of form.files){
        submitObject.append('images', file, file.name.split('.')[0] + '_' + campTitle)
    }
    const req = await fetch(`/campgrounds/${idToUpdate}/images`, {
        method: 'PUT',
        body: submitObject
    })
    if(req.status === 200){
        const res = await req.json()
        window.location.href = `/campgrounds/${idToUpdate}/edit/images`  
    } else {
        const res = await req.json()
        errorForm(res.status,res.message)
    }
}
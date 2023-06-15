async function deleteCamp () {
    const req = await fetch(`/campgrounds/${campId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(req.status === 204) {
        window.location.replace('/campgrounds')
    } else{
        const res = await req.json()
        errorForm(res.status,res.message)
    } 
}

const checkRating = function () {
    const warningMsg = document.querySelector('#requireRatingMsg')
    if(ratingSelected === true){
        warningMsg.style.display ='None'
        validateForm()
    } else{
        warningMsg.style.display = 'block'
    } 
}

const deleteButton = document.querySelector('#editCampDelete')
try {
deleteButton.addEventListener('click', deleteCamp)
} catch (e)
{
    console.log(e)
}
let campId = document.querySelector('#title')
campId = campId.dataset.dbId

let desiredScore = null
let ratingSelected = false
function setDesiredScore(evt){
    ratingSelected = true
    desiredScore = evt.target.dataset.ratingScore
}
let reviewStars = document.querySelector('.starability-basic')
if(reviewStars) {
    reviewStars = reviewStars.querySelectorAll('label')
    for(let node of reviewStars){
        node.addEventListener('click', setDesiredScore)
    }
}

const reviewSubmitBtn = document.querySelector('#reviewSubmitBtn')
reviewSubmitBtn ? reviewSubmitBtn.addEventListener('click', checkRating):null


const submitFormData = async function (form) {
    form = form.elements
    submitObject = {
        body: form.reviewBody.value,
        rating: desiredScore,
        campground: campId
    }
    const req = await fetch('/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitObject)
    })
    if(req.status === 200){
        const containerToHide = document.querySelector('.review-submission-container')
        containerToHide.classList.toggle('hide')
        const sucessMsgContainer= document.querySelector('.success-msg')
        sucessMsgContainer.classList.toggle('hide')
    }
}
const deleteReview = async function (evt) {
    if(confirm('Are you sure you want to delete?')){
        const reviewId = evt.currentTarget.parentElement.dataset.reviewId
        const req = await fetch('/reviews/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reviewId: reviewId,
                campId: campId
            })
        })
        if(req.status === 204){
            window.location.replace(`/campgrounds/${campId}`)
        } else{
            console.log('Error')
        }
    }
}

const deleteIcons = document.querySelectorAll('.review-trash-icon')
for(let icon of deleteIcons){
    icon.addEventListener('click', deleteReview)
}

function createMap () {
    mapboxgl.accessToken = mbToken
    const map = new mapboxgl.Map({
    container: 'campMap', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campCoordinates, // starting position [lng, lat]
    zoom: 7, // starting zoom
    });
    if(renderPin && renderPin === true){
        const pin = document.createElement('div')
        pin.classList.add('map-pin')
        // pin.innerHTML = '<i class="fa-solid fa-map-pin fa-lg"></i>'
        pin.innerHTML = '<i class="fa-solid fa-location-pin fa-xl"></i>'
        new mapboxgl.Marker({color: '#e30d0d'}).setLngLat(campCoordinates).addTo(map);
        // new mapboxgl.Marker(pin).setLngLat(campCoordinates).addTo(map);
    }
}

createMap()

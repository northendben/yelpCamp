async function userLogOut (evt) {
    evt.preventDefault()
    const req = await fetch('/logout', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if(req.status === 200){
        const res = await req.json()
        if(res.status === 200 && res.message === 'Logged out'){
            window.location.replace('/campgrounds')
        } else{
            console.log('Something went wrong.')
        }
    }
}
const logoutButton = document.querySelector('#logoutButton')
if(logoutButton){
    logoutButton.addEventListener('click', userLogOut)
}
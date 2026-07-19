const form = document.getElementById('form')

form.addEventListener('submit',signup)

const baseURL = "http://localhost:3000/users/signup"

async function signup(e) {
    e.preventDefault()
    try{
        const account = {
            name:document.getElementById('name').value,
            email:document.getElementById('email').value,
            phone:document.getElementById('phone').value,
            password:document.getElementById('password').value,
            confirm:document.getElementById('confirm').value
        }
        if(account.password !== account.confirm){
            alert('password do not match')
            return
        }
        if(account){
            await postUser(account)
        }
        form.reset()
    }
    catch(err){
        console.log(err.message)
    }
}

async function postUser(account) {
    try{
        let result = await axios.post(baseURL,account)
        console.log(result.data)
        alert(`${result.data.name} has successfully created an account`)
        window.location.href="../html/signin.html"
    }
    catch(err){
        console.log(err.message)
        alert('try again signup failed')
    }

}
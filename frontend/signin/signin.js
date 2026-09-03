const form = document.getElementById('form')

form.addEventListener('submit',signIn)

// const baseURL= 'http://localhost:3000/users/signin'

const baseURL = '/users/signin';

async function signIn(e) {
    e.preventDefault()
    try{
        const account={
            email:document.getElementById('email').value,
            password:document.getElementById('password').value
        }
        if(account.email && account.password){
            await navigateAccount(account)
        }
        form.reset()
    }
    catch(err){
        console.log(err.message)
    }
}

async function navigateAccount(account) {
    try{
        const result = await axios.post(baseURL,account)
        console.log(result.data)
        alert(`welcome ${result.data.name} `)

        window.location.href = "../expenseTracker/expense.html"
    }
    catch(err){
        alert(err.response?.data?.message || 'login failed create account first')
    }
}

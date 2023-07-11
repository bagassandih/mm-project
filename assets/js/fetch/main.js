async function login() {
    
    // check token
    if (localStorage.getItem('token')){
        alert('You are already login.');
        return window.location.href = './profile.html';
    }

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let response = await fetch('http://localhost:4000/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `mutation Login($input: loginInput) {
                login(input: $input) {
                  token
                  _id
                }
              }`,
            variables: {
                "input": {
                    "email": email,
                    "password": password
                }
            }
        })
    })
    let responseData = await response.json();
    if (responseData.errors){
        alert(responseData.errors[0].message);
    } else {
        responseData = responseData.data.login;
        localStorage.setItem('user_id', responseData._id);
        localStorage.setItem('token', responseData.token);
        window.location.href = './profile.html';
    }
  
}

async function profile(){
    setTimeout(() =>{
        if (!localStorage.getItem('token')){
            alert('Login first.');
            return window.location.href = './login.html';
        }
    },3000)
    let response = await fetch('http://localhost:4000/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': String(localStorage.getItem('token'))},
        body: JSON.stringify({
            query: `query GetOneUser($input: ID) {
                getOneUser(input: $input) {
                  first_name
                  last_name
                  is_verified
                  _id
                  gender
                  email
                }
              }`,
            variables: {
                "input": String(localStorage.getItem('user_id'))
              }
        })
    })
    let responseData = await response.json();
    responseData = await responseData.data.getOneUser;

    // insert to html
    document.getElementById('greetings').innerText = responseData.first_name;
    document.getElementById('table-first_name').innerText = responseData.first_name;
    document.getElementById('table-last_name').innerText = responseData.last_name;
    document.getElementById('table-gender').innerText = responseData.gender;
    document.getElementById('table-email').innerText = responseData.email;

    // handle verification
    let verified = responseData.is_verified;
    let elementEmail = document.getElementById('table-is_verified');
    if (verified){
        elementEmail.innerText = 'Verified';
        elementEmail.className = 'text-success';
    } else {
        elementEmail.innerText = 'Not Verified';
        elementEmail.className = 'text-danger';
        document.getElementById('table-button_verified').innerHTML = `
        <input type="button" class="btn btn-success" onclick="sendVerification()" value="Verifiy Now">
        `;
        
    }
}

async function register(){

    if (localStorage.getItem('token')){
        alert('You are already login.');
        return window.location.href = './profile.html';
    }

    let userRegister = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    let response = await fetch('http://localhost:4000/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `mutation Mutation($input: createNewUserInput) {
                createNewUser(input: $input) {
                  _id
                }
              }`,
            variables: {
                "input": {
                  "first_name": userRegister.first_name,
                  "last_name": userRegister.last_name,
                  "gender": userRegister.gender,
                  "email": userRegister.email,
                  "password": userRegister.password
                }
              }
        })
    })

    let responseData = await response.json();

    if (responseData.errors){
        alert(responseData.errors[0].message)
    } else {
        responseData = await responseData.data.createNewUser;
        alert('Congratulations! Your account has been created.');
        window.location.href = './login.html';
    }
   
}

async function sendVerification(){
    let response = await fetch('http://localhost:4000/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': String(localStorage.getItem('token'))},
        body: JSON.stringify({
            query: `mutation SendVerification {
                sendVerification
              }`,
        })
    })

    let responseData = await response.json();
    if (responseData.errors){
        alert(responseData.errors[0].message)
    } else {
        responseData = await responseData.data.sendVerification;
        localStorage.setItem('code', responseData);
        alert('Check your email for verification code.')
        window.location.href = './verification.html';
    }
    
}

async function verifyUser(){
    let trueCode = String(localStorage.getItem('code'));
    let code = String(document.getElementById('code').value);

    let response = await fetch('http://localhost:4000/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': String(localStorage.getItem('token'))},
        body: JSON.stringify({
            query: `mutation VerifyUser($input: verifyInput) {
                verifyUser(input: $input)
              }`,
              variables: {
                "input": {
                  "code": code,
                  "trueCode": trueCode
                }
              }
        })
    })

    let responseData = await response.json();
    console.log(responseData)
    if (responseData.errors){
        alert(responseData.errors[0].message)
    } else {
        responseData = await responseData.data.verifyUser;
        alert(responseData);
        window.location.href = './profile.html';
    }
    
}


async function logout(){
    localStorage.clear();
    window.location.href = './login.html';
}
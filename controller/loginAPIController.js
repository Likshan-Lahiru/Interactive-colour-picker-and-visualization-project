let user_id;

let next_user_id;

initialize();

function initialize() {
    setTimeout(() => {
        loadNextIid();
    }, 1000);
}

class UseModelSignUp {
    constructor(username,password,firstName,lastName,phoneNumber,companyName,email) {
        this.id = next_user_id;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.companyName = companyName;
        this.email = email;}

}

class UseModelSignIn {
    constructor(email,password) {
        this.password = password;
        this.email = email;}

}

$('#sign-up').on('click', () => {
    console.log("click sign up button");


    const name = $("#sign-up-user-name").val();
    const firstName = $("#sign-up-first-name").val();
    const lastName = $("#sign-up-last-name").val();
    const companyName = $("#sign-up-company-name").val();
    var contact = $("#sign-up-contact").val();
    var email = $("#sign-up-email").val();
    var password = $("#sign-up-password").val();
    var re_password = $("#sign-up-re-password").val();

    if (name == "" || email == "" || password == "" || re_password == ""|| contact == ""|| firstName == ""|| lastName == ""|| companyName == "") {
        Swal.fire({
            position: "top-end",
            icon: "question",
            title: "Please fill all fields",
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }
    let user = new UseModelSignUp(name,password,firstName,lastName,contact,companyName,email );
    let userJson = JSON.stringify(user);

    console.log( email, password, re_password);
    if (password == re_password) {
        $.ajax({
            url: "http://localhost:8080/cmyk/api/user/signUpNoImage",
            type: "POST",
            data: userJson,
            contentType: "application/json",
            success: (res) => {

                clear()
                Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your details saved",
                        showConfirmButton: false,
                        timer: 1000
                    });
                    window.location.href = "main.html";

            },
            error: (res) => {
                console.error(res);
                Swal.fire({
                    title: "Error",
                    text: "Failed to create user. Please try again later.",
                    icon: "error"
                });
            }
        });
    } else {
        Swal.fire({
            title: "Password Not Match!",
            text: "Please ensure the passwords are the same.",
            icon: "question"
        });
    }
});

$('#sign-In').on('click', () => {
    console.log("Click sign-in button");

    var email = $("#sign-In-email").val();
    var password = $("#sign-In-password").val();

    if (email == "" || password == "") {
        Swal.fire({
            position: "top-end",
            icon: "question",
            title: "Please fill all fields",
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }
    let userSignIn = new UseModelSignIn(email, password);
    let userJson = JSON.stringify(userSignIn);

    console.log(email, password);
    $.ajax({
        url: "http://localhost:8080/cmyk/api/user/signIn",
        type: "POST",
        data: userJson,
        contentType: "application/json",
        success: (res) => {

            let user_id = res;

            localStorage.setItem('user_id', user_id);
            console.log("User ID saved in localStorage: " + user_id);

            clear();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Login successful",
                showConfirmButton: false,
                timer: 1000
            });

            window.location.href = "main.html";
        },
        error: (res) => {
            console.error(res);
            Swal.fire({
                title: "Login Failed",
                text: "Incorrect email or password. Please try again.",
                icon: "error"
            });
        }
    });
});

function clear() {
    $("#sign-up-user-name").val('');
    $("#sign-up-first-name").val('');
    $("#sign-up-last-name").val('');
    $("#sign-up-company-name").val('');
    $("#sign-up-contact").val('');
    $("#sign-up-email").val('');
    $("#sign-up-password").val('');
    $("#sign-up-re-password").val('');
    $("#sign-In-email").val('');
    $("#sign-In-password").val('');
}

function loadNextIid() {

    let jwtToken = localStorage.getItem('jwtToken');
    $.ajax({
        url: "http://localhost:8080/cmyk/api/user/genUserID",
        type: "GET",
        success: (res) => {

            console.log("print response nextID:"+res)
            next_user_id = res
            localStorage.setItem('user_id', next_user_id);




        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "question",
                title: "Failed to load next user ID!..",
                showConfirmButton: false,
                timer: 3500
            });
            console.error("Failed to load next user ID:", err);
        }
    });
}
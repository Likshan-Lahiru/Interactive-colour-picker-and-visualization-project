let user_id = localStorage.getItem('user_id');
console.log("Retrieved user ID from localStorage user API: " + user_id);
var newPassword;
var newImage;

initialize();

function initialize() {
    setTimeout(() => {
     loadUser(user_id)
    }, 1000);
}

class UserModel {
    constructor(id, username, password, firstName, email, phoneNumber, companyName, userProfileImage, lastName) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.companyName = companyName;
        this.userProfileImage = userProfileImage;
        this.lastName = lastName;
    }
}


function loadUser(user_id) {
    $.ajax({
        url: `http://localhost:8080/cmyk/api/user/${user_id}`,
        type: "GET",
        dataType: "json",
        success: (res) => {
            console.log("Response received:", res);


            $('#user_name').text(res.username);
            $('#user_name_update').val(res.username);
            $('#first_name').text(res.firstName);
            $('#first_name_update').val(res.firstName);
            $('#last_name').text(res.lastName);
            $('#last_name_update').val(res.lastName);
            $('#email').text(res.email);
            $('#email_update').val(res.email);
            $('#company').text(res.companyName);
            $('#company_name_update').val(res.companyName);
            $('#contact').text(res.phoneNumber);
            $('#contact_name_update').val(res.phoneNumber);
            $('#full-name').text(res.firstName+" "+res.lastName);
            newPassword = res.password


            if (res.userProfileImage) {
                $('#user-image').attr('src', `data:image/png;base64,${res.userProfileImage}`);
                $('#formFileMultiple').attr('src', `data:image/png;base64,${res.userProfileImage}`);

            } else {
                $('#user-image').attr('src', 'https://bootdey.com/img/Content/avatar/avatar7.png');
            }
        },
        error: (err) => {
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Failed to load User!",
                text: "Please try again later.",
                showConfirmButton: true,
                timer: 4000
            });
            console.error("Failed to load User:", err);


            $('#user-image').attr('src', 'https://bootdey.com/img/Content/avatar/avatar7.png');
        }
    });
}


$("#update-user").on('click', () => {

    const formData = new FormData();
    var image = $("#formFileMultiple")[0].files[0];

    if ($('#formFileMultiple').get(0).files.length === 0) {



    } else {
        image = $("#formFileMultiple")[0].files[0];

    }


    formData.append("userProfileImage", image);
    formData.append("username", $("#user_name_update").val());
    formData.append("firstName", $("#first_name_update").val());
    formData.append("lastName", $("#last_name_update").val());
    formData.append("email", $("#email_update").val());
    formData.append("companyName", $("#company_name_update").val());
    formData.append("phoneNumber", $("#contact_name_update").val());
    formData.append("password", newPassword);
    formData.append("id", user_id);


    $.ajax({
        url: `http://localhost:8080/cmyk/api/user/${user_id}`,
        type: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        success: (res) => {

            Swal.fire({
                title: "User Update successfully!",
                text: "Success",
                icon: "success"
            });
            $('#exampleModalCenter1').modal('hide');
            initialize()
            clearForm();
        },
        error: (res) => {

            console.error(res);
            Swal.fire({
                title: "User Update Unsuccessful!",
                text: "Error occurred while updating the user.",
                icon: "error"
            });
        }
    });
});


function clearForm() {
    $("#formFileMultiple").val("");
    $("#user_name_update").val("");
    $("#first_name_update").val("");
    $("#last_name_update").val("");
    $("#email_update").val("");
    $("#company_name_update").val("");
    $("#contact_name_update").val("");
}

$("#logout").on("click", function() {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Logout !"
    }).then((result) => {
        if (result.isConfirmed) {

            window.location.href = "index.html";
        }
    });

});






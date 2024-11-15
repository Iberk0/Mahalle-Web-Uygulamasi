// Assignment Form 1: Apartment assignment based on first and last name
document.getElementById("assignmentForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form submission

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const apartmentNo = document.getElementById("apartmentNo").value;

    try {
        // Fetch user_id based on first name and last name
        const response = await fetch('http://localhost:3005/api/getUserID', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName })
        });
        const data = await response.json();
        const resident_id = data.id;

        if (response.ok) {
            // Send the apartment assignment request with resident_id as userID
            const assignResponse = await fetch('http://localhost:3005/api/assignApartment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resident_id, apartmentNo })
            });
            const assignResult = await assignResponse.json();
            alert("Apartment assigned successfully.");
            firstName.value = '';
            lastName.value = '';
            apartmentNo.value = '';
        } else {
            alert(data.error || "User not found.");
        }
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
});

// Assignment Form 2: Get apartment number based on user ID and display in textarea
document.getElementById('assignmentForm2').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const firstName = document.getElementById('firstName2').value;
    const lastName = document.getElementById('lastName2').value;
    const apartmentNoTextArea = document.querySelector('textarea');

    try {
        // Fetch user ID based on first and last name
        const userIdResponse = await fetch('http://localhost:3005/api/getUserID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName })
        });

        const userIdData = await userIdResponse.json();

        if (userIdData.error) {
            alert(userIdData.error);
            return;
        }

        const userId = userIdData.id;

        // Fetch apartment number based on user ID
        const apartmentResponse = await fetch(`http://localhost:3005/api/users/${userId}/apartment`);
        const apartmentData = await apartmentResponse.json();

        if (apartmentData.error) {
            alert(apartmentData.error);
        } else {
            // Display apartment number in the textarea
            apartmentNoTextArea.value = "The Apartment Number: " + apartmentData.daire_no;
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
});

// Delete User: Confirm and delete user by first name and last name
document.getElementById('deleteForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const firstName = document.getElementById('firstNameDelete').value;
    const lastName = document.getElementById('lastNameDelete').value;

    // Confirm before proceeding with deletion
    const isConfirmed = confirm('Are you sure you want to delete this user?');

    if (isConfirmed) {
        try {
            // Send request to delete user by first name and last name
            const deleteResponse = await fetch(`http://localhost:3005/api/users/${firstName}/${lastName}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Parse the response
            const result = await deleteResponse.json();

            if (result.error) {
                alert(result.error);
            } else {
                alert('Kullanıcı başarıyla silindi.');
                document.getElementById('firstNameDelete').value = '';
                document.getElementById('lastNameDelete').value = '';
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    } else {
        alert('Silme işlemi iptal edildi.');
    }
});


//Adding a new service 

document.getElementById('assignmentForm3').addEventListener('submit', async function(event) {
    event.preventDefault(); // Formun varsayılan submit davranışını engelle

    const firstName = document.getElementById('firstNameservice').value;
    const lastName = document.getElementById('lastNameservice').value;
    const telephoneNumber = document.getElementById('telephoneNumber').value;  // Formdaki telefon numarası inputu
    const serviceType = document.querySelector('select').value;

    try {
        // Servis eklemek için API'ye istek gönder
        const response = await fetch('http://localhost:3005/api/addService', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                telephoneNumber: telephoneNumber,
                serviceType: serviceType
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Servis başarıyla eklendi. Servis ID: ' + data.serviceId);
            document.getElementById('firstNameservice').value = '';
            document.getElementById('lastNameservice').value = '';
            document.getElementById('telephoneNumber').value = '';
        } else {
            alert(data.error || 'Bir hata oluştu.');
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
});

//Event ekleme 


    document.getElementById('assignmentForm4').addEventListener('submit', async (e) => {
        e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

        // Formdan inputları al
        const eventName = document.getElementById('eventName').value.trim();
        const description = document.getElementById('description').value.trim();

        if (!eventName || !description) {
            alert('Event name and description cannot be empty!');
            return;
        }

        try {
            // API'ye POST isteği gönder
            const response = await fetch('http://localhost:3005/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event_name: eventName,
                    event_description: description,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Event created successfully! Event ID: ${result.event_id}`);
                document.getElementById('assignmentForm4').reset(); // Formu temizle
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
            alert('An error occurred while creating the event.');
        }
    });


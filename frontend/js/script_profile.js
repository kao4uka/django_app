const apiBaseUrl = 'http://127.0.0.1:8000/api/core/'; // Замените на ваш URL

async function fetchProfiles() {
    try {
        const response = await fetch(`${apiBaseUrl}profile/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data); // Для отладки
        displayProfiles(data.results); // Обновлено для доступа к результатам
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayProfiles(profiles) {
    const profilesContainer = document.getElementById('profiles');
    profilesContainer.innerHTML = '';

    if (Array.isArray(profiles) && profiles.length > 0) {
        profiles.forEach(profile => {
            const profileDiv = document.createElement('div');
            profileDiv.className = 'profile';
            profileDiv.innerHTML = `
                <h2>User ID: ${profile.user}</h2>
                <img src="${profile.image}" alt="Profile picture of user ${profile.user}">
            `;
            profilesContainer.appendChild(profileDiv);
        });
    } else {
        profilesContainer.innerHTML = '<p>No profiles found.</p>';
    }
}
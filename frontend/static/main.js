// Function that runs once the window is fully loaded
window.onload = function() {
      hideUpdateForm();
    // Attempt to retrieve the API base URL from the local storage
    var savedBaseUrl = localStorage.getItem('apiBaseUrl');
    // If a base URL is found in local storage, load the posts
    if (savedBaseUrl) {
        document.getElementById('api-base-url').value = savedBaseUrl;
        //loadPosts();

        loadPage(1);
        searchPosts();
        // loadPosts(page);
    }

}

function loadPosts() {
    // Retrieve the base URL from the input field and save it to local storage
    var baseUrl = document.getElementById('api-base-url').value;
    localStorage.setItem('apiBaseUrl', baseUrl);

    // Use the Fetch API to send a GET request to the /posts endpoint
    fetch(baseUrl + '/posts')
        .then(response => response.json())
        .then(data => {
            // Clear out the post container first
            const postContainer = document.getElementById('post-container');
            postContainer.innerHTML = '';

            // For each post in the response, create a new post element and add it to the page
            data.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';

                postDiv.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;

                // Create update button and update textboxes
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.className = 'update-button'; // Add the update button class
                updateButton.onclick = function () {
                    // Display update textboxes for the selected post
                    displayUpdateForm(post);
                };

                // Create delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button'; // Add the delete button class
                deleteButton.onclick = function () {
                    // Call deletePost function with the post ID
                    deletePost(post.id);
                };

                // Append update and delete buttons to the postDiv
                postDiv.appendChild(updateButton);
                postDiv.appendChild(deleteButton);

                postContainer.appendChild(postDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}
function displayUpdateForm(post) {
    // Display the update form
    const updateForm = document.getElementById('update-form');
    updateForm.style.display = 'block';

    // Populate the update form with post data
    document.getElementById('update-post-id').value = post.id;
    document.getElementById('update-post-title').value = post.title;
    document.getElementById('update-post-content').value = post.content;
}

// Function to hide the update form
function hideUpdateForm() {
    const updateForm = document.getElementById('update-form');
    updateForm.style.display = 'none';
}

// update the post by post_id
function updatePost() {
    // Get the updated data from the input fields
    const postId = document.getElementById('update-post-id').value;
    const updatedTitle = document.getElementById('update-post-title').value;
    const updatedContent = document.getElementById('update-post-content').value;

    // Prepare the data for the PUT request
    const updatedPostData = {
        title: updatedTitle,
        content: updatedContent
    };

    // Retrieve the base URL from local storage
    const baseUrl = localStorage.getItem('apiBaseUrl');

    // Use the Fetch API to send a PUT request to the /api/posts/:id endpoint
    fetch(`${baseUrl}/posts/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPostData)
    })
        .then(response => response.json())
        .then(updatedPost => {
            // Log the updated post data to the console
            console.log('Updated Post:', updatedPost);

            //  update the displayed posts on the page or take other actions
            //  loadPosts() function again to refresh the posts
            loadPosts();

            // Hide the update form after a successful update
            hideUpdateForm();
        })
        .catch(error => console.error('Error updating post:', error));
}



// Function to send a POST request to the API to add a new post
function addPost() {
    // Retrieve the values from the input fields
    var baseUrl = document.getElementById('api-base-url').value;
    var postTitle = document.getElementById('post-title').value;
    var postContent = document.getElementById('post-content').value;

    console.log('Adding post:', postTitle, postContent);

    // Use the Fetch API to send a POST request to the /posts endpoint
    fetch(baseUrl + '/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: postTitle, content: postContent })
    })
    .then(response => response.json())  // Parse the JSON data from the response
    .then(post => {
        console.log('Post added:', post);
        loadPosts(); // Reload the posts after adding a new one
    })
    .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}

// Function to send a DELETE request to the API to delete a post
function deletePost(postId) {
    var baseUrl = document.getElementById('api-base-url').value;

    // Use the Fetch API to send a DELETE request to the specific post's endpoint
    fetch(baseUrl + '/posts/' + postId, {
        method: 'DELETE'
    })
    .then(response => {
        console.log('Post deleted:', postId);
        loadPosts(); // Reload the posts after deleting one
    })
    .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}


// Assuming you have a function loadPosts() for loading all posts

function searchPosts() {
    // Retrieve the base URL from local storage
    var baseUrl = localStorage.getItem('apiBaseUrl');


    // Get search terms from input fields
    var titleQuery = document.getElementById('search-title').value;
    var contentQuery = document.getElementById('search-content').value;

    // Use the Fetch API to send a GET request to the /posts/search endpoint with query parameter
    fetch(`${baseUrl}/posts/search?title=${titleQuery}&content=${contentQuery}`)
        .then(response => response.json())
        .then(data => {
            // Clear out the post container first
            const postContainer = document.getElementById('post-container');
            postContainer.innerHTML = '';

            // For each post in the response, create a new post element and add it to the page
            data.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
                postContainer.appendChild(postDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Add an event listener to the search input to trigger the search on Enter key press
document.getElementById('search-button').addEventListener('click', searchPosts);


// Define a variable to store the current page
let currentPage = 1;

// Function to load posts based on the current page
// function loadPage(page) {
//     const baseUrl = document.getElementById('api-base-url').value;
//
//     // Use the Fetch API to send a GET request to the /posts endpoint with pagination parameters
//     fetch(`${baseUrl}/posts?page=${page}`)
//         .then(response => response.json())
//         .then(data => {
//             // Clear out the post container first
//             const postContainer = document.getElementById('post-container');
//             postContainer.innerHTML = '';
//
//             // For each post in the response, create a new post element and add it to the page
//             data.forEach(post => {
//                 const postDiv = document.createElement('div');
//                 postDiv.className = 'post';
//                 postDiv.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
//                 postContainer.appendChild(postDiv);
//             });
//
//             // Update the current page variable
//             currentPage = page;
//
//             // Enable/disable pagination buttons based on the current page
//             const prevBtn = document.getElementById('prevBtn');
//             const nextBtn = document.getElementById('nextBtn');
//             prevBtn.disabled = currentPage === 1;
//             nextBtn.disabled = data.length === 0; // Disable next button if there are no more posts
//         })
//         .catch(error => console.error('Error:', error));
// }

function loadPage(page) {
    console.log('Loading page:', page);

    const baseUrl = document.getElementById('api-base-url').value;

    // Use the Fetch API to send a GET request to the /posts endpoint with pagination parameters
    fetch(`${baseUrl}/posts?page=${page}`)
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data);

            // Clear out the post container first
            const postContainer = document.getElementById('post-container');
            postContainer.innerHTML = '';

            // For each post in the response, create a new post element and add it to the page
            data.forEach(post => {
                console.log('Processing post:', post);

                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
                postContainer.appendChild(postDiv);
            });

            // Update the current page variable
            currentPage = page;

            // Enable/disable pagination buttons based on the current page
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = data.length === 0; // Disable next button if there are no more posts
        })
        .catch(error => console.error('Error:', error));
}


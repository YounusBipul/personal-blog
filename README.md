# personal-blog
A Simple Personal Blog site Where a blog owner can post blogs and viewers can comment on them.

### Technologies used

Nodejs, Express, MongoDB

### Features

Admin:
1. Create Account (only one account can be created as it is a personal blog site)
2. Add, Edit, Delete a Categories
3. Add, Edit, Delete a Post
4. Login with same id in blog site as user and manage profile
5. Delete other user comment if necessary
6. View user list
7. Get Notification on comment

User:
1. Create an account
2. See Posts by Admin
3. Add, edit, remove comment on Posts
4. Manage profile (edit profile and change password)

### Future Work

Admin: 
1. Restrict particular users from commenting on Posts.
2. view suggested posts to cover list
3. search

User:
1. Like a comment
2. Like a post
3. Suggest a topic to cover

### Instalation guide

1. Make sure npm, mongodb is installed on your pc
2. clone this repository
3. In the root directory-> open command prompt and install all the necessary npm packages used in this proect.
run "npm install"
4. run "node app.js" and visit "localhost:4500"

-- Users Table
CREATE TABLE users (
id INT PRIMARY KEY, 
username VARCHAR(255) NOT NULL, 
password VARCHAR(255) NOT NULL
);

-- Tasks Table 

CREATE TABLE tasks(
    id INT PRIMARY KEY, 
    title TEXT, 
    description TEXT, 
    due_date DATE, 
    status BOOLEAN DEFAULT FALSE
);

-- Tasks for a specific user 

CREATE TABLE user_tasks(
    user_id INT NOT NULL, 
    task_id INT NOT NULL, 
    PRIMARY KEY (user_id, task_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (task_id) REFERENCES tasks(id)
);


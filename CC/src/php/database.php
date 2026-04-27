<?php
require_once 'config.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ensure the application database exists.
$dbCheck = $conn->query("SHOW DATABASES LIKE '" . DB_NAME . "'");
if ($dbCheck->num_rows == 0) {
    $conn->query("CREATE DATABASE " . DB_NAME);
}

$conn->select_db(DB_NAME);

$createUsersSQL = "
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    studentID VARCHAR(10) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
if (!$conn->query($createUsersSQL)) {
    die("Error creating users table: " . $conn->error);
}

$createMessagesSQL = "
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    room VARCHAR(255) NOT NULL DEFAULT 'Dev Circle',
    user_id INT NOT NULL
)";
if (!$conn->query($createMessagesSQL)) {
    die("Error creating messages table: " . $conn->error);
}

$createRoomsSQL = "
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
)";
if (!$conn->query($createRoomsSQL)) {
    die("Error creating rooms table: " . $conn->error);
}

$createUploadedFilesSQL = "
CREATE TABLE IF NOT EXISTS uploaded_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    originalname VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
)";
if (!$conn->query($createUploadedFilesSQL)) {
    die("Error creating uploaded_files table: " . $conn->error);
}

$createContactsSQL = "
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
if (!$conn->query($createContactsSQL)) {
    die("Error creating contacts table: " . $conn->error);
}

$checkUsernameColumn = $conn->query("SHOW COLUMNS FROM users LIKE 'username'");
if ($checkUsernameColumn && $checkUsernameColumn->num_rows === 0) {
    $conn->query("ALTER TABLE users ADD COLUMN username VARCHAR(64) NOT NULL DEFAULT 'defaultuser'");
}

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
?>
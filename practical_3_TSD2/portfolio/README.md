# Portfolio Flask Backend

This project adds a Flask backend for the portfolio contact form and stores messages in a MySQL database.

## Database Setup

1. Install MySQL if not already installed.
2. Open MySQL shell or MySQL Workbench.
3. Create the database:

```sql
CREATE DATABASE portfolio_db;
```

4. Switch to the database:

```sql
USE portfolio_db;
```

5. Create the contact table:

```sql
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Configure `.env`

Copy or update the `.env` file in the `portfolio` folder with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=portfolio_db
```

## Install Dependencies

From the `portfolio` folder, run:

```bash
python -m pip install -r requirements.txt
```

## Run the Flask Application

From the `portfolio` folder, run:

```bash
python app.py
```

The app runs by default on `http://127.0.0.1:5000/`.

## Open the Portfolio

Open a browser and go to:

```text
http://127.0.0.1:5000/
```

Then scroll to the Contact section and submit the form.

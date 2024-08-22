This is a FullStack NextJS project developed for a client as a part of my freelance work.

**IMPORTANT:** THE APP WILL NOT RUN PROPERLY WITHOUT .ENV VARIABLES AND PROBABLY THROW AN ERROR IF THEY ARE MISSING OR INCORRECT. BETTER REVIEW THE APP WITHIN GITHUB OR VSCODE.


# Project Setup

To get started with this project, follow these steps:

## 1. Configure Environment Variables

The app needs `.env` file in the root directory of the project with variables like:
- 0Auth2 refresh token
- Redirect URI
- Gmail Client ID (for Nodemailer)
- Client Secret
- Google Recaptcha Secret
- Recaptcha Site Key
- JWT Secret
- Reset Password Secret
- etc


## 2. Build the Project

Run the following command to create a production build:

```bash
npm run build
```

## 3. Initialize the first admin user in the database

```bash
cd dist
node initializeAdmin.js
```

## 4. Start the dev server
```bash
cd ..
npm run dev
```


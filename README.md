# Query PPP

## Installation Instructions

Before installing Query PPP, you need to ensure that Node.js is installed on your computer. Open a terminal or command prompt and type the following command to check if Node.js is installed:

```bash
node -v
```

If Node.js is not installed or you need to install it, please follow the installation instructions available at [Node.js Official Downloads](https://nodejs.org/en/download/).

Once Node.js is installed, you can proceed with setting up the Query PPP project. First, clone the repository:

```bash
git clone https://github.com/Cmoore0121/OCA.git
```

Navigate to the OCA directory:

```bash
cd OCA
```

Next, navigate to the `frontend` directory and install all necessary dependencies:

```bash
cd frontend
npm install
```

## How to Run the App

To run Query PPP, follow these steps:

1. Navigate to the project directory and then to the `frontend` folder:

```bash
cd path/to/OCA/frontend
```

2. Start the development server:

```bash
npm run dev
```

This will start the server and usually open a browser window with the application running, or you can manually visit the provided local URL in your browser.

## Enabling App Usage Anywhere

In the OCA folder, there is an executable file named `run_app.sh`. This script can be used to launch the application from anywhere on your system and will print the URL where the app can be accessed. To enable this functionality, you first need to grant execution permissions to the script. Open a terminal or command prompt and run the following command:

```bash
chmod +x /path/to/OCA/run_app.sh
```

Once the permissions are set, you can run this script from anywhere on your system to start the application and print the URL. Simply navigate to any directory where you want to run the script from and execute:

```bash
/path/to/OCA/run_app.sh
```

This command will start the application server and display the URL in your terminal.

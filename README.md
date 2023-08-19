# DB-firebase_Functions

# Firebase Functions for Decentralized Betting App

Welcome to the Firebase Functions repository for your Decentralized Betting App! This repository contains Firebase Functions responsible for processing and storing data from Moralis events into Firestore. The data stored here is later consumed by the Next.js frontend.

## Features

- **Data Processing**: Firebase Functions listen for Moralis events and process incoming data.

- **Firestore Integration**: Processed data is stored in Firestore for efficient retrieval.

- **Data Consumption**: The stored data is used by the Next.js frontend to provide users with the latest betting information.


## Usage
Moralis sends events to your Firebase Functions whenever relevant data changes.

Firebase Functions process and store this data in Firestore.

Your Next.js frontend can then fetch and display this data to users.

## Folder Structure
functions/: Contains the Firebase Functions for data processing and storage.

functions/index.js: The main entry point for your Firebase Functions.




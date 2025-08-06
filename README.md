# Cross-Platform Location App with Google Maps and MCP

This project is a cross-platform location-aware application using a Python backend, a React Native frontend, and the MCP Google Map server for handling Google Maps API interactions.

## Project Architecture

The architecture consists of three main components:

1.  **MCP Google Map Server**: A Node.js/TypeScript server that directly communicates with the Google Maps API. It exposes a set of tools for location-based services.
2.  **Python Backend**: A FastAPI server that acts as a bridge between the React Native app and the MCP server. It exposes a REST API for the frontend.
3.  **React Native App**: A mobile application for iOS and Android that provides the user interface for interacting with the location services.

## Getting Started

### 1. Run the MCP Google Map Server

To run the MCP server, you need to have Node.js and npm installed. You will also need a Google Maps API key.

```bash
npx @cablate/mcp-google-map --port 3000 --apikey "YOUR_GOOGLE_MAPS_API_KEY"
```

Replace `"YOUR_GOOGLE_MAPS_API_KEY"` with your actual Google Maps API key. The server will start on port 3000.

### 2. Run the Python Backend

The backend is a FastAPI application. To run it, navigate to the `backend` directory and install the dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Then, run the server:

```bash
uvicorn main:app --reload
```

The backend server will be available at `http://127.0.0.1:8000`.

### 3. Run the React Native App

(Instructions to be added once the frontend is scaffolded).

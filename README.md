# Weather

Simple weather app with jazzi, three-js and react (using react-three-fiber)

## Watch It Live!

You can see this page at https://weather.jkierem.com (hosted with firebase)

## Instalation

1. Clone the repo
2. Install dependencies (using either npm or yarn)
3. Run start command (using either npm or yarn)

## Dependencies

The project has a couple of notable dependencies:

- redux: for state management
- react-three/drei: for a built in sky
- react-spring: for animations
- react-router: for client side routing
- getclassname: minimal classname handler (made by me)
- redux-utility: to reduce redux boilerplate (made by me) 
- jazzi: to use algebraic structures (made by me) 
- Built using create-react-app with typescript

## Project Structure

The project was organized in the following folders:

- controls: react components that control an specific aspect of the scene. Only 2 at the moment: Light and Overlay
- core: logic folder. This is a folder for pieces of code relating to logic, utilities and data structures
- hooks: folder for hooks. 
- middleware: folder acting as the connection to the backend
- redux: this folder would contain all the different slices of redux state. Currently only one slice: weather
- scenes: this folder contains reusable react-three-fiber meshes. 
- views: They represent the routes the app has.
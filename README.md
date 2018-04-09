# Snowshoe Metrics Dashboard

This project includes both server and client, each of which have their own package.json. To get started:

- npm install concurrently (This is needed to "npm run setup" for the first time)
- npm run setup (This script will run npm install for both server and client)
- npm run dev (Start the Express server and Development mode for the UI
- if you get error about npm ERR! 404 Not Found: ux-react-styleguide@1.7.0, run npm config set registry https://npm.artifactory.homedepot.com/artifactory/api/npm/npm and run npm install again

#### To manually create an artifact and deploy
- Run "npm run setup" to install dependencies.
- From the client directory, run "npm run build" to build the project.
- "npm run setup"  to install dependencies.
- cd into client, run "npm run build" to build the client project.
- "cd .." back to the root directory.
- Run "tar cvf SnowshoeMetricsDashboard.tar ./bin ./client/build ./server ./server.js ./package.json ./client/package.json" to pack build files into a .tar file.

- mkdir SnowshoeMetricsDashboard && tar -xvf SnowshoeMetricsDashboard.tar -C SnowshoeMetricsDashboard/

- Dev: “cf push -f manifest-ad.yml -p SnowshoeMetricsDashboard/“

- Stage: “cf push -f manifest-qa.yml -p SnowshoeMetricsDashboard/“

-to deploy artifact for prod deployment, here is the location: https://maven.artifactory.homedepot.com/artifactory/webapp/#/artifacts/browse/tree/General/libs-release-local/libs-release-local/com/homedepot/discounts/snowshoe-metrics-dashboard/v1.0.2/snowshoe-metrics-dashboard-v1.0.2.tar


#### Helpful links
- React Docs
    - "Thinking in React" https://reactjs.org/docs/thinking-in-react.html
    - State and Lifecycle: https://reactjs.org/docs/state-and-lifecycle.html
    - Rendering an Element into the DOM https://reactjs.org/docs/rendering-elements.html
    - Lists and Keys https://reactjs.org/docs/lists-and-keys.html
    - Typechecking With PropTypes https://reactjs.org/docs/typechecking-with-proptypes.html
    - Forms: https://reactjs.org/docs/forms.html
    - Components and Props https://reactjs.org/docs/components-and-props.html
    - Conditional Rendering https://reactjs.org/docs/conditional-rendering.html
    -Location to deploy artifacts: https://maven.artifactory.homedepot.com/artifactory/webapp/#/artifacts/browse/tree/General/libs-release-local/libs-release-local/com/homedepot/discounts/snowshoe-metrics-dashboard/v1.0.2/snowshoe-metrics-dashboard-v1.0.2.tar

# Toy Problem Solution Viewer

This tool allows you to view all passing student solutions for toy problems side by side.

The goal was to replecate the soon-to-be deprecated makerpass challenge app.

## Installation

Install all dependencies in package.json.
```
npm i
```

In order for the app to work you must have mongoDB installed.

```
brew update
brew install mongodb
```

#### OR

Follow directions here https://www.mongodb.com/download-center/community


## Usage
1. Start the application
   
```
npm run start
```

2. In the app add a cohort prefix in the format: hrXXX## 
   
   * Examples: hratx40, HRNYC30, hrSF100
   * Capitilization does not matter

3. Update problems for a cohort

   * This will go through all the pull requests made to the hackreactor repo for that cohort and update the database with any passing solutions.

5. Go to the problems for a cohort.
6. Open the solutions for any particular problem with passing solutions.

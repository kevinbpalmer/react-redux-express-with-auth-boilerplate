# React, Redux, and Express with auth boilerplate
Two terminal windows are needed
In 1:
`cd react-redux-express-with-auth-boilerplate`  
`npm install`  
`npm start`  

In 2:
`cd react-redux-express-with-auth-boilerplate/client`  
`npm install`  
`npm start`

# About this repo
This repo uses React, Redux and React router in the `client` folder.
It utilizes create-react-app that has had its configuration overridden to allow for Ant Design theming to work and to allow for the use of .scss files within the project. You may use .sass or .scss files. If you create a .scss or .sass file then node sass chokidar will create .css version of the file in the same folder. Make sure to import the .css version of files within your components.

The root of the project utilizes express-generator with passport for authentication including a Facebook login. It also includes a component that utilizes Nexmo to allow for SMS verification tokens.

# Setting up this repo
You will need to create a .env file in the root of this project with the following Environment variables:
```
NODE_ENV=development
PORT=3001
MONGO_URI=<your-mongo-db-connection-string>
NEXMO_API_KEY=<nexmo-api-key>
NEXMO_SECRET_KEY=<nexmo-api-secret>
NEXMO_PHONE_NUMBER=<your-nexmo-number>
FACEBOOK_APP_ID=<your-facebook-app-id>
FACEBOOK_APP_SECRET=<your-facebook-app-secret>
FACEBOOK_CALLBACK_URL=http://localhost:3001/auth/facebook/callback
EMAIL_HOST=<your-smtp/pop-info i.e. smtp.gmail.com>
EMAIL_USER=<your-email-username i.e. test@test.com>
EMAIL_PASSWORD=<your-email-password i.e. pass123>
```

# Links to resources needed
[Nexmo (development numbers are free)](https://www.nexmo.com/)
[Facebook Developer](https://developers.facebook.com/)
[I recommend MLabs for easy development databases](https://mlab.com/)
[I recommend Mailgun for ease of use with nodemailer](https://www.mailgun.com/)

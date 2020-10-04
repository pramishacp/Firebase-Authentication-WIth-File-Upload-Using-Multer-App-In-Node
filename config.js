require('dotenv').config();

const env = process.env.NODE_ENV || 'dev'; 

const config = {

    dev: {
        app: {
            port: parseInt(process.env.DEV_APP_PORT) || 4212
        },
        db: {
            host: process.env.DEV_DB_HOST || 'localhost',
            port: parseInt(process.env.DEV_DB_PORT) || 27017,
            name: process.env.DEV_DB_NAME || 'dev'
        },
        directory: {
            static: process.env.DEV_DIRECTORY_STATIC || 'uploads',
            resume: process.env.DEV_DIRECTORY_RESUME || 'resumes'
        },
        firebase: {
            credential: {
                type: process.env.FIREBASE_CREDENTIAL_TYPE,
                project_id: process.env.FIREBASE_CREDENTIAL_PROJECT_ID,
                private_key_id: process.env.FIREBASE_CREDENTIAL_PRIVATE_KEY_ID,
                private_key: process.env.FIREBASE_CREDENTIAL_PRIVATE_KEY.replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CREDENTIAL_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CREDENTIAL_CLIENT_ID,
                auth_uri: process.env.FIREBASE_CREDENTIAL_AUTH_URI,
                token_uri: process.env.FIREBASE_CREDENTIAL_TOKEN_URI,
                auth_provider_x509_cert_url: process.env.FIREBASE_CREDENTIAL_AUTH_PROVIDER_X509_CERT_URL,
                client_x509_cert_url: process.env.FIREBASE_CREDENTIAL_CLIENT_X509_CERT_URL,
            },
            databaseURL: process.env.FIREBASE_DATABASE_URL
        },
    },

    test: {
        app: {
            port: parseInt(process.env.TEST_APP_PORT) || 4213,
        },
        db: {
            host: process.env.TEST_DB_HOST || 'localhost',
            port: parseInt(process.env.TEST_DB_PORT) || 27017,
            name: process.env.TEST_DB_NAME || 'test'
        },
        directory: {
            static: process.env.TEST_DIRECTORY_STATIC || 'uploads',
            resume: process.env.TEST_DIRECTORY_RESUME || 'resumes'
        }
    },

    staging: {
        app: {
            port: parseInt(process.env.STAGING_APP_PORT) || 4214,
        },
        db: {
            host: process.env.STAGING_DB_HOST || 'localhost',
            port: parseInt(process.env.STAGING_DB_PORT) || 27017,
            name: process.env.STAGING_DB_NAME || 'staging'
        },
        directory: {
            static: process.env.STAGING_DIRECTORY_STATIC || 'uploads',
            resume: process.env.STAGING_DIRECTORY_RESUME || 'resumes'
        }
    },

    prod: {
        app: {
            port: parseInt(process.env.PROD_APP_PORT) || 4215,
        },
        db: {
            host: process.env.PROD_DB_HOST || 'localhost',
            port: parseInt(process.env.PROD_DB_PORT) || 27017,
            name: process.env.PROD_DB_NAME || 'prod'
        },
        directory: {
            static: process.env.PROD_DIRECTORY_STATIC || 'uploads',
            resume: process.env.PROD_DIRECTORY_RESUME || 'staging'
        }
    }
}

module.exports = config[env];




pipeline {
    agent any

    stages {
        // stage('Checkout Source Code') {
        //     steps {
        //         script {
        //             // GitHub Personal Access Token (PAT) ile kimlik doğrulama
        //             withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
        //                 sh "git clone https://oauth2:${GITHUB_TOKEN}@github.com/GORKEMDEMIRKIRAN/Jeweller-api.git"
        //             }
        //         }
        //     }
        // }
        stage('Checkout Source Code') {
            steps {
                // Jenkins, Git SCM ayarlarındaki 'github-pat-scm' credential'ı kullanacak
                checkout scm
            }
        }
        // Docker imajını oluştur ve Docker Hub'a login ol
        stage('Docker Build & Push') {
            steps {
                script {
                    // Docker Hub kimlik bilgileri ile login ol
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        sh '''
                        # docker komutunun tam yolunu kullandık
                        echo $DOCKERHUB_PASS | /usr/bin/docker login -u $DOCKERHUB_USER --password-stdin
                        /usr/bin/docker build -t dmrkrn/borse-web-api:latest .
                        /usr/bin/docker push dmrkrn/borse-web-api:latest
                        '''
                    }
                }
            }
        }
        // Kubernetes Secret'ı güncelle
        stage('Update K8s Secret') {
            steps {
                withCredentials([file(credentialsId: 'borse-web-api-env', variable: 'ENV_FILE')]) {
                    sh '''
                    kubectl delete secret borse-web-api-env --ignore-not-found
                    kubectl create secret generic borse-web-api-env --from-env-file=$ENV_FILE
                    '''
                }
            }
        }
        // environment {
        //     PORT = credentials('port')
        //     PRODUCT_URL = credentials('product-url')
        //     JWT_SECRET = credentials('jwt-secret')
        //     DATABASE_URL = credentials('database-url')
        //     EMAIL_HOST = credentials('email-host')
        //     EMAIL_PORT = credentials('email-port')
        //     EMAIL_USER = credentials('email-user')
        //     EMAIL_PASS = credentials('email-pass')
        //     EMAIL_FROM = credentials('email-from')
        //     REDIS_HOST = credentials('redis-host')
        //     REDIS_PORT = credentials('redis-port')
        //     REDIS_PASSWORD = credentials('redis-password')
        //     TWILIO_ACCOUNT_SID = credentials('twilio-account-sid')
        //     TWILIO_AUTH_TOKEN = credentials('twilio-auth-token')
        //     TWILIO_PHONE_NUMBER = credentials('twilio-phone-number')
        // }        
        // stage('Create .env') {
        //     steps {
        //         writeFile file: '.env', text: """
        //         PORT=${PORT}
        //         PRODUCT_URL=${PRODUCT_URL}
        //         JWT_SECRET=${JWT_SECRET}
        //         DATABASE_URL=${DATABASE_URL}
        //         EMAIL_HOST=${EMAIL_HOST}
        //         EMAIL_PORT=${EMAIL_PORT}
        //         EMAIL_USER=${EMAIL_USER}
        //         EMAIL_PASS=${EMAIL_PASS}
        //         EMAIL_FROM=${EMAIL_FROM}
        //         REDIS_HOST=${REDIS_HOST}
        //         REDIS_PORT=${REDIS_PORT}
        //         REDIS_PASSWORD=${REDIS_PASSWORD}
        //         TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
        //         TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
        //         TWILIO_PHONE_NUMBER=${TWILIO_PHONE_NUMBER}
        //         """
        //     }
        // }        
        // // Update K8s Secret
        // stage('K8s Secret Update'){
        //     // Secret varsa sil, sonra yeniden oluştur (idempotent)
        //     sh 'kubectl delete secret borse-web-api-env --ignore-not-found'
        //     sh 'kubectl create secret generic borse-web-api-env --from-env-file=.env'
        // }


        // Deploy to Kubernetes
        // Uygulamayı Kubernetes'e deploy et
        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f kubernetes.yaml'
            }
        }
    }
}
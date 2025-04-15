pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        PROJECT_ID = "terraform-449405"
        GKE_ZONE = "asia-south1-a"
        DOCKER_IMAGE = "gcr.io/${PROJECT_ID}/nams-app:${env.BUILD_NUMBER}"
        CLUSTER_NAME = "ci-demo-cluster"
        GIT_CREDENTIALS_ID = "github-token"
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: "${GIT_CREDENTIALS_ID}", url: 'https://github.com/NamrataRat/prot-cicd-demo.git', branch: 'main'
            }
        }

        stage('Check Docker Access') {
            steps {
                sh 'whoami && which docker && docker --version'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                    gcloud auth configure-docker --quiet
                    docker push ${DOCKER_IMAGE}
                '''
            }
        }

        stage('Update Deployment YAML') {
            steps {
                script {
                    sh '''
                    sed -i "s|image: .*|image: ${DOCKER_IMAGE}|" k8s/deployment.yaml
                    '''
                }
            }
        }

        stage('Commit and Push Updated YAML') {
            steps {
                sh '''
                git config user.name "ci-bot"
                git config user.email "ci@example.com"
                git add k8s/deployment.yaml
                git commit -m "Update deployment image to ${DOCKER_IMAGE}"
                git push origin main
                '''
            }
        }
    }
}

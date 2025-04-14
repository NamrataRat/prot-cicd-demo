pipeline {
    agent any

    environment {
        PROJECT_ID = "terraform-449405"
        CLUSTER_NAME = "ci-demo-cluster"
        GKE_ZONE = "asia-south1-a"
        DOCKER_IMAGE = "gcr.io/${PROJECT_ID}/nams-app:${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/NamrataRat/prot-cicd-demo.git'
            }
        }

        stage('Auth to GCP') {
            steps {
                withCredentials([file(credentialsId: 'gcp-service-account-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh '''
                    gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                    gcloud config set project $PROJECT_ID
                    gcloud config set compute/zone $GKE_ZONE
                    '''
                }
            }
        }

        stage('Create GKE Cluster (if not exists)') {
            steps {
                script {
                    sh '''
                    if ! gcloud container clusters describe $CLUSTER_NAME > /dev/null 2>&1; then
                        echo "Creating GKE cluster..."
                        gcloud container clusters create $CLUSTER_NAME \
                          --num-nodes=2 \
                          --enable-ip-alias \
                          --quiet
                    else
                        echo "GKE cluster already exists."
                    fi
                    '''
                }
            }
        }

        stage('Get GKE Credentials') {
            steps {
                sh '''
                gcloud container clusters get-credentials $CLUSTER_NAME
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $DOCKER_IMAGE .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                gcloud auth configure-docker --quiet
                docker push $DOCKER_IMAGE
                '''
            }
        }

        stage('Deploy to GKE') {
            steps {
                sh '''
                sed -i "s|<your-docker-registry>/nams-app:latest|$DOCKER_IMAGE|" k8s/deployment.yaml
                kubectl apply -f k8s/deployment.yaml
                kubectl apply -f k8s/service.yaml
                '''
            }
        }
    }
}

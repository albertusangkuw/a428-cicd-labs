pipeline{
    agent { 
        docker {
            image 'node:lts-buster-slim' 
            args '-p 3000:3000'
        }
    }
    stages{
        stage('Pre-Build') { 
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh './jenkins/scripts/test.sh'
            }
        }
        stage('Deliver') {
            steps {
                sh './jenkins/scripts/deliver.sh'
                input message: 'Finished using the website? (Click "Proceed" to continue and to build)'
                sh './jenkins/scripts/kill.sh'
            }
        }
        // stage('Build') { 
        //     steps {
        //         sh 'npm audit fix --force'
        //         sh 'npm run build'
        //     }
        // }
    }

}
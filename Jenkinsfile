// Submission Dicoding - Proyek Membangun CI/CD Pipeline dengan Jenkins
// Albertus Septian Angkuw 
pipeline {
    agent {
        docker {
            image 'node:16-buster-slim'
            args '-p 3000:3000'
        }
    }
    stages {
        // Trigger by ngrok (webhook proxy)
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') { 
            steps {
                sh './jenkins/scripts/test.sh' 
            }
        }

        stage('Deliver'){
            steps{
                script{
                    String pidNPM
                    pidNPM = sh(script: 'npm start > log-server.txt 2>&1 & echo "$!"', returnStdout: true)
                    println "PID Server: $pidNPM"
                    sleep time: 1, unit: 'MINUTES'
                    //Clean Up
                    sh "kill $pidNPM"
                    cat log-server.txt
                }
            }
        }
        stage('Deploy'){
            steps{
                input message: 'Lanjutkan ke tahap Deploy? (Click "Proceed" to continue)'
                
                def now = new Date()
                def uniqueTag = now.format("yyMMdd.HHmm", TimeZone.getTimeZone('UTC'))
                
                withCredentials([usernamePassword(credentialsId: '2cbdfc4d-006c-4cfe-878c-50ac51fd5ae5', passwordVariable: 'DOCKER_HUB_PASSWORD', usernameVariable: 'DOCKER_HUB_USERNAME')]) {
                    // Login Docker
                    sh 'docker login -u="${DOCKER_HUB_USERNAME}" -p="${DOCKER_HUB_PASSWORD}"'
                    // Build Image
                    sh "docker build -t albertushub/react-app:$uniqueTag ."
                    // Push Image ke Docker Hub
                    sh "docker push albertushub/react-app:$uniqueTag"
                    // Logout Docker
                    sh "docker logout"
                }
                // Menggunakan SSH untuk trigger docker pull
                // sshagent(['29846a1c-7648-4212-a7a8-29e1abb7e741']) {
                //     // some block
                // }
            }
        }
    }
}
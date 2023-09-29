// Submission Dicoding - Proyek Membangun CI/CD Pipeline dengan Jenkins
// Albertus Septian Angkuw 
pipeline {
    agent any
    stages {
        // Trigger by ngrok (webhook proxy)
        stage("Prepare"){
            agent {
                docker {
                    image 'node:16-buster-slim'
                    args '-p 3000:3000'
                }
            }
            stages{
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
                            sh "cat log-server.txt"
                        }
                    }
                }
            }
        }
        stage('Deploy'){
            steps{
                input message: 'Lanjutkan ke tahap Deploy? (Click "Proceed" to continue)'
                script{
                    def now = new Date()
                    def uniqueTag = now.format("yyMMdd.HHmm", TimeZone.getTimeZone('UTC'))
                    
                    println "Akan membuat image dengan nama: albertushub/react-app:$uniqueTag"
                    sh "cp Dockerfile.deploy Dockerfile"
                    withCredentials([usernamePassword(credentialsId: '6abe9262-12bf-4500-8b64-bf7181fd687b', passwordVariable: 'DOCKER_HUB_PASSWORD', usernameVariable: 'DOCKER_HUB_USERNAME')]) {
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
}
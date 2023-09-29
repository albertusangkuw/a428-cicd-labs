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

                    def remote = [:]
                    // Label Remote Host
                    remote.name = "ec2-aws"
                    // IP Host
                    remote.host = "3.0.182.170"
                    remote.allowAnyHosts = true
                    // Menggunakan SSH Pipeline Steps Plugins untuk trigger docker pull pada remote server
                    withCredentials([sshUserPrivateKey(credentialsId: 'a85c8863-8a79-4370-8d84-3812897c24ea', keyFileVariable: 'identity', passphraseVariable: '', usernameVariable: 'user')]) {
                        remote.user = user
                        remote.identityFile = identity
                        stage("Remote") {
                            // sshCommand remote: remote, command: 'echo "Hello from Jenkins" > hello.txt'
                            // Pull Container yang baru dibuild dengan tag yang sudah dibuat
                            sshCommand remote: remote, command: "docker pull albertushub/react-app:$uniqueTag"
                            // Hentikan container app yang sudah berjalan
                            sshCommand remote: remote, command: 'docker stop react-app'
                            // Hapus container app yang lawas
                            sshCommand remote: remote, command: 'docker rm react-app'
                            // Run Container yang baru
                            sshCommand remote: remote, command: "docker run --name=react-app -p 80:80 -d  albertushub/react-app:$uniqueTag"
                            
                        }
                    }
                    println("Selesai 🔥🚀 !-------")
                }
            }
        }
    }
}
pipeline {
    agent any

    environment {
        PROJECT_NAME = 'tiinpod'
        // Cấu hình các biến đường dẫn hoặc credential tại đây
        // DEV_SERVER = credentials('dev-server-ssh')
        // PROD_SERVER = credentials('prod-server-ssh')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Bắt đầu build trên nhánh: ${env.BRANCH_NAME}"
            }
        }

        stage('Build & Test - Client') {
            steps {
                echo "1. Cài đặt thư viện Nodejs và Build Vite..."
                sh 'make client-install'
                // sh 'make client-lint' // (mở comment khi cần check code style)
                sh 'make client-build'
            }
        }

        stage('Build & Test - Server') {
            steps {
                echo "2. Tải package Go và Build Binary..."
                sh 'make server-tidy'
                // sh 'make server-lint' // (cần cài đặt golangci-lint trên CI)
                sh 'make server-build'
            }
        }

        stage('Deploy to DEV') {
            when {
                // Chỉ chạy bước này nếu commit vào nhánh 'develop' (hoặc 'dev')
                anyOf {
                    branch 'develop'
                    branch 'dev'
                }
            }
            steps {
                echo "🚀 Đang triển khai lên môi trường DEV..."
                // Thực hiện copy/rsync lên server Dev, chạy SSH login, hoặc kích hoạt deploy qua docker
                // sh '''
                //    ssh user@$DEV_SERVER "cd /path/to/project && git pull && make dev"
                // '''
                sh 'echo "Done Deploying to DEV!"'
            }
        }

        stage('Deploy to PROD') {
            when {
                // Chỉ chạy bước này nếu merge hoặc commit vào nhánh 'main' (hoặc 'master')
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                // Thường Production có thêm config input() để confirm lại bằng tay trước khi deploy
                // input message: 'Deploy lên Production?', submitter: 'admin'
                echo "🔥 Đang triển khai lên môi trường PRODUCTION..."
                
                // Thực thi script cho prod
                // sh '''
                //    ssh user@$PROD_SERVER "cd /var/www/tiinpod && docker-compose up -d"
                // '''
                sh 'echo "Done Deploying to PROD!"'
            }
        }
    }

    post {
        always {
            echo "CI/CD Pipeline hoàn tất."
        }
        success {
            echo "✅ Toàn bộ Test và Deploy thành công!"
            // Có thể thêm tính năng gửi tin nhắn Slack/Telegram/Discord tại đây
        }
        failure {
            echo "❌ Quá trình thất bại! Vui lòng kiểm tra lại Log trên Jenkins."
        }
    }
}

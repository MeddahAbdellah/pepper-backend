# config CodeDeploy: https://dev.to/ankushbehera/a-complete-guide-to-deploy-github-project-on-amazon-ec2-using-github-actions-and-aws-codedeploy-3f0b
# config nginx https://www.scaleway.com/en/docs/tutorials/nginx-reverse-proxy/#:~:text=A%20Nginx%20HTTPS%20reverse%20proxy,response%20back%20to%20the%20client.

sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt-cache policy docker-ce
sudo apt install docker-ce -y
sudo groupadd docker
sudo usermod -aG docker ubuntu
sudo systemctl start docker
sudo systemctl enable docker
sudo apt install docker-compose -y

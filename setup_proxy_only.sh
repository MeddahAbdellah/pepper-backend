# config nginx https://www.scaleway.com/en/docs/tutorials/nginx-reverse-proxy/#:~:text=A%20Nginx%20HTTPS%20reverse%20proxy,response%20back%20to%20the%20client.

sudo apt update
sudo apt install nginx
sudo cp reverse-proxy.conf /etc/nginx/nginx.conf
sudo nginx -t
sudo nginx -s reload

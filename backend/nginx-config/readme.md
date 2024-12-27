Here’s a step-by-step guide to setting up **Nginx** on an **AWS EC2 Ubuntu machine** and securing it with **Certbot** for SSL certificates.

---

### **Step 1: Update the System**
1. Connect to your EC2 instance via SSH:
   ```bash
   ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
   ```
2. Update and upgrade the system packages:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

### **Step 2: Install Nginx**
1. Install Nginx:
   ```bash
   sudo apt install nginx -y
   ```
2. Enable and start the Nginx service:
   ```bash
   sudo systemctl enable nginx
   sudo systemctl start nginx
   ```
3. Check if Nginx is running:
   ```bash
   sudo systemctl status nginx
   ```
---

### **Step 3: Configure Your Domain**
1. Ensure your domain’s **A record** points to the EC2 instance's **public IP** in your DNS settings.
2. Verify the domain is resolving to your EC2 instance:
   ```bash
   curl -I http://your-domain.com
   ```

---

### **Step 4: Install Certbot**
1. Add Certbot’s PPA repository and install it:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```
2. Verify the installation:
   ```bash
   certbot --version
   ```

---

### **Step 5: Configure Nginx for Your Domain**
1. Create an Nginx server block for your domain:
   ```bash
   sudo nano /etc/nginx/sites-available/your-domain.com
   ```
   Add the following content:
   ```nginx
   # your nginx configuration for your-domain.com
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       root /var/www/your-domain.com;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```
2. Create the root directory for your website:
   ```bash
   sudo mkdir -p /var/www/your-domain.com
   sudo chown -R $USER:$USER /var/www/your-domain.com
   ```
3. Add a sample `index.html` file:
   ```bash
   echo "<h1>Welcome to your-domain.com</h1>" > /var/www/your-domain.com/index.html
   ```
4. Enable the server block and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

### **Step 6: Obtain SSL Certificates**
1. Run Certbot to automatically obtain and configure SSL for your domain:
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```
2. Certbot will prompt for email and terms of service agreement. Follow the instructions.
3. Verify the SSL setup by visiting `https://your-domain.com`.

---

### **Step 7: Automate Certificate Renewal**
1. Certbot automatically installs a cron job for renewal. Verify it:
   ```bash
   sudo systemctl list-timers
   ```
2. Test the renewal process:
   ```bash
   sudo certbot renew --dry-run
   ```

---

### **Step 8: (Optional) Redirect HTTP to HTTPS**
1. Update your Nginx configuration to redirect all HTTP traffic to HTTPS:
   ```bash
   sudo nano /etc/nginx/sites-available/your-domain.com
   ```
   Modify it as follows:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name your-domain.com www.your-domain.com;

       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

       root /var/www/your-domain.com;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```
2. Reload Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

### **Final Step: Verify Your Setup**
- Visit your domain in a browser (`https://your-domain.com`).
- Use [SSL Labs](https://www.ssllabs.com/ssltest/) to test your SSL setup.

You're all set! Let me know if you face any issues.
# ssh-test

## How to run

Example script:

* `HOST='x.x.x.x' PRIVATE_KEY_PATH='/home/your-username/.ssh/id_rsa' USER_NAME=root node ssh.js`

Local port forwarding

* `HOST='x.x.x.x' PRIVATE_KEY_PATH='/home/your-username/.ssh/id_rsa' USER_NAME=root node ssh.js -L 5000:x.x.x.x:80`
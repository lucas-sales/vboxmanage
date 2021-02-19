const uuidv4 = require('uuid/v4');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = app => {
    const customerWalletsDB = app.data.customerWallets;
    const controller = {};
    var parent = '';
    var change_ip = '';
  
    controller.listCustomerWallets = (req, res) => res.status(200).json(customerWalletsDB);

    controller.createMachine = (req, res) => {
      const data = {
        id: uuidv4(),
        parentId: uuidv4(),
        system: req.body.system,
        name: req.body.name,
        ip: req.body.ip,
        memory: req.body.memory,
        cpu: req.body.cpu,
      }

      if (data.system == 'windows') {
        parent = 'windows_parent_assad';
        change_ip = `VBoxManage guestcontrol ${data.name} run --exe "C:\\windows\\system32\\cmd.exe" --username teste --passwordfile senha.txt -- cmd.exe/arg0 /C powershell "Start-Process -Verb RunAs cmd.exe '/c netsh interface ip set address name="Ethernet" static ${data.ip} 255.255.255.0 192.168.1.1'"`;

      }else{
        parent = 'linux_assad';
        change_ip = `VBoxManage guestcontrol ${data.name} run --exe "/sbin/ifconfig" --username lucaslima --passwordfile senha.txt --wait-stderr --wait-stdout -- ifconfig enp0s3 ${data.ip} netmask 255.255.255.0 --verbose`;
      }

      async function commands() {
        
        const { stdout, stderr } = await exec(`VBoxManage clonevm ${parent} --name="${data.name}" --register`);
        if (stderr){
          const { stdout2, stderr2 } = await exec(`VBoxManage modifyvm "${data.name}" --memory "${data.memory}" --cpus "${data.cpu}`);
          const { stdout3, stderr3 } = await exec(`VBoxManage startvm "${data.name}" --type gui`);
          await sleep(60000);
          const {stdoutFinal, stderrFinal} = await exec(change_ip);
            console.log(stderr3);
        } else {
          console.log('deu merda');
        }

      }

      commands();
    
      res.status(201);
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    return controller;
  }
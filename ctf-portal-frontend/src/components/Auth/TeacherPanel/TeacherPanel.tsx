import React from "react";
import { Button } from "react-bootstrap";
import { startWorkshop } from "./TeacherPanelAPI";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

class TeacherPanel extends React.Component {
  private markdown = `# Walkthrough

  **Step 0: Tooling that may be useful:**[
  
  [**https://www.base64decode.org/**](https://www.base64decode.org/) 
  
  **Step 1: Share credentials with students**
  
  You share the following IP-address and login credentials for the students:
  
  - Openvpn file
  
  - CTF portal - 172.16.1.27
  
  - Wazuh (SIEM environment) - 172.16.1.13
    - Username: wazuh
    - Password: xBTM0xG4tCvC-SrkFC2Yert016VHr7dQ
  
  - TheHive
    - Username: user@rvb.nl
    - Password: 88%M!cjOqJ5%cx
  
  - Vulnerable machines:
  
    - Username: admin
  
    - Password: password
    - 
  
  **Step 2: Start game**
  
  A teacher can start the game when all of the students are ready to go.
  
  **Step 3: Reset game**
  
  When the game is finished the teacher can reset the game on the teacher portal.
  
  **Extra step: Flag storyline help**
  
  This step shows what needs to be done for each step. This is only for information when student(s) do not find their way and need some assistants.
  The following steps need to be done in order from 1 to 6:
  
  
  
  **1: Info systemen**
  
  Flag 1: SQL Injection flag = RDMkTx4ijxHZ0h8
  
  Description: On the Wazuh dashboard, under Security Events, an alert appears: Suricata: Alert - Possible SQL Injection AttackFlag partial: RDMk
  
  http://172.16.1.26:9000/index.html#!/login
  
  Description: In Hive(SIEM), there's a case called SQL Information Leak - open the case and read the description Case # 3 - SQL Information Leak
  
  Flag partial: Tx4i
  
  Description: In Hive(SIEM), open the tasks attached to the previous case and expand Execute command found in data.http.url	
  
  Flag partial: jxHZ
  
  Description: Open the page that was found in the alert; executing the command used is optional
  
  Flag partial: 0h8
  
  Flag: {RDMkTx4ijxHZ0h8} 
  
  
  
  
  
  **2: Train entrance system**
  
  Flag 2: XSS flag = {0prbW5Whfp9wTOx}
  
  Description: On the Wazuh dashboard, under Security Events, an alert appears: Suricata: High Alert - XSS attack detected on Train entrance system(s)
  
  Flag partial: 0pr
  
  http://172.16.1.26:9000/index.html#!/login
  
  Description: In Hive(SIEM), there's a case called XSS attack detection - open the case and read the description Case # 4 - XSS Attack IRFlag partial: bW5
  
  http://172.16.1.26:9000/index.html#!/
  
  Description: In Hive(SIEM), open the tasks attached to the previous case and expand Visit the page in which an XSS attack was detected and review if its contents has been defaced;
  
  Flag partial: Whf
  
  http://172.16.1.26:9000/index.html#!/
  
  Description: Open the URL that raised the XSS alertIf the page has been defaced contact the customer using the template below
  
  Flag partial: p9w
  
  Description: In Hive(SIEM), open the last task described as customer contact, in the template there's the last flagFlag partial: TOx
  
  Flag: {0prbW5Whfp9wTOx}
  
  
  
  
  
  **3: Communication System Attack**
  
  Flag 3: CSRF flag = {Er4XCumRFhVEC0t}
  
  Description: On the Wazuh dashboard, under Security Events, an alert appears: Suricata: Alert - CRITICAL: Detected CSRF on Train entrance systems
  
  Flag partial: Er4
  
  http://172.16.1.26:9000/index.html#!/login
  
  Description: In Hive(SIEM), there's a case called CSRF detection - open the case and read the description Case # 4 - CSRF Attack IR
  
  Flag partial: XCu
  
  Description: In Hive(SIEM), open the tasks attached to the previous case and expand Do NOT open the url found in the alert!Flag 
  
  partial: mRF
  
  Description: In Hive(SIEM), open the task about incident response;Either curl the page to see its contents and reset the admin password
  
  Flag partial: hVE
  
  Description: In Hive(SIEM), open the last task described as customer contact, in the template there's the last flag
  
  Flag partial: C0t
  
  Flag: {Er4XCumRFhVEC0t} 
  
  
  
  
  
  **4: Railway crossing Attack**
  
  Flag 4: Weak Session Id flag = {Fm1AyI1Y9QSH9yP}
  Description: On the Wazuh dashboard, under Security Events, an alert appears: Suricata: Alert - CRITICAL: Unauthorized Access Railway Crossing systems
  
  Flag partial: Fm1A
  
  http://172.16.1.15:5004/vulnerabilities/weak_id/
  
  Description: On the docker dvwa on port 5400 the second partial can be found. 
  
  Flag partial: yI1Y9
  
  http://172.16.1.26:9000/index.html#!/login
  
  Description: In Hive(SIEM), open the tasks attached to the previous case. Here can te flag be found.
  
  Flag partial: QSH9yP
  
  
  
  **5: Speedup/jam attack**
  
  Flag 5: Javascript flag = {U25cs71YWJrFagL}
  
  Description: On the Wazuh dashboard, under Security Events, an alert appears: Suricata: Alert - VERY CRITICAL: Malicious code injection detected on Train system #5344
  
  Flag partial: U25
  http://172.16.1.26:9000/index.html#!/login
  
  Description: In Hive(SIEM), there's a case called Malicious Code Injection detection Case # 7 - Malicious Code Injection into Trainsystems
  
  Flag partial: cs7
  
  Description: In Hive(SIEM), open the tasks attached to the previous case and expand Open the page and review if any malicious code has been injected 
  
  Flag partial: 1YW
  
  Description: On the page the last Flag partial is found: JrFagL
  
  Flag: {U25cs71YWJrFagL}
  
  
  
  **6: Command injection attack**
  
  Flag 6: Command injection flag = {RuRXA4i6dmJ4uwX}
  
  Description: On the Wazuh dashboard, under Security Events, an alert appears: Suricata: Alert - EXTREMELY CRITICAL: Command Injection! Train #5344 is set to collide with Train #5566
  
  Flag partial: U25
  
  http://172.16.1.26:9000/index.html#!/login
  
  Description: In Hive(SIEM), there's a case called Malicious Code Injection detection Case # 9 - Train Command Injection
  
  Flag partial: cs7
  
  Description: In Hive(SIEM), open the tasks attached to the previous case and expand Shut down the train c&c system 
  
  Flag partial: 1YW
  
  Description: On the Wazuh Dashboard, in the alert an encrypted base64/rot13 string is found, decrypting this leads 
  
  Flag partial: JrF
  
  Description: Report the incident to the customer using the template found in TheHive
  
  Flag partial: agL
  
  Flag: {U25cs71YWJrFagL}`;

  render() {
    return (
      <div className="flex flex-col gap-4 h-screen w-screen items-center justify-start pt-8 overflow-x-hidden">
        <h1 className="text-4xl">Welcome Teacher!</h1>
        <p>Before you start the workshop, read the instructions below.</p>
        <Button onClick={() => startWorkshop()}>Start workshop</Button>
        <ReactMarkdown
          className="bg-gray-200 p-4"
          children={this.markdown}
          remarkPlugins={[remarkGfm]}
        />
      </div>
    );
  }
}
export default TeacherPanel;

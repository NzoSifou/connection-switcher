<h1 align="center">Connection Switcher</h1>
<strong>📡 🔌 This software allows you to select a network adapter to enable or disable it easier and faster than going through Windows settings. 🔀 📶</strong>

## Information
### Story
I created this software because I often use an Ethernet cable and my phone's connection sharing, but I have to unplug the Ethernet cable or go and deactivate it in the Windows settings to be able to use Wi-Fi connection sharing of my phone because of Windows which only offers to be able to deactivate Wi-Fi but not Ethernet.

### To-Do list
- [x] Save the last adapter used (and select it by default when starting the app)
- [ ] Get the state of the adapter (enabled or disabled)
    * [ ] Make a "switch" button to replace the "Enable Adapter" and "Disable Adapter" buttons
    * [ ] Use radio buttons in tray context menu instead of classic "Enable" / "Disable" buttons
- [ ] Design the app
- [ ] Make a language file
    * [ ] Make a French translation
    * [ ] Detect the default Windows language and use it if available otherwise use English

### About the design
If you are a contributing graphic designer and have some idea for the design of the app,    
Contact me on <a href="https://dsc.bio/nzosifou/">Discord</a> or by <a href="mail:nzosifou@gmail.com">E-mail</a>    
Don't contact me if you are a commercial or if you offer paid services this is an open source project I don't pay for services.


## Build
### Editing and testing
Import <a href="https://github.com/NzoSifou/connection-switcher.git">this repository</a> into your favorite editor  
Make your code changes for testing or for the purpose of creating a pull request  
If you want to test your changes (development mode), execute `npm test`.

### Building
If you want to build a custom Connection Switcher app, you have to change the version in `package.json`  
Then you have to execute `npm run make` to build the .exe setup.  

You can finally find your custom build (named `connection-switcher-x.x.x Setup.exe` (where x.x.x is the version) by default) into the `/out/make/.../` folder.

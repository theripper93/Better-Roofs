# Better-Roofs

## **A module to improve roofs for foundry 0.8.x**
![Latest Release Download Count](https://img.shields.io/github/downloads/theripper93/Better-Roofs/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fbetterroofs&colorB=03ff1c&style=for-the-badge)](https://forge-vtt.com/bazaar#package=betterroofs) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Ftheripper93%2FBetter-Roofs%2Fmain%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge) [![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/theripper93) [![alt-text](https://img.shields.io/badge/-Discord-%235662f6?style=for-the-badge)](https://discord.gg/F53gBjR97G)

Other Language: [English](README.md), [Deutsch](README.de.md)

## **ATTENTION: Wall off the edges of your map for the masking to work!**
## **Remember to use an overehead tile with Fade/None occlusion mode for best results - a tile in "Roof" occlusion mode will produce unwanted results!**

## [Video Tuorial by Baileywiki](https://youtu.be/ELlweNunn4g)

*The module is free but if you are selling maps that use my modules you'll need a commercial licence wich is available on my patreon

**Better Roofs Modes**:

* **Show:** only show the tile through the fog when the token is in range

* **Hide:** When a token has vision inside the roof the whole roof is hidden (uses the occlusion alpha for transparency)

* **Mask:** The fancy mode, masks what you can see from the roof tile

**Occlusion Link**

With Occlusion Link you can link the occlusion state of tiles:
A tile marked as Occlusion Link Source will set all the tiles with matching Occlusion Link Id to its occluded state!

**Weather Blocker Integration**

If you have Weather Blocker installed, you can enable the "Weather Blocker Integration" in the Better Roofs settings to hide weather inside buildings

**Room Preview**

You can enable the building preview in the settings to show you what the building detection has deemed to be a building when you open a tile's config 

**Tolerance**

The option has been depreciated in favor of the new room detection system

**Limitations\Wall off:**

Masking now works even without sight but remember to wall of the edges of your map or it won't work.
You can wall off the edges of your map automatically with this button in the wall controls

![alt text](https://github.com/theripper93/Better-Roofs/raw/main/brbutton.jpg)

**Fallback Mode**

The option has been depreciated in favor of the new room detection system

**Bulk Utility**

You can change settings for multiple Better Roofs with a console utility. Just run _betterRoofsHelpers.bulkBUpdate() in the console

![alt text](https://github.com/theripper93/Better-Roofs/raw/main/brmenu.png)

![alt text](https://github.com/theripper93/Better-Roofs/raw/main/betterroofs.jpg)

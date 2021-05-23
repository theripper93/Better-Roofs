# Better-Roofs

## **A module to improve roofs for foundry 0.8.x**
![Latest Release Download Count](https://img.shields.io/github/downloads/theripper93/Better-Roofs/latest/module.zip?color=5ff57d&label=DOWNLOADS&style=for-the-badge) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fbetterroofs&colorB=4aa94a)](https://forge-vtt.com/bazaar#package=betterroofs) [![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d)](https://www.patreon.com/theripper93)

**Better Roofs Modes**:

* **Show:** only show the tile through the fog when the token is in range

* **Hide:** When a token has vision inside the roof the whole roof is hidden (uses the occlusion alpha for transparency)

* **Mask:** The fancy mode, masks what you can see from the roof tile

**Limitations:** Due to performance concerns all the calculations and masking are done accordingly to the vision range of the token, so a token with no vision or no bright or dim vision will not see this effect even if unrestricted vision range is active

Remember to use an overehead tile with Fade mode for best results

![alt text](https://github.com/theripper93/Better-Roofs/raw/main/brmenu.png)

![alt text](https://github.com/theripper93/Better-Roofs/raw/main/betterroofs.jpg)

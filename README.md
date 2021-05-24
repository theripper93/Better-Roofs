# Better-Roofs

## **A module to improve roofs for foundry 0.8.x**
![Latest Release Download Count](https://img.shields.io/github/downloads/theripper93/Better-Roofs/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fbetterroofs&colorB=03ff1c&style=for-the-badge)](https://forge-vtt.com/bazaar#package=betterroofs) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Ftheripper93%2FBetter-Roofs%2Fmain%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge) [![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/theripper93)

**Better Roofs Modes**:

* **Show:** only show the tile through the fog when the token is in range

* **Hide:** When a token has vision inside the roof the whole roof is hidden (uses the occlusion alpha for transparency)

* **Mask:** The fancy mode, masks what you can see from the roof tile

**Tolerance**

This options lets you offset when the Hide and Show mode trigger, a higher value will require a token to be closer to a roof before triggering, lower values will make them activate when tokens are further away. Warning: negaive values will make the Hide mode not work correctly

**Limitations:**

Due to performance concerns all the calculations and masking are done accordingly to the vision range of the token, so a token with no vision or no bright or dim vision will not see this effect even if unrestricted vision range is active

**Fallback Mode**

To go around the limitations, when a token has no dim\bright sight the module will fall back to a different implementation on hide mode when mask\hide is selected
You can also foce the Fallback Mode per player in the module settings

Remember to use an overehead tile with Fade mode for best results

![alt text](https://github.com/theripper93/Better-Roofs/raw/main/brmenu.png)

![alt text](https://github.com/theripper93/Better-Roofs/raw/main/betterroofs.jpg)

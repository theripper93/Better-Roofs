# Better-Roofs

## H2**A module to improve roofs for foundry 0.8.x**

As always you can support me here: [Patreon](https://www.patreon.com/theripper93)

And install the module throught the manifest url here: [Manifest](https://raw.githubusercontent.com/theripper93/Better-Roofs/main/betterRoofs/module.json)

**Better Roofs Modes**:

* **Show:** only show the tile through the fog when the token is in range

* **Hide:** When a token has vision inside the roof the whole roof is hidden (uses the occlusion alpha for transparency)

* **Mask:** The fancy mode, masks what you can see from the roof tile

**Limitations:** Due to performance concerns all the calculations and masking are done accordingly to the vision range of the token, so a token with no vision or no bright or dim vision will not see this effect even if unrestricted vision range is active

Remember to use an overehead tile with Fade mode for best results

![alt text](https://github.com/theripper93/Better-Roofs/raw/main/brmenu.png)

![alt text](https://github.com/theripper93/Better-Roofs/raw/main/betterroofs.jpg)

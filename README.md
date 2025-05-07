# txAdmin-playerGen

This project is a development tool for [txAdmin](https://github.com/tabarra/txAdmin) that sends fake `playerJoining` and `playerDropped` events to txAdmin for the purposes of populating the web player list in a realistic manner.  
  
> [!IMPORTANT]
> **This project _does not_ create "fake players" for the FiveM server list**, nor to the in-game player list.  
> It _exclusively_ mocks a playerlist inside the txAdmin Web Panel.  
> This is a development utility and nothing more.

![screenshot](docs_screenshot.png)
  
## Dev Notes
- To simulate the players, I did statistical analysis on all servers for the ideal size (max, median, quantile, etc) of player identifiers, name and HWIDs. As far as I can tell, HWIDs change with time. The ideal name length was dropped in favor of looking real and safe.
- To simulate realistic join/leave behavior, I used the exponential random PRNG (which looks like radioactive decay), which _lambda_ can be adjusted through a slider, as well as the join/leave bias.
- There is no error handling for failed API calls, but that doesn't really matter in this use case.
- Due to the item above, if the speed is at the max it is expected some small desync issues with txAdmin.
- I used this opportunity to test [DaisyUI](https://daisyui.com/), so the theme of course doesn't match txAdmin.

## Future Work (TODO)
As needed during the txAdmin development, the changes below might be welcomed:
- Option to add/remove arbitrary players with arbitrary data.
- Option to actually Sync the txAdmin playerlist instead of just pushing events to it.

## License and Credits
- This project is licensed under the [MIT License](https://github.com/tabarra/txAdmin-playerGen/blob/master/LICENSE);
- The [beep sounds](https://freesound.org/people/unfa/packs/15012/) are from Freesound, licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/);
- The favicon emoji is from [Twemoji](https://github.com/twitter/twemoji), licensed under [CC-BY 4.0](https://github.com/twitter/twemoji/blob/master/LICENSE-GRAPHICS).

# musical-scenes

**link to published site:** https://oaobielodan.github.io/musical-scenes/

**background:**

For my project, I created a “musical scene”. This idea was inspired by games such as Incredibox and My Singing Monsters. The initial idea was that there would be some sort of background that you would put elements into (such as plane or an animal or a plant). When the scene was “played”, the elements would move. What music was played based on the speed of those movements, sizes of the elements, position of the elements, etc. The final deliverable was a slight variation on this. 

When working on getting music to play based on the element movements, Professor Briz pointed out that with the way I was implementing it, the notes would be playing continuously, and there would be no melody. So we revised the plan, and now the created scene will be a field of flowers that a plane will fly over. The y-position of the flower is mapped to a specific note, where the higher a flower is on the field, the lower its pitch, and the lower the flower is on the filed, the higher its pitch. The flower’s x-position determines when that note will be played (by the plane flying over it). Finally, the different types of flowers correspond to different instruments. The current implementation has 4 instruments: synth, piano, guitar, violin. 

**picture credits:**
- https://www.worldanvil.com/w/harrian-hass-kaithea/followers (background)
- https://pngtree.com/freepng/single-flower-illustration_8703688.html (single flower)
- https://pngtree.com/freepng/aesthetic-floral-journal_8871868.html (double flower)
- https://pngtree.com/freepng/orange-wild-flowers_8734949.html (purple flower)
- https://pngtree.com/freepng/orange-wild-flowers_8734949.html (orange)
- https://www.cleanpng.com/png-narrow-body-aircraft-wide-body-aircraft-airline-fl-245477/download-png.html (plane)

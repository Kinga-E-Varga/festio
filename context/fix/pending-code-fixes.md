# List of suggestions and/or open questions to make the codebase cleaner

- Is there a need for multiple icons.tsx for different component? Most icons are used in multiple places. Unless it's a very specific sets of icons bound to only one component or page, I suggest putting all icons in one file.

- Right now to have a shadow for the invitation I have to add a p-7 padding to the Card like 'absolute inset-0 p-7 ....' in the @templates/wolf-dance/index.tsx and then add the shadow to the next div. Instead of doing that I'd want the shadow to be outside the card and me to set it with within the index.tsx like shadow: 'light' (or dark or null). In that case i don't need the p-7 on the card at 'absolute inset-0 p-7 ....'. I tried adding it around the card before but it got cut off because of how the scale/viewing window on the scale works.

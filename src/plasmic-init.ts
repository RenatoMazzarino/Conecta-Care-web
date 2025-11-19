import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "5LUxEtiuaq73roLqLQoKvF",
      token:
        "1I8mSCeCK2Y3IgRozzMcaLObtyzq4Ajgomc2pBfNsEXh6SJlEL8JZHfJlKqpbVlP69ILiMUo881qg0cFH0jg",
    },
  ],
  preview: true, // show unpublished changes in dev
});

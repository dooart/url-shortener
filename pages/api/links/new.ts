import { Redis } from "@upstash/redis";
import type { ShortenedLink, NewLinkFormData } from "lib/types";
import {
  checkIdExistence,
  findLinkById,
  findLinkIdByUrl,
  saveLink,
  saveReverseLink,
} from "lib/redis";
import { newId } from "lib/utils";
import type { NextApiRequest, NextApiResponse } from "next";

const MAX_TRIES = 5;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ShortenedLink>
) => {
  try {
    if (req.method !== "POST") {
      throw new Error("Method not supported");
    }

    const linkData: NewLinkFormData = req.body;

    const existingLinkId = await findLinkIdByUrl(linkData.url);

    let link: ShortenedLink;
    if (existingLinkId) {
      link = await findLinkById(existingLinkId);
      link.id = existingLinkId;
    } else {
      const newLinkId = await makeLinkId(linkData);
      link = {
        id: newLinkId,
        url: linkData.url,
        createdAt: Date.now(),
        timesAccessed: 0,
      };
      await saveLink(link);
      await saveReverseLink(link.url, link.id);
    }

    res.status(200).json(link);
  } catch (e) {
    throw e;
  }
};

async function makeLinkId(linkData: NewLinkFormData): Promise<string> {
  let tries = 0;
  let id: string = linkData.customLink || newId();
  while (await checkIdExistence(id)) {
    id = newId();
    if (++tries >= MAX_TRIES) {
      throw new Error(
        "Could not allocate a link id for the url. Please try again later."
      );
    }
  }
  return id;
}

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  checkIdExistence,
  findLinkById,
  findLinkIdByUrl,
  saveLink,
  saveReverseLink,
} from "lib/redis";
import type { NewLinkFormData, ShortenedLink } from "lib/types";
import { newId } from "lib/utils";
import { isValidCustomLink, isValidUrl } from "lib/validation";
import type { NextApiRequest, NextApiResponse } from "next";

const MAX_TRIES = 5;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ShortenedLink>
) => {
  try {
    if (!validate(req, res)) return;

    const linkData: NewLinkFormData = req.body;

    const existingLinkId = await findLinkIdByUrl(linkData.url);

    let link: ShortenedLink;
    if (existingLinkId) {
      link = {
        ...(await findLinkById(existingLinkId)),
        id: existingLinkId,
        existing: true,
      };
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
function validate(req: NextApiRequest, res: NextApiResponse): boolean {
  if (req.method !== "POST") {
    res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .send(ReasonPhrases.METHOD_NOT_ALLOWED);
    return false;
  }

  const { url, customLink }: NewLinkFormData = req.body;
  if (!isValidUrl(url) || !isValidCustomLink(customLink)) {
    res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    return false;
  }

  return true;
}

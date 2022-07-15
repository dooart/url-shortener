import { DisplayText, Label } from "components/forms";
import { Card, Page } from "components/page";
import useBooleanTimeout from "lib/boolean-timeout";
import { findLinkById } from "lib/redis";
import { ShortenedLink } from "lib/types";
import { formatRelativeUnixTime, formatUnixTime, getDomain } from "lib/utils";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default ({
  link,
  existing,
}: {
  link: ShortenedLink;
  existing: boolean;
}) => {
  return (
    <Page>
      <Card>
        <h1 className={`text-xl font-bold flex gap-3 items-center`}>
          <Image src="/images/pinch.png" width={32} height={32} />
          URL Shortener
        </h1>
        <LinkStats link={link} existing={existing} />
      </Card>
    </Page>
  );
};

const LinkStats = ({
  link,
  existing,
}: {
  link: ShortenedLink;
  existing: boolean;
}) => {
  const shortUrl = `${getDomain()}/${link.id}`;

  const [isCopying, setIsCopying] = useBooleanTimeout();
  return (
    <>
      <Label
        label={
          existing ? "This URL already has a short link:" : "Your short URL"
        }
      >
        <input
          type="text"
          value={shortUrl}
          readOnly
          onFocus={(event) => event.target.select()}
          className="w-full border text-sm outline-none p-2 rounded border-zinc-500"
        />
      </Label>
      <div className={`flex justify-center`}>
        <CopyToClipboard text={shortUrl} onCopy={() => setIsCopying(true)}>
          <button
            type="submit"
            className={`py-2 px-4 rounded text-white text-sm font-bold bg-sky-700 flex gap-2 items-center`}
            disabled={isCopying}
          >
            {isCopying && (
              <Image src="/images/check.svg" width={20} height={20} />
            )}
            {isCopying ? "Copied to clipboard" : "Copy short link"}
          </button>
        </CopyToClipboard>
      </div>
      <hr className="mt-3" />
      <Label label="Destination URL">
        <input
          type="text"
          readOnly
          value={link.url}
          className="text-sm text-ellipsis outline-none"
          onFocus={(event) => event.target.select()}
        />
      </Label>
      <Label label="Created at">
        <DisplayText>{formatUnixTime(link.createdAt)}</DisplayText>
      </Label>
      <Label label="Number of accesses">
        <DisplayText>{link.timesAccessed || 0}</DisplayText>
      </Label>
      <Label label="Last accessed">
        <DisplayText>
          {formatRelativeUnixTime(link.lastAccessedAt) || "Never"}
        </DisplayText>
      </Label>
      <hr />
      <div className="flex justify-center my-2">
        <Link href="/" passHref>
          <a className="text-sm py-2 px-4 rounded text-white font-bold bg-slate-500 flex gap-2 items-center">
            Shorten another link
          </a>
        </Link>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { id, existing }: { id?: string; existing?: string } = query;
    if (!id) return { notFound: true };

    const link = await findLinkById(id as string);
    if (!link) return { notFound: true };

    return {
      props: {
        link: { ...link, id },
        existing: existing === "true",
      },
    };
  } catch (e) {
    throw e;
  }
};

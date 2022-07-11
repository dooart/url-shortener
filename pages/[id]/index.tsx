import { findLinkById, logAccessToLink } from "lib/redis";
import { GetServerSideProps } from "next";

export default () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { id }: { id?: string } = query;
    if (!id) return { notFound: true };

    const link = await findLinkById(id as string);
    if (!link) return { notFound: true };

    logAccessToLink(id);

    return {
      redirect: {
        permanent: false,
        destination: link.url,
      },
    };
  } catch (e) {
    throw e;
  }
};

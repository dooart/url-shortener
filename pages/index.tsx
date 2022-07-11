import axios from "axios";
import { Field } from "components/forms";
import { Card, Page, Spinner } from "components/page";
import { NewLinkFormData, ShortenedLink } from "lib/types";
import { getDomainWithoutScheme } from "lib/utils";
import { isValidUrl, isValidCustomLink } from "lib/validation";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default () => {
  return (
    <Page>
      <Card>
        <h1 className={`text-xl font-bold flex gap-3 items-center`}>
          <Image src="/images/pinch.png" width={32} height={32} />
          URL Shortener
        </h1>
        <NewLinkForm />
      </Card>
    </Page>
  );
};

const NewLinkForm = () => {
  const router = useRouter();

  const form = useForm<NewLinkFormData>({ mode: "onBlur" });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = form;

  const onSubmit = async (formData: NewLinkFormData) => {
    const { data: newLink } = await axios.post<ShortenedLink>(
      "/api/links/new",
      formData
    );
    await router.push({
      pathname: "/[id]/stats",
      query: { id: newLink.id, existing: newLink.existing },
    });
  };

  return (
    <form className={`flex flex-col gap-5`} autoComplete="off">
      <Field
        label="URL to shorten"
        name="url"
        errors={errors}
        customErrorMessages={{ validUrl: "Enter a valid URL" }}
      >
        <input
          id="url"
          type="text"
          placeholder="https://your-url.com"
          className={`w-full border text-sm outline-none p-2 rounded ${
            errors.url ? "border-red-400" : "border-zinc-500"
          }`}
          {...register("url", {
            required: true,
            validate: {
              validUrl: isValidUrl,
            },
          })}
        />
      </Field>
      <Field
        label="Custom link (optional)"
        name="customLink"
        errors={errors}
        customErrorMessages={{
          validCustomLink: "Use letters and numbers only",
          minLength: "Needs at least 4 characters",
        }}
      >
        <div
          className={`border rounded px-2 flex items-center text-sm gap-0.5 ${
            errors.customLink ? "border-red-400" : "border-zinc-500"
          }`}
        >
          <span className={`text-zinc-500 font-medium`}>
            {getDomainWithoutScheme()}/
          </span>
          <input
            type="text"
            placeholder="your-custom-link"
            className={`outline-none py-2 w-full`}
            {...register("customLink", {
              minLength: 4,
              validate: {
                validCustomLink: isValidCustomLink,
              },
            })}
          />
        </div>
      </Field>
      <div className={`flex justify-center`}>
        <button
          type="submit"
          className={`mt-2 py-2 px-4 rounded text-white text-sm font-bold bg-sky-700 flex gap-2 items-center`}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <div className={`w-4 h-4`}>
              <Spinner />
            </div>
          )}
          Shorten
        </button>
      </div>
    </form>
  );
};

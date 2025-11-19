import * as React from "react";
import type { GetStaticPropsContext } from "next";
import {
  ComponentRenderData,
  PlasmicComponent,
  PlasmicRootProvider,
} from "@plasmicapp/loader-nextjs";

import { PLASMIC } from "../plasmic-init";

interface PlasmicLoaderPageProps {
  plasmicData?: ComponentRenderData;
}

export default function PlasmicLoaderPage(
  { plasmicData }: PlasmicLoaderPageProps
) {
  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    return <div>Pagina nao encontrada</div>;
  }

  return (
    <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
      <PlasmicComponent component={plasmicData.entryCompMetas[0].name} />
    </PlasmicRootProvider>
  );
}

export async function getStaticProps(
  ctx: GetStaticPropsContext<{ catchall?: string | string[] }>
) {
  const catchall = ctx.params?.catchall;
  const slug = Array.isArray(catchall)
    ? catchall.filter(Boolean).join("/")
    : catchall || "";

  const plasmicData = await PLASMIC.maybeFetchComponentData(slug);

  if (!plasmicData) {
    return { props: {}, notFound: true };
  }

  return {
    props: {
      plasmicData,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking" as const,
  };
}
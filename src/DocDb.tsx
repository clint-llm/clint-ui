import * as Clint from "../../clint-lib/pkg";

export async function buildDocDb() {
  const version = "v2";
  const [
    embeddings,
    embeddingsPcaMapping,
    embeddingId,
    parents,
    titles,
    urls,
    isIntroduction,
    isCondition,
    isSymptoms,
  ] = await Promise.all([
    fetch(`/db/embeddings_pca_128.${version}.npy`, {
      cache: "force-cache",
    }).then((x) => x.arrayBuffer()),
    fetch(`/db/embeddings_pca_128_mapping.${version}.npy`, {
      cache: "force-cache",
    }).then((x) => x.arrayBuffer()),
    fetch(`/db/embeddings_hash.${version}.csv`, { cache: "force-cache" }).then(
      (x) => x.arrayBuffer(),
    ),
    fetch(`/db/parents.${version}.csv`, { cache: "force-cache" }).then((x) =>
      x.arrayBuffer(),
    ),
    fetch(`/db/titles.${version}.csv`, { cache: "force-cache" }).then((x) =>
      x.arrayBuffer(),
    ),
    fetch(`/db/urls.${version}.csv`, { cache: "force-cache" }).then((x) =>
      x.arrayBuffer(),
    ),
    fetch(`/db/is_introduction.${version}.csv`, { cache: "force-cache" }).then(
      (x) => x.arrayBuffer(),
    ),
    fetch(`/db/is_condition.${version}.csv`, { cache: "force-cache" }).then(
      (x) => x.arrayBuffer(),
    ),
    fetch(`/db/is_symptoms.${version}.csv`, { cache: "force-cache" }).then(
      (x) => x.arrayBuffer(),
    ),
  ]);
  return new Clint.DocDbJs(
    window.origin,
    new Uint8Array(embeddings),
    new Uint8Array(embeddingsPcaMapping),
    new Uint8Array(embeddingId),
    new Uint8Array(parents),
    new Uint8Array(titles),
    new Uint8Array(urls),
    new Uint8Array(isIntroduction),
    new Uint8Array(isCondition),
    new Uint8Array(isSymptoms),
  );
}

import * as Clint from "../../clint-lib/pkg";

export async function buildDocDb() {
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
    fetch("/db/embeddings_pca_128.npy", { cache: "force-cache" }).then((x) =>
      x.arrayBuffer(),
    ),
    fetch("/db/embeddings_pca_128_mapping.npy", { cache: "force-cache" }).then(
      (x) => x.arrayBuffer(),
    ),
    fetch("/db/embeddings_hash.csv", { cache: "force-cache" }).then((x) =>
      x.arrayBuffer(),
    ),
    fetch("/db/parents.csv", { cache: "force-cache" }).then((x) =>
      x.arrayBuffer(),
    ),
    fetch("/db/titles.csv", { cache: "force-cache" }).then((x) =>
      x.arrayBuffer(),
    ),
    fetch("/db/urls.csv", { cache: "force-cache" }).then((x) =>
      x.arrayBuffer(),
    ),
    fetch("/db/is_introduction.csv", { cache: "force-cache" }).then((x) =>
      x.arrayBuffer(),
    ),
    fetch("/db/is_condition.csv", { cache: "force-cache" }).then((x) =>
      x.arrayBuffer(),
    ),
    fetch("/db/is_symptoms.csv", { cache: "force-cache" }).then((x) =>
      x.arrayBuffer(),
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

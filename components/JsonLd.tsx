// Single JSON-LD script tag. Every page emits exactly one of these, built with
// lib/seo ldGraph() so all entities share one @context and link by @id.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

# NUWA local search preview

Python 3.10+ with SQLite FTS5; no third-party Python dependencies. Static Astro pages remain the website. This service supplies same-origin POST /api/search. It is a local review server, not a production HTTP server.

Generate a private corpus from the repository root:

```
node scripts/collect-nuwa-global-packages.mjs /absolute/private/research
node scripts/prepare-nuwa-global-preview.mjs /absolute/private/research/preview /absolute/private/research/packages.json
NUWA_GLOBAL_RESEARCH_ROOT=/absolute/private/research npm run build
python3 services/nuwa-search/server.py --site dist --corpus /absolute/private/research/preview/candidate.json --cache /absolute/private/research/preview/vectors.json
```

Open http://127.0.0.1:4345/nuwa/whitzard-index/preview/trend/ . Page and service candidate IDs must agree; rebuild both after package changes. Without external research packages the preview builds from the retained public edition; its candidate ID differs.

Search accepts query, locale, filters(type/area/primaryFunction), cursor and snapshotId. It returns hits, facets, mode, notice and nextCursor. A hit preserves source/type/section and uses text-node rendering. A version mismatch returns HTTP400; the page offers the static directory. Requests have bounded length, a concurrency cap and per-client limits. Query text is not logged.

## Semantic mode

Set OPENAI_API_KEY in the server environment, not browser code. Optional NUWA_EMBED_MODEL defaults to text-embedding-3-large. Start once with --embed to create a version-bound 1024-dimensional vector cache; this performs paid external API requests for the full selected corpus. Restart without --embed for normal use. Only indexed public/review text is sent; original captures and internal review files are not indexed. Never put keys in this repository.

Semantic mode requires both credentials and complete matching vectors. Otherwise the response explicitly says lexical. Embedding failures downgrade that query; no generated answer is returned. Query vectors are cached in memory, content vectors in the external cache. Quality has not been accepted until real semantic evaluation is run.

```
cd services/nuwa-search
python3 -m unittest
```

Evaluate with evaluate.py --corpus FILE --tasks FILE --out FILE. The present evaluator reports lexical quality, not semantic quality. Judgments are model-assisted and await researcher review.

## Container and backups

Build from this directory with docker build -t nuwa-search-local . . Mount site read-only at /site, candidate read-only at /data and a writable private cache at /cache; bind host port to 127.0.0.1:4345. Pass API key through the container environment if needed. Container execution has not been verified in this delivery.

Back up candidate JSON, research captures, source hashes, task judgments and vector cache together. Restore only a matching candidate/cache pair. SQLite FTS is reconstructed at startup. Production deployment remains a later reviewed step with an appropriate HTTP reverse proxy and API budget controls.

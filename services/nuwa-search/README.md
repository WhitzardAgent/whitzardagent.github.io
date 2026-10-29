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

Set OPENAI_API_KEY in the server environment, not browser code. Optional NUWA_EMBED_MODEL defaults to text-embedding-3-large. Start with --embed to prepare the vector cache. NUWA_EMBED_DIMENSIONS defaults to 1024. This makes paid API requests for new or changed indexed content; unchanged text reuses its embedding across candidate versions. Restart without --embed for normal use. Only indexed public/review text is sent; original captures and internal review files are not indexed. Never put keys in this repository.

The v2 cache keys each vector by the exact embedded text, model and dimensions. Its manifest binds the current candidate to the complete document-to-content mapping. After a candidate changes, run --embed again to bind the new manifest; unchanged content incurs no new embedding requests. Invalid dimensions, nonfinite values, zero vectors and incomplete API batches cannot enable semantic mode. Legacy caches must be rebuilt.

Semantic mode requires both credentials and a complete matching manifest. Otherwise the response explicitly says lexical. Embedding failures downgrade that query; no generated answer is returned. Query vectors are cached in memory, content vectors in the external cache. Quality has not been accepted until real semantic evaluation is run.

```
cd services/nuwa-search
python3 -m unittest
```

Evaluate with evaluate.py --corpus FILE --tasks FILE --out FILE. Use --mode lexical for the lexical baseline or --mode hybrid --cache FILE for real hybrid evaluation. Hybrid mode requires valid credentials and a complete current cache, and fails if any query downgrades to lexical. Tasks accept typed expected objects: [{"type":"benchmark","id":"cybench","relevance":2}]. The report includes graded nDCG@10, Recall@10, category scores, and cold/warm p95 including actual query API time. Cold means first encounter in this evaluation process, not a cold service startup. Judgments are model-assisted and await researcher review.

## Container and backups

Build from this directory with docker build -t nuwa-search-local . . Mount site read-only at /site, candidate read-only at /data and a writable private cache at /cache; bind host port to 127.0.0.1:4345. Pass API key through the container environment if needed. Container execution has not been verified in this delivery.

Back up candidate JSON, research captures, source hashes, task judgments and vector cache together. Restore only a matching candidate/cache pair. SQLite FTS is reconstructed at startup. Production deployment remains a later reviewed step with an appropriate HTTP reverse proxy and API budget controls.

## Complete local review

The full-site candidate uses `node scripts/prepare-nuwa-current-edition.mjs /absolute/private/research`, then `NUWA_GLOBAL_RESEARCH_ROOT=/absolute/private/research npm run build`. Serve `complete/candidate.json` with `--port 4346` and open `/nuwa/whitzard-index/` (English: `/en/nuwa/whitzard-index/`). This uses real catalogue records and explicit candidate-only measurement groups, rather than only the five-page prototype. Source PDFs, derived text and images are checked before preparation. Current downloads carry the candidate ID; immutable public editions retain their original IDs.

The current user review uses lexical search; semantic activation is deferred. The Docker image was built and its lexical API exercised with the candidate mounted read-only. A restored candidate JSON reconstructed the lexical index and returned the same version and Cybench result. This does not verify embedding-cache recovery without actual vectors.

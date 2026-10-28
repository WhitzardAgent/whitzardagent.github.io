# Organization brand audit

Audited on **2026-10-26** against all **87 organizations** in the working catalogue. **83 local authentic identity assets** are available; **4 records remain text-only** with explicit dispositions. Total local asset bytes: **646,094**. No catalogue or historical snapshot was changed.

## Scope and provenance

- This registry is presentation metadata in `src/data/nuwa-index/organization-brands.json`, separate from scientific snapshots. Every record retains its official catalogue homepage, retrieval date, source page, asset source, content hash, format and either a local file or an unavailable reason.
- Assets comprise 74 official-site icons, 6 official-site/header logos and 3 existing user/project-supplied institution marks. Oxford, Columbia and NUS reuse the exact supplied Research assets with local source paths and source hashes; original acquisition URLs are unknown and no fresh official download is claimed. Icons are identified as website identities rather than claimed to be complete corporate brand kits. No aggregator, logo proxy, generated approximation or runtime hotlink is used.
- Raster images were decoded and re-encoded to static PNG. SVG inputs were parsed, rejected if they contained scripts, event handlers, external references or active content, then rasterized to static PNG. All served files are PNG, no larger than 160 × 160 pixels; original proportions remain intact. Low-resolution source favicons remain visibly low-resolution rather than being redrawn.
- A contact-sheet review rejected a campus photograph incorrectly detected for NYU and a customer ASML logo incorrectly detected for Mistral. Exact inline official header SVGs replaced both. The MPI access-denied-page icon was rejected. White NYU, Tsinghua and Beihang wordmarks retain a dark backing.
- Marks are decorative alongside full localized organization names. Role grouping, institution links and textual fallbacks remain available in static output; marks add no client JavaScript. Fixed 20px marks and 40px detail-heading marks use `object-fit: contain`.
- Identity scope follows the existing organization record: DeepMind keeps its own mark; MIT is university-level rather than CSAIL; Qwen uses its official Qwen mark; combined NIST / CAISI shows the parent NIST mark; combined Whitzard / NUWA uses the official Whitzard site icon; Moonshot uses the Kimi site icon supplied by its catalogue homepage. MPI-IS now uses its institute-specific mark from the official IMPRS-IS partner footer, separately identified from the doctoral-program logo. Princeton uses the university shield favicon declared by its official CS site; Newcastle uses its primary international logo declared by the official Chinese site linked by its central university website. No other institute, department or society mark is substituted.

## Coverage

| Organization type | Local marks | Audited |
|---|---:|---:|
| company | 22 | 24 |
| government | 2 | 2 |
| nonprofit | 17 | 17 |
| research-institute | 5 | 6 |
| university | 37 | 38 |

## Individual dispositions and sources

`available` means an identity asset was retrieved and visually checked, not that affiliation, endorsement or a deployment is inferred. All assets were retrieved or audited against existing supplied files on 2026-10-26. The JSON registry also preserves failed request attempts and source hashes.

| Organization | Status / identity scope | Official homepage | Asset source / disposition | Local file |
|---|---|---|---|---|
| OpenAI (`openai`) | available | [official](https://openai.com/) | [official-site-icon](https://openai.com/apple-icon.png?apple-icon.3o0tf8iy4mx7y.png) | `public/assets/organizations/openai.png` |
| Anthropic (`anthropic`) | available | [official](https://www.anthropic.com/) | [official-site-icon](https://www.anthropic.com/images/icons/apple-touch-icon.png) | `public/assets/organizations/anthropic.png` |
| Google DeepMind (`deepmind`) | available | [official](https://deepmind.google/) | [official-site-icon](https://storage.googleapis.com/gdm-deepmind-com-prod-public/icons/google_deepmind_2x_96dp.png) | `public/assets/organizations/deepmind.png` |
| Meta (`meta`) | available | [official](https://ai.meta.com/) | [official-site-icon](https://static.xx.fbcdn.net/rsrc.php/yQ/r/0eWKxz9kEoF.webp) | `public/assets/organizations/meta.png` |
| METR (`metr`) | available | [official](https://metr.org/) | [official-site-icon](https://metr.org/assets/images/favicon/apple-touch-icon.png) | `public/assets/organizations/metr.png` |
| Apollo Research (`apollo`) | available | [official](https://www.apolloresearch.ai/) | [official-site-icon](https://cdn.prod.website-files.com/6a2925787c793541e9bde0a9/6a61c0d0ff5085da8cd48720_Vector.png) | `public/assets/organizations/apollo.png` |
| UK AI Security Institute (`aisi`) | available | [official](https://www.aisi.gov.uk/) | [official-site-icon](https://cdn.prod.website-files.com/663bd486c5e4c81588db7a1d/6851b4acf52818a86a4f9f86_AISI%20icon%20256.png) | `public/assets/organizations/aisi.png` |
| FAR.AI (`far`) | available | [official](https://www.far.ai/) | [official-site-icon](https://cdn.prod.website-files.com/6a1367b300e755d2620f62ba/6a2d2d69931400223a7bcf4c_Favicon%20-%20light.png) | `public/assets/organizations/far.png` |
| Palisade Research (`palisade`) | available | [official](https://palisaderesearch.org/) | [official-site-icon](https://palisaderesearch.org/assets/images/logos/favicon.svg) | `public/assets/organizations/palisade.png` |
| Truthful AI (`truthful`) | available | [official](https://truthful.ai/) | [official-site-icon](https://truthful.ai/favicon.svg) | `public/assets/organizations/truthful.png` |
| Redwood Research (`redwood`) | available | [official](https://www.redwoodresearch.org/) | [official-site-icon](https://www.redwoodresearch.org/icon.png?d561c2534611285d) | `public/assets/organizations/redwood.png` |
| Fudan University (`fudan`) | available | [official](https://www.fudan.edu.cn/) | [official-site-icon](https://www.fudan.edu.cn/_upload/tpl/00/0e/14/template14/images/favicon.ico) | `public/assets/organizations/fudan.png` |
| Whitzard / NUWA Lab (`whitzard`) | available | [official](https://whitzard.tech/nuwa/) | [official-site-icon](https://whitzard.tech/favicon.png) | `public/assets/organizations/whitzard.png` |
| University of California, Berkeley (`berkeley`) | available | [official](https://www.berkeley.edu/) | [official-site-icon](https://www.berkeley.edu/favicon.svg?v=2) | `public/assets/organizations/berkeley.png` |
| Stanford University (`stanford`) | available | [official](https://www.stanford.edu/) | [official-site-icon](https://www.stanford.edu/icon5.png?icon5.1s5w2slgta8u9.png?dpl=e269585a260c91a54b81a8c27aec30eb9f650bf5d78a3deb966fbc1957bcfe3f366164626530346331343261303532626262333732346435) | `public/assets/organizations/stanford.png` |
| University of Illinois Urbana-Champaign (`uiuc`) | available | [official](https://illinois.edu/) | [official-site-icon](https://cdn.brand.illinois.edu/touch-icon-40x40.png) | `public/assets/organizations/uiuc.png` |
| Massachusetts Institute of Technology (`mit`) | available | [official](https://www.mit.edu/) | [official-site-icon](https://www.mit.edu/themes/mit/assets/favicon/apple-touch-icon.png) | `public/assets/organizations/mit.png` |
| Carnegie Mellon University (`cmu`) | available | [official](https://www.cmu.edu/) | [official-site-icon](https://www.cmu.edu/themes/custom/cmu_base/favicon.ico) | `public/assets/organizations/cmu.png` |
| University of Oxford (`oxford`) | available | [official](https://www.ox.ac.uk/) | `public/assets/research/agentcyberrange/oxford.webp` (user/project-supplied); [official identity reference](https://www.ox.ac.uk/about/the-university/brand/guidelines) | `public/assets/organizations/oxford.png` |
| Mila (`mila`) | available | [official](https://mila.quebec/) | [official-site-icon](https://mila.quebec/sites/default/themes/mila_v1/apple-touch-icon.png) | `public/assets/organizations/mila.png` |
| Université de Montréal (`montreal`) | available | [official](https://www.umontreal.ca/) | [official-site-icon](https://www.umontreal.ca/apple-touch-icon.png) | `public/assets/organizations/montreal.png` |
| Princeton University (`princeton`) | available | [official](https://www.princeton.edu/) | [official-site-icon](https://www.cs.princeton.edu/sites/default/files/favicon.ico) | `public/assets/organizations/princeton.png` |
| ETH Zurich (`eth`) | available | [official](https://ethz.ch/) | [official-site-icon](https://ethz.ch/etc/designs/ethz/img/icons/ETH-APP-Icons-Theme-white/192-xxxhpdi.png) | `public/assets/organizations/eth.png` |
| Invariant Labs (`invariant`) | available | [official](https://invariantlabs.ai/) | [official-site-icon](https://invariantlabs.ai/theme/icon/apple-touch-icon.png) | `public/assets/organizations/invariant.png` |
| SecureBio (`securebio`) | available | [official](https://securebio.org/) | [official-site-icon](https://securebio.org/assets/favicon.svg) | `public/assets/organizations/securebio.png` |
| Center for AI Safety (`cais`) | available | [official](https://www.safe.ai/) | [official-site-icon](https://cdn.prod.website-files.com/63fe96aeda6bea77ac7d3000/69cf08b22029149dfc7085f7_CAIS%20Logomark%20256.png) | `public/assets/organizations/cais.png` |
| Scale AI (`scale`) | available | [official](https://scale.com/) | [official-site-icon](https://scale.com/static/global/favicon/v3/apple-touch-icon.png) | `public/assets/organizations/scale.png` |
| Gray Swan AI (`grayswan`) | available | [official](https://www.grayswan.ai/) | [official-site-icon](https://cdn.prod.website-files.com/6614467b00e631b0f073e2b7/68715172841ef6679c94f2bb_GS-256.png) | `public/assets/organizations/grayswan.png` |
| EleutherAI (`eleuther`) | available | [official](https://www.eleuther.ai/) | [official-site-icon](https://eleuther.ai/apple-touch-icon.png) | `public/assets/organizations/eleuther.png` |
| Tsinghua University (`tsinghua`) | available | [official](https://www.tsinghua.edu.cn/) | [official-site-logo](https://www.tsinghua.edu.cn/image/logo180.png) | `public/assets/organizations/tsinghua.png` |
| Shanghai Innovation Institute (`sii`) | available | [official](https://www.sii.edu.cn/) | [official-site-icon](https://www.sii.edu.cn/_upload/tpl/00/09/9/template9/favicon.ico) | `public/assets/organizations/sii.png` |
| Yale University (`yale`) | available | [official](https://www.yale.edu/) | [official-site-icon](https://www.yale.edu/sites/all/themes/yale_blue/images/favicons/apple-touch-icon-76x76.png) | `public/assets/organizations/yale.png` |
| Purdue University (`purdue`) | available | [official](https://www.purdue.edu/) | [official-site-icon](https://www.purdue.edu/home/wp-content/mu-plugins/boilerup-wp/favicon/apple-icon-76x76.png) | `public/assets/organizations/purdue.png` |
| Cornell University (`cornell`) | available | [official](https://www.cornell.edu/) | [official-site-icon](https://www.cornell.edu/apple-touch-icon.png) | `public/assets/organizations/cornell.png` |
| University of Regina (`regina`) | available | [official](https://www.uregina.ca/) | [official-site-icon](https://www.uregina.ca/favicon.ico) | `public/assets/organizations/regina.png` |
| MATS (`mats`) | available | [official](https://www.matsprogram.org/) | [official-site-icon](https://cdn.prod.website-files.com/6909901117f6b8d83783ca29/690f9d5d84c6852815a8b073_mats%20logo%20mark%20256.png) | `public/assets/organizations/mats.png` |
| Imperial College London (`imperial`) | available | [official](https://www.imperial.ac.uk/) | [official-site-icon](https://www.imperial.ac.uk/assets/website/images/favicon/favicon-180.png) | `public/assets/organizations/imperial.png` |
| University of Waterloo (`waterloo`) | available | [official](https://uwaterloo.ca/) | [official-site-icon](https://uwaterloo.ca/profiles/uw_base_profile/themes/uw_fdsu_theme_resp/apple-touch-icon.png) | `public/assets/organizations/waterloo.png` |
| University of Toronto (`toronto`) | available | [official](https://www.utoronto.ca/) | [official-site-icon](https://www.utoronto.ca/themes/custom/bootstrap_uoft/images/favicons/favicon.ico) | `public/assets/organizations/toronto.png` |
| Max Planck Institute for Intelligent Systems (`mpi`) | available | [official](https://is.mpg.de/) | [official-site-logo](https://imprs.is.mpg.de/uploads/partner/image/19/thumb_md_MPG_IS_Logo_RGB_green-ENG600_ppi.png) | `public/assets/organizations/mpi.png` |
| University of Tübingen (`tubingen`) | available | [official](https://uni-tuebingen.de/) | [official-site-icon](https://uni-tuebingen.de/_assets/7d66ab3e4599366251c5af46f0e770b9/Images/Favicons/apple-touch-icon.png) | `public/assets/organizations/tubingen.png` |
| ELLIS Institute Tübingen (`ellis`) | available | [official](https://tuebingen.ellis.eu/) | [official-site-icon](https://tuebingen.ellis.eu/assets/fav-a67817c6e498ff813c1d49ef99780dbf6c2c0256009d84c09f38dc72613f0771.png) | `public/assets/organizations/ellis.png` |
| Edison Scientific (`edison`) | available | [official](https://edisonscientific.com/) | [official-site-icon](https://cdn.prod.website-files.com/6a05ae6a3f0a6ce150583845/6a0b19333184f0ef28b53aef_android-chrome-512x512.png) | `public/assets/organizations/edison.png` |
| FutureHouse (`futurehouse`) | available | [official](https://www.futurehouse.org/) | [official-site-icon](https://cdn.prod.website-files.com/669f0d63ca36f46df2e0682f/66a3bbd71dc20fd088202b11_FutureHouse%20Webclip.png) | `public/assets/organizations/futurehouse.png` |
| Federal University of ABC (`ufabc`) | unavailable | [official](https://www.ufabc.edu.br/) | Official homepage, identity-manual page, English site and Prograd page timed out. No usable official image bytes retrieved; no third-party or department mark substituted. | Text only |
| Irregular (`irregular`) | available | [official](https://www.irregular.com/) | [official-site-icon](https://framerusercontent.com/images/QFYpbFIEf3Ru4FTdTU6BcwRHcU0.png) | `public/assets/organizations/irregular.png` |
| RAND (`rand`) | available | [official](https://www.rand.org/) | [official-site-icon](https://www.rand.org/etc.clientlibs/rand/designs/common/images/resources/favicon.svg) | `public/assets/organizations/rand.png` |
| NIST / CAISI (`nist`) | available | [official](https://www.nist.gov/caisi) | [official-site-icon](https://www.nist.gov/themes/custom/nist_www/favicon.ico) | `public/assets/organizations/nist.png` |
| SaferAI (`saferai`) | available | [official](https://www.safer-ai.org/) | [official-site-icon](https://www.safer-ai.org/t/assets/img/favicon-96x96.png) | `public/assets/organizations/saferai.png` |
| Columbia University (`columbia`) | available | [official](https://www.columbia.edu/) | `public/assets/research/agentcyberrange/columbia.webp` (user/project-supplied); [official identity reference](https://visualidentity.columbia.edu/) | `public/assets/organizations/columbia.png` |
| University of Washington (`washington`) | available | [official](https://www.washington.edu/) | [official-site-icon](https://uw.edu/static/hometemp/wp-content/themes/uw_wp_theme/favicon.ico) | `public/assets/organizations/washington.png` |
| University of California San Diego (`ucsd`) | available | [official](https://ucsd.edu/) | [official-site-icon](https://ucsd.edu/favicon.ico) | `public/assets/organizations/ucsd.png` |
| Bugcrowd (`bugcrowd`) | available | [official](https://www.bugcrowd.com/) | [official-site-icon](https://www.bugcrowd.com/wp-content/themes/bugcrowd/assets/images/favicon/apple-touch-icon.png) | `public/assets/organizations/bugcrowd.png` |
| National University of Singapore (`nus`) | available | [official](https://nus.edu.sg/) | `public/assets/research/agentcyberrange/nus.webp` (user/project-supplied); [official identity reference](https://www.nus.edu.sg/identity/guidelines/logo-guideline) | `public/assets/organizations/nus.png` |
| Apart Research (`apart`) | available | [official](https://apartresearch.com/) | [official-site-icon](https://apartresearch.com/apple-icon.png?apple-icon.2cgnph1f0cqa2.png) | `public/assets/organizations/apart.png` |
| CrowdStrike (`crowdstrike`) | available | [official](https://www.crowdstrike.com/) | [official-site-icon](https://www.crowdstrike.com/etc.clientlibs/crowdstrike/clientlibs/crowdstrike-common/resources/favicon.ico) | `public/assets/organizations/crowdstrike.png` |
| Constellation (`constellation`) | available | [official](https://www.constellation.org/) | [official-site-icon](https://constellation.org/hubfs/Constellation%2032%20favi.png) | `public/assets/organizations/constellation.png` |
| Harvard University (`harvard`) | available | [official](https://www.harvard.edu/) | [official-site-icon](https://www.harvard.edu/wp-content/uploads/2020/10/cropped-logo-branding-compressed.png?w=180) | `public/assets/organizations/harvard.png` |
| University of Southern California (`usc`) | available | [official](https://www.usc.edu/) | [official-site-icon](https://www.usc.edu/wp-content/uploads/2025/11/cropped-usc_512x512-Android@1x-180x180.png) | `public/assets/organizations/usc.png` |
| University of California, Los Angeles (`ucla`) | available | [official](https://www.ucla.edu/) | [official-site-icon](https://www.ucla.edu/img/apple-touch-icon.png) | `public/assets/organizations/ucla.png` |
| California Institute of Technology (`caltech`) | available | [official](https://www.caltech.edu/) | [official-site-icon](https://www.caltech.edu/static/core/img/apple-touch-icon.png?v=7.14.13) | `public/assets/organizations/caltech.png` |
| Northeastern University (`northeastern`) | available | [official](https://www.northeastern.edu/) | [official-site-icon](https://brand.northeastern.edu/global/assets/favicon/apple-touch-76x76.png?v=2) | `public/assets/organizations/northeastern.png` |
| University of Newcastle (`newcastle`) | available | [official](https://www.newcastle.edu.au/) | [official-site-logo](https://cdn.sin0sites.com/1151075878605074432/PBSLW_2049352140730691584/UON_LOGO_2024_v1.3_PRIMARY-INTL.jpg) | `public/assets/organizations/newcastle.png` |
| Keio University (`keio`) | available | [official](https://www.keio.ac.jp/) | [official-site-icon](https://www.keio.ac.jp/apple-touch-icon.png) | `public/assets/organizations/keio.png` |
| Ariel University (`ariel`) | available | [official](https://www.ariel.ac.il/) | [official-site-icon](https://www.ariel.ac.il/favicon.ico) | `public/assets/organizations/ariel.png` |
| Arizona State University (`asu`) | available | [official](https://www.asu.edu/) | [official-site-icon](https://www.asu.edu/themes/custom/asu_edu/favicon.ico) | `public/assets/organizations/asu.png` |
| xAI (`xai`) | available | [official](https://x.ai/) | [official-site-icon](https://x.ai/apple-icon.png?apple-icon.167itqrsbgzm4.png?dpl=3a4bcbb9cbd7a588efa9b97a791e7abf21fb5dea) | `public/assets/organizations/xai.png` |
| Lapis Labs (`lapis`) | unavailable | Not verified | No verified official homepage in catalogue; no identity inferred from the name. | Text only |
| Sybil (`sybil`) | unavailable | Not verified | No verified official homepage in catalogue; no identity inferred from the name. | Text only |
| RTX BBN Technologies (`bbn`) | available | [official](https://www.bbn.com/) | [official-site-icon](https://www.rtx.com/-/media/themes/raytheon-technologies/rtx-shared/rtx-theme/images/rtx-balck-favicon.png?rev=3da99ab1a2a54dca92c98a2ede690339&rid=e3e3f4840c2742cc9f36e2d33430c8cd) | `public/assets/organizations/bbn.png` |
| Vals AI (`vals`) | available | [official](https://www.vals.ai/) | [official-site-icon](https://www.vals.ai/apple-touch-icon.png) | `public/assets/organizations/vals.png` |
| Tufts University (`tufts`) | available | [official](https://www.tufts.edu/) | [official-site-icon](https://www.tufts.edu/themes/custom/tuftsedu_theme/favicon.png) | `public/assets/organizations/tufts.png` |
| Vector Institute (`vector`) | available | [official](https://vectorinstitute.ai/) | [official-site-icon](https://vectorinstitute.ai/wp-content/uploads/2023/01/favicon-vector-institute-32x32-1.png) | `public/assets/organizations/vector.png` |
| Thoughtful Lab (`thoughtful`) | unavailable | Not verified | No verified official homepage in catalogue; no identity inferred from the name. | Text only |
| Equistamp (`equistamp`) | available | [official](https://equistamp.com/) | [official-site-icon](https://equistamp.com/favicon.ico) | `public/assets/organizations/equistamp.png` |
| Microsoft (`microsoft`) | available | [official](https://www.microsoft.com/research/) | [official-site-icon](https://www.microsoft.com/favicon.ico) | `public/assets/organizations/microsoft.png` |
| New York University (`nyu`) | available | [official](https://www.nyu.edu/) | [official-site-logo](https://www.nyu.edu/) — Header wordmark: second inline SVG, viewBox 0 0 68 24 | `public/assets/organizations/nyu.png` |
| IIIT Hyderabad (`iiit`) | available | [official](https://www.iiit.ac.in/) | [official-site-icon](https://www.iiit.ac.in/wp-content/uploads/2022/07/cropped-IIIT-Favicon-180x180.png) | `public/assets/organizations/iiit.png` |
| University of Science and Technology of China (`ustc`) | available | [official](https://www.ustc.edu.cn/) | [official-site-icon](https://www.ustc.edu.cn/news/images/ustc.ico) | `public/assets/organizations/ustc.png` |
| Beihang University (`beihang`) | available | [official](https://www.buaa.edu.cn/) | [official-site-logo](https://www.buaa.edu.cn/images/logo.png) | `public/assets/organizations/beihang.png` |
| Neo Research (`neo`) | available | [official](https://neoresearch.ai/) | [official-site-icon](https://neoresearch.ai/assets/neo-research-A-mark-light.png) | `public/assets/organizations/neo.png` |
| Moonshot AI (`moonshot`) | available | [official](https://www.kimi.com/) | [official-site-icon](https://www.kimi.com/pwa-192.png) | `public/assets/organizations/moonshot.png` |
| Z.ai (`zai`) | available | [official](https://z.ai/) | [official-site-icon](https://z-cdn.chatglm.cn/z-ai/static/logo.svg) | `public/assets/organizations/zai.png` |
| DeepSeek (`deepseek`) | available | [official](https://www.deepseek.com/) | [official-site-icon](https://www.deepseek.com/favicon.ico) | `public/assets/organizations/deepseek.png` |
| Qwen / Alibaba (`qwen`) | available | [official](https://qwen.ai/) | [official-site-icon](https://img.alicdn.com/imgextra/i4/O1CN01OXv3EM1FN8t9W4P79_!!6000000000474-2-tps-80-80.png) | `public/assets/organizations/qwen.png` |
| Mistral AI (`mistral`) | available | [official](https://mistral.ai/) | [official-site-logo](https://mistral.ai/) — Header mobile logo: SVG within data-mobile-logo-icon, viewBox 0 0 21 15 | `public/assets/organizations/mistral.png` |
| Lyptus Research (`lyptus`) | available | [official](https://lyptusresearch.org/) | [official-site-icon](https://lyptusresearch.org/assets/logo/lyptus_logo_256.png) | `public/assets/organizations/lyptus.png` |

## Validation

- `node --test scripts/organization-brands.test.mjs`: 3 tests passed. Covers completeness/identity, PNG bytes and dimensions, source/local hashes (including supplied-source files), file bounds, no orphan files, escaped names and unknown-identity fallbacks.
- `npm run check`: 297 files, 0 errors, 0 warnings, 1 hint in the concurrently edited monitoring component (`monitorSvg` unused import).
- `npm run build`: passed at this integration point; JSONL ingestion preserved and 3,142 static pages built. The parent task will run the final full build after all concurrent UI changes are complete.
- Visual identity contact-sheet reviewed on light/dark backing. Responsive page acceptance is performed with the parent task’s complete interface changes.

Second source pass: seven known institutional gaps were revisited using exact official identity/media pages and institution subdomains. Six were resolved (three fresh official assets, three supplied marks); UFABC remains the sole known-homepage image gap. The three organizations without verified homepages remain text-only. No new full build was run during this pass; parent integration owns the final build.

# MiSans Local

MiSans VF by Xiaomi. Downloaded from Xiaomi's official unicode-range font service on 2026-10-14:

https://cdn-font.hyperos.mi.com/font/css?family=MiSans_VF:VF:Chinese_Simplify,Latin&display=swap

The WOFF2 shards are original official files, stored locally without modification. `misans.css` retains their unicode ranges and uses a local family name. Browsers request only shards needed for the displayed characters. Chinese text uses weights 400, 500 and 600; a variable font provides intermediate weights used by existing components.

Use is governed by the accompanying original Xiaomi license, `LICENSE.pdf`. MiSans is not licensed under this repository's MIT license. See https://hyperos.mi.com/font/zh/faq/ and https://hyperos.mi.com/font/zh/download/ .

Refresh from the official service with `node scripts/vendor-misans.mjs`.

import { researchFigureAsset } from "./researchFigureAssets.mjs";

/** A standalone Markdown image with a title becomes a captioned research figure. */
export default function rehypeResearchFigures() {
  return async (tree, file) => {
    const path = String(file.path ?? "").replaceAll("\\", "/");
    if (!path.includes("/research-blog/")) return;
    const label = path.endsWith(".zh.md") || path.endsWith(".zh.mdx") ? "查看原图" : "View original";
    async function walk(parent) {
      if (!parent.children) return;
      for (let i = 0; i < parent.children.length; i++) {
        const node = parent.children[i];
        const children = node.children?.filter(child => child.type !== "text" || child.value.trim());
        const image = children?.length === 1 && children[0].tagName === "img" ? children[0] : undefined;
        if (node.tagName === "p" && image?.properties?.title && String(image.properties.src).startsWith("/assets/")) {
          const asset = await researchFigureAsset(String(image.properties.src));
          const caption = String(image.properties.title);
          delete image.properties.title;
          Object.assign(image.properties, { width: asset.width, height: asset.height, loading: "lazy", decoding: "async", srcSet: asset.srcset, sizes: "(max-width: 600px) calc(100vw - 40px), (max-width: 1199px) calc(100vw - 96px), 1000px" });
          const link = (content, className) => ({ type: "element", tagName: "a", properties: { href: asset.original, target: "_blank", rel: ["noreferrer"], className: [className] }, children: content });
          parent.children[i] = { type: "element", tagName: "figure", properties: { className: ["rb-figure"] }, children: [
            link([image], "rb-figure__image"),
            { type: "element", tagName: "figcaption", properties: {}, children: [
              { type: "element", tagName: "span", properties: {}, children: [{ type: "text", value: caption }] },
              link([{ type: "text", value: `${label} ↗` }], "rb-figure__original"),
            ] },
          ] };
        } else await walk(node);
      }
    }
    await walk(tree);
  };
}

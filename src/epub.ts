import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import { read } from "to-vfile";
import { unified } from "unified";
import { reporter } from "vfile-reporter";
import {
  EPub,
  type EpubOptions,
  type EpubContentOptions,
} from "@lesjoursfr/html-to-epub";
import type { Nodes } from "hast-util-select/lib";
import { matter } from "vfile-matter";
import path from "node:path";
import { VFile } from "vfile-matter/lib";
import yaml from "yaml";
import { readFileSync } from "fs";

interface ConfigsType {
  title?: string;
  author?: string;
  description?: string;
  cssFile?: string;
  books?: string[];
  fonts?: string[];
  cover?: string;
  output?: string;
}

interface FrontMatter {
  title?: string;
  description?: string;
  author?: string;
}

const getData = async () => {
  const configs = yaml.parse(
    readFileSync(path.resolve(process.cwd(), "epub.yaml"), "utf-8")
  ) as ConfigsType;

  const { title, description, author, cover, fonts, cssFile, books, output } =
    configs;
  const content: EpubContentOptions[] = books
    ? await Promise.all(
        books.map(async (book) => {
          const { html, matter } = await getHtml(book);
          const { title, description, author } = (() => {
            if (!matter)
              return { title: "Untitled", description: "", author: "" };
            const { title, description, author } = matter;
            return {
              title: title || "Untitled",
              description: description || "",
              author: author || "",
            };
          })();
          return { title, description, author, data: html };
        })
      )
    : [];
  const css = cssFile ? String(await read(cssFile)) : undefined;
  const data: EpubOptions = {
    title: title || "제목없음",
    description: description || "No description",
    author: author || "No author",
    css,
    fonts: fonts
      ? fonts.map((font) => path.resolve(process.cwd(), font))
      : undefined,
    cover,
    content,
  };
  const out = path.resolve(process.cwd(), output || "public/book.epub");
  return { out, data };
};
const frontmatter = () => (_tree: Nodes, file: VFile) => {
  matter(file);
};

const getHtml = async (bodyPath: string) => {
  const body = await read(bodyPath);
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeDocument)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .use(remarkFrontmatter, ["yaml"])
    .use(frontmatter)
    .process(body);
  console.error(reporter(file));
  const { matter } = file.data;
  return { html: String(file), matter: matter as FrontMatter };
};

const main = async () => {
  const { data, out } = await getData();
  const epub = new EPub(data, out);
  const result = await epub.render();
  console.log(result);
};

main();

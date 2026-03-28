import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

function getStudyDirectories() {
  const root = /* turbopackIgnore: true */ process.cwd();

  return [
    path.join(root, "content/studies"),
    path.join(root, "app/studies"),
  ];
}

function getStudyFilePath(slug: string) {
  for (const directory of getStudyDirectories()) {
    const filePath = path.join(directory, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}

export async function generateStaticParams() {
  const slugs = new Set<string>();

  for (const directory of getStudyDirectories()) {
    if (!fs.existsSync(directory)) {
      continue;
    }

    const files = fs.readdirSync(directory).filter((file) => file.endsWith(".mdx"));
    files.forEach((file) => {
      slugs.add(file.replace(".mdx", ""));
    });
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function StudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const filePath = getStudyFilePath(params.slug);

  if (!filePath) {
    notFound(); // Shows 404 if study doesn't exist
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data: frontmatter, content } = matter(fileContent);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Beautiful Header */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] text-white rounded-3xl p-12 mb-12">
        <div className="uppercase text-[#d4af37] text-sm tracking-widest mb-2">
          {frontmatter.category} • {frontmatter.duration}
        </div>
        <h1 className="text-5xl font-bold leading-tight">
          {frontmatter.title}
        </h1>
        <p className="text-xl text-blue-100 mt-4">{frontmatter.keyVerse}</p>
      </div>

      {/* The actual study content from the .mdx file */}
      <div className="prose prose-lg max-w-none text-[#1f2937] leading-relaxed">
        <div
          dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br>") }}
        />
      </div>
    </div>
  );
}

import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Clock, Users, ArrowRight } from "lucide-react";

interface Study {
  slug: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  keyVerse: string;
}

function getStudyDirectories() {
  const root = /* turbopackIgnore: true */ process.cwd();

  return [
    path.join(root, "content/studies"),
    path.join(root, "app/studies"),
  ];
}

async function getAllStudies(): Promise<Study[]> {
  const studies = new Map<string, Study>();

  for (const studiesDir of getStudyDirectories()) {
    if (!fs.existsSync(studiesDir)) {
      continue;
    }

    const files = fs.readdirSync(studiesDir).filter((file) => file.endsWith(".mdx"));

    files.forEach((file) => {
      const filePath = path.join(studiesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data: frontmatter } = matter(fileContent);
      const slug = file.replace(".mdx", "");

      studies.set(slug, {
        slug,
        title: frontmatter.title || "Untitled Study",
        category: frontmatter.category || "General",
        duration: frontmatter.duration || "20 min",
        level: frontmatter.level || "Beginner",
        keyVerse: frontmatter.keyVerse || "",
      });
    });
  }

  return Array.from(studies.values());
}

export default async function StudiesPage() {
  const studies = await getAllStudies();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Banner for Studies Page */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Bible Studies</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Deepen your faith with free, in-depth Bible studies. Choose from
            topical studies, book studies, and more.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {studies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-zinc-500">No studies yet.</p>
            <p className="text-zinc-400 mt-4">
              Add `.mdx` files in `content/studies` or `app/studies` to get started.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studies.map((study) => (
              <div
                key={study.slug}
                className="bg-white border border-[#d4af37]/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                {/* Top accent bar */}
                <div className="h-2 bg-gradient-to-r from-[#d4af37] to-[#1e40af]"></div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <span className="inline-block px-4 py-1.5 bg-[#d4af37]/10 text-[#d4af37] text-sm font-medium rounded-full">
                      {study.category}
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {study.duration}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold text-[#0f172a] mb-4 line-clamp-2 group-hover:text-[#1e40af] transition">
                    {study.title}
                  </h3>

                  {study.keyVerse && (
                    <p className="italic text-[#1e40af] text-sm mb-6 line-clamp-2">
                      “{study.keyVerse}”
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-zinc-500 mb-8">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {study.level}
                    </div>
                  </div>

                  <Link
                    href={`/studies/${study.slug}`}
                    className="btn-gold w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold group-hover:scale-[1.02] transition"
                  >
                    Start Study
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

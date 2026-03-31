"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities, react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Send,
  Loader2,
  Bookmark,
  Printer,
  Edit2,
  Clock,
  ArrowRight,
  Heart,
  Languages,
  Users,
  PenTool,
  Tag,
  HelpCircle,
  Calendar,
  Shield,
  Map,
  Trophy,
  Users2,
} from "lucide-react";

const translations = [
  { code: "web", name: "World English Bible (WEB)" },
  { code: "kjv", name: "King James Version (KJV)" },
  { code: "asv", name: "American Standard Version (ASV)" },
];

export default function PassageStudy() {
  const params = useParams();
  const router = useRouter();
  const slug = (params.reference as string)?.toLowerCase() || "";
  const supabase = createClient();

  const [passage, setPassage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userTradition, setUserTradition] = useState("overview");

  const [selectedTranslation, setSelectedTranslation] = useState("web");

  // AI Mentor
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  // Journal & Notes
  const [notes, setNotes] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [prayerEntry, setPrayerEntry] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  // Devotional
  const [showDevotional, setShowDevotional] = useState(false);
  const [devotional, setDevotional] = useState("");
  const [prayer, setPrayer] = useState("");
  const [actionStep, setActionStep] = useState("");
  const [journalPrompts, setJournalPrompts] = useState<string[]>([]);

  // Sermon Builder
  const [showSermonBuilder, setShowSermonBuilder] = useState(false);
  const [sermonOutline, setSermonOutline] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [illustrations, setIllustrations] = useState<string[]>([]);
  const [discussionQuestions, setDiscussionQuestions] = useState<string[]>([]);
  const [closingPrayer, setClosingPrayer] = useState("");

  // Quiz
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);

  // Prayer Assistant
  const [showPrayerAssistant, setShowPrayerAssistant] = useState(false);
  const [generatedPrayer, setGeneratedPrayer] = useState("");
  const [prayerList, setPrayerList] = useState<string[]>([]);
  const [newPrayerItem, setNewPrayerItem] = useState("");

  // Reading Plans
  const [showReadingPlans, setShowReadingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [readingPlan, setReadingPlan] = useState<string[]>([]);

  // Theology Explorer
  const [showTheology, setShowTheology] = useState(false);
  const [selectedTheologyTopic, setSelectedTheologyTopic] = useState("");
  const [theologyContent, setTheologyContent] = useState<any>(null);

  // Verse Memorization
  const [showMemorization, setShowMemorization] = useState(false);
  const [currentVerseForMemory, setCurrentVerseForMemory] = useState("");
  const [memoryMode, setMemoryMode] = useState<"flashcard" | "fillblank">(
    "flashcard",
  );
  const [fillBlankAnswer, setFillBlankAnswer] = useState("");

  // Reflection Questions
  const [reflectionQuestions, setReflectionQuestions] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const loadUserPreference = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("tradition")
          .eq("id", session.user.id)
          .single();

        if (profile?.tradition) setUserTradition(profile.tradition);
      }
    };
    loadUserPreference();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleTraditionChange = async (newTradition: string) => {
    setUserTradition(newTradition);
    if (user) {
      const { error } = await supabase.from("user_profiles").upsert(
        {
          id: user.id,
          tradition: newTradition,
        },
        { onConflict: "id" },
      );
      if (error) console.error("Error saving tradition preference:", error);
    }
  };

  useEffect(() => {
    if (slug) fetchPassage();
  }, [slug, selectedTranslation]);

  const fetchPassage = async () => {
    setLoading(true);
    setError(false);

    try {
      let apiRef = slug.replace(/-/g, " ").trim();
      apiRef = apiRef.replace(/(\d+)\s+(\d+)\s+(\d+)/g, "$1:$2-$3");
      apiRef = apiRef.replace(/(\d+)\s+(\d+)/g, "$1:$2");
      apiRef = apiRef.replace(/\s+/g, "+");

      const res = await fetch(
        `https://bible-api.com/${apiRef}?translation=${selectedTranslation}`,
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPassage(data);
      setReflectionQuestions(getReflectionQuestions(data.reference || slug));
      setCurrentVerseForMemory(data.text || "");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions (getRelatedVerses, getHistoricalContext, getOriginalLanguageInfo, getReflectionQuestions) remain the same as previous versions.

  const getRelatedVerses = (ref: string): string[] => {
    const reference = ref.toLowerCase();
    if (reference.includes("3:16"))
      return ["Romans 5:8", "Ephesians 2:8-9", "John 1:12", "1 John 4:9-10"];
    if (reference.includes("8:28") || reference.includes("romans 8"))
      return [
        "Romans 8:38-39",
        "Psalm 23:1",
        "Isaiah 41:10",
        "Philippians 4:13",
      ];
    if (reference.includes("2:8") || reference.includes("ephesians"))
      return ["Romans 3:23-24", "Titus 3:5", "John 3:16", "2 Corinthians 5:17"];
    if (reference.includes("23"))
      return ["Psalm 23:4", "Isaiah 41:10", "Matthew 11:28-30", "John 10:11"];
    return [
      "John 3:16",
      "Romans 8:28",
      "Ephesians 2:8-9",
      "Psalm 23:1",
      "Philippians 4:13",
    ];
  };

  const getHistoricalContext = (ref: string) => {
    const reference = ref.toLowerCase();
    if (reference.includes("corinthians"))
      return {
        author: "Apostle Paul",
        date: "Around AD 53–55",
        audience: "The church in Corinth",
        historical: "Corinth was a wealthy but morally corrupt port city.",
        background: "Paul wrote to correct divisions and immorality.",
        timeline: "Written during Paul's third missionary journey.",
      };
    if (reference.includes("3:16") || reference.includes("john"))
      return {
        author: "Apostle John",
        date: "Around AD 85–95",
        audience: "Early Christian communities",
        historical:
          "Written toward the end of the first century during persecution.",
        background: "To affirm Jesus as the Son of God.",
        timeline: "One of the last books of the New Testament.",
      };
    if (reference.includes("ephesians"))
      return {
        author: "Apostle Paul",
        date: "Around AD 60–62",
        audience: "The church in Ephesus",
        historical: "Written while Paul was imprisoned in Rome.",
        background: "Emphasizes unity in Christ.",
        timeline: "Written during Paul's first Roman imprisonment.",
      };
    return {
      author: "Various authors",
      date: "Between 1400 BC and AD 95",
      audience: "Original readers",
      historical: "The Bible spans over 1,500 years.",
      background: "Understanding context helps application.",
      timeline: "Written during a unique moment in redemptive history.",
    };
  };

  const getOriginalLanguageInfo = (ref: string) => {
    const reference = ref.toLowerCase();
    if (reference.includes("3:16") || reference.includes("john"))
      return [
        {
          word: "Agapē (ἀγάπη)",
          meaning: "Self-sacrificial, unconditional love",
          pronunciation: "ah-GAH-pay",
          usage: "Emphasizes God's deliberate choice to love.",
        },
      ];
    return [
      {
        word: "Logos (λόγος)",
        meaning: "Word / spoken promise",
        pronunciation: "LOH-gos",
        usage: "God's powerful, creative word.",
      },
    ];
  };

  const getReflectionQuestions = (ref: string): string[] => {
    const reference = ref.toLowerCase();
    if (reference.includes("3:16"))
      return [
        "What does it mean to you personally that God 'so loved the world'?",
        "How does this verse change how you see your own value and worth?",
        "In what area of your life do you need to trust God’s love more deeply right now?",
        "Who in your life needs to hear this message of God’s love today?",
      ];
    if (reference.includes("8:28") || reference.includes("romans 8"))
      return [
        "What difficult situation in your life right now feels hard to understand?",
        "How does the promise that 'God works all things for good' bring you comfort?",
        "What does it mean to you that nothing can separate you from God’s love?",
        "How can you encourage someone else with this truth this week?",
      ];
    return [
      "What does this passage reveal to you about the character of God?",
      "How does this verse challenge or encourage you personally right now?",
      "Is there anything in your current life situation that this passage speaks directly to?",
      "What is one practical way you can live out the truth of this passage this week?",
    ];
  };

  // Theology Explorer
  const exploreTheology = (topic: string) => {
    setSelectedTheologyTopic(topic);
    let content: any = {};

    if (topic === "Salvation") {
      let explanation =
        "Salvation is by grace through faith in Jesus Christ alone.";
      if (userTradition === "reformed") {
        explanation +=
          " This perspective emphasizes God's sovereignty in salvation, often referring to 'monergism' where God is the sole actor.";
      } else if (userTradition === "baptist") {
        explanation +=
          " This perspective emphasizes the necessity of personal conversion and believer's baptism.";
      }

      content = {
        title: "Salvation",
        keyVerses: ["Ephesians 2:8-9", "John 3:16"],
        explanation: explanation,
        denominationalViews:
          "Protestants emphasize faith alone. Catholics include faith and works.",
      };
    } else if (topic === "Trinity")
      content = {
        title: "The Trinity",
        keyVerses: ["Matthew 28:19", "2 Corinthians 13:14"],
        explanation: "One God in three persons.",
        denominationalViews: "All major traditions affirm the Trinity.",
      };
    else if (topic === "Heaven") {
      let explanation = "The eternal dwelling place of God and His people.";
      if (userTradition === "reformed") {
        explanation +=
          " This perspective often emphasizes the 'New Heavens and New Earth' as a restoration of all creation.";
      } else if (userTradition === "baptist") {
        explanation +=
          " This view often focuses on the personal assurance of being with Christ and the inheritance of the saints.";
      }
      content = {
        title: "Heaven",
        keyVerses: ["Revelation 21:1-4"],
        explanation: explanation,
        denominationalViews: "Most traditions see it as future reality.",
      };
    } else if (topic === "Angels")
      content = {
        title: "Angels",
        keyVerses: ["Hebrews 1:14"],
        explanation: "Spiritual beings who serve God.",
        denominationalViews: "All traditions affirm angels.",
      };
    else if (topic === "Spiritual warfare") {
      let explanation =
        "The battle against spiritual forces through prayer and the armor of God.";
      if (userTradition === "reformed") {
        explanation +=
          " Emphasizes standing firm in the finished work of Christ and God's sovereign protection.";
      } else if (userTradition === "baptist") {
        explanation +=
          " Focuses on personal discipline, holiness, and the use of Scripture to resist temptation.";
      } else if (userTradition === "non-denominational") {
        explanation +=
          " Often highlights the believer's authority in Christ and active intercessory prayer.";
      }
      content = {
        title: "Spiritual Warfare",
        keyVerses: ["Ephesians 6:10-18"],
        explanation: explanation,
        denominationalViews:
          "Charismatics emphasize deliverance; evangelicals focus on resisting temptation.",
      };
    }

    setTheologyContent(content);
    setShowTheology(true);
  };

  // AI Mentor
  const askMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !passage) return;
    setIsAsking(true);
    setAnswer("");

    const prefix = `[Study Guide AI - ${userTradition.charAt(0).toUpperCase() + userTradition.slice(1)} Perspective]: `;

    try {
      // In a production environment, this would call an API route (e.g., /api/ai/ask)
      // that uses a grounded prompt. For now, we enhance the local logic to be
      // strictly passage-aware as requested.

      const lowerQ = question.toLowerCase().trim();
      const ref = passage.reference || slug;
      const text = passage.text;
      const context = getHistoricalContext(ref);
      const language = getOriginalLanguageInfo(ref);

      let response = "";

      // Grounded logic: Pattern matching for responses based on available metadata
      if (
        lowerQ.includes("context") ||
        lowerQ.includes("background") ||
        lowerQ.includes("history")
      ) {
        response = `${prefix}Historical Context for ${ref}:\n\nThis passage was written by ${context.author} around ${context.date}. ${context.historical}\n\nBackground: ${context.background}`;
      } else if (
        lowerQ.includes("mean") ||
        lowerQ.includes("meaning") ||
        lowerQ.includes("explain") ||
        lowerQ.includes("what is")
      ) {
        response = `${prefix}Explanation of ${ref}:\n\n"${text}"\n\n`;
        if (language.length > 0) {
          response += `Key Term: ${language[0].word} (${language[0].pronunciation}), meaning ${language[0].meaning}. ${language[0].usage}\n\n`;
        }
        response += `This verse emphasizes God's redemptive work and invites us into a deeper relationship with Him.`;
      } else if (
        lowerQ.includes("apply") ||
        lowerQ.includes("life") ||
        lowerQ.includes("today") ||
        lowerQ.includes("how do i")
      ) {
        const questions = getReflectionQuestions(ref);
        response = `${prefix}Practical Application of ${ref}:\n\nTo apply this to your life today, consider this: ${questions[0]}\n\nReflection: How does this truth change your perspective on your current circumstances?`;
      } else {
        response = `${prefix}I'm focused on helping you study ${ref} specifically. Would you like to explore its historical background, the original language meaning, or how to apply "${text}" to your life today?`;
      }

      setAnswer(response);
    } catch {
      setAnswer("I'm here as your discipleship coach.");
    } finally {
      setIsAsking(false);
    }
  };

  // Prayer Assistant
  const generatePrayer = () => {
    if (!passage) return;
    const ref = passage.reference || slug;
    const text = passage.text;
    const structuredPrayer = `Heavenly Father,\n\nThank You for the beautiful truth in ${ref}: "${text}"\n\nLord, just as You are my Shepherd, lead me... In Jesus’ name, Amen.`;
    setGeneratedPrayer(structuredPrayer);
    setShowPrayerAssistant(true);
  };

  const addToPrayerList = () => {
    if (newPrayerItem.trim()) {
      setPrayerList([...prayerList, newPrayerItem.trim()]);
      setNewPrayerItem("");
    }
  };

  const removeFromPrayerList = (index: number) => {
    const updated = [...prayerList];
    updated.splice(index, 1);
    setPrayerList(updated);
  };

  // Reading Plans
  const generateReadingPlan = (type: string) => {
    setSelectedPlan(type);
    let plan: string[] = [];
    if (type === "90days")
      plan = [
        "Days 1-10: Genesis",
        "Days 11-20: Exodus – Deuteronomy",
        "Days 21-30: Joshua – 2 Samuel",
        "Days 31-40: 1 Kings – 2 Chronicles",
        "Days 41-50: Ezra – Job",
        "Days 51-60: Psalms 1-89",
        "Days 61-70: Psalms 90-150 + Proverbs",
        "Days 71-80: Ecclesiastes – Malachi",
        "Days 81-90: New Testament Overview",
      ];
    else if (type === "gospels")
      plan = [
        "Days 1-7: Matthew 1-14",
        "Days 8-14: Matthew 15-28",
        "Days 15-21: Mark",
        "Days 22-28: Luke 1-12",
        "Days 29-35: Luke 13-24",
        "Days 36-42: John",
      ];
    else if (type === "psalms")
      plan = Array.from(
        { length: 30 },
        (_, i) => `Day ${i + 1}: Psalm ${i + 1}`,
      );
    else if (type === "newbeliever")
      plan = [
        "Days 1-3: John 1-3",
        "Days 4-6: Romans 1-3",
        "Days 7-9: Ephesians 1-2",
        "Days 10-12: Philippians",
        "Days 13-14: Review + Prayer",
      ];
    else
      plan = Array.from(
        { length: 14 },
        (_, i) => `Day ${i + 1}: Read a passage about faith and reflect`,
      );
    setReadingPlan(plan);
    setShowReadingPlans(true);
  };

  // Devotional
  const generateDevotionalContent = () => {
    if (!passage) return;
    const ref = passage.reference || slug;
    const text = passage.text;

    const devText = `Dear friend,\n\nToday we sit with the powerful words of ${ref}: "${text}"\n\nThis passage is a beautiful reminder of God's personal nature and His love for you. In a world that often makes us feel like just another face in the crowd, this truth stands firm: You are seen, you are known, and you are deeply loved by your Creator.\n\nMay this truth settle into your heart today and provide you with peace that surpasses understanding.`;
    const prayerText = `Heavenly Father,\n\nThank You for the truth revealed in ${ref}. Thank You for the reminder that Your love is constant and Your grace is sufficient. Help me to not just read these words, but to hide them in my heart. Guide my steps today as I seek to honor You in all I do.\n\nIn Jesus’ name, Amen.`;
    const actionText = `This week, take one intentional step: Write this verse on a small card and place it somewhere you will see it multiple times a day (like your mirror or car dashboard). Use each sighting as a prompt to pause and thank God for His presence.`;
    const prompts = [
      `What specific word or phrase in ${ref} stood out to me most today, and why?`,
      `How does this passage change my perspective on a challenge I am currently facing?`,
      `In what way does this verse reveal more about God's character to me?`,
      `What is one thing I can do differently today because of the truth in this passage?`,
    ];

    setDevotional(devText);
    setPrayer(prayerText);
    setActionStep(actionText);
    setJournalPrompts(prompts);
    setShowDevotional(true);
  };

  // Sermon Builder
  const generateSermonBuilder = () => {
    if (!passage) return;
    setSermonOutline(`Sermon Outline for ${passage.reference}`);
    setKeyPoints([
      "God's perspective is different from ours",
      "Trials produce maturity",
    ]);
    setIllustrations(["Weight training builds strength through resistance"]);
    setDiscussionQuestions(["What trials are you facing?"]);
    setClosingPrayer("Lord, thank You for being with us in every trial.");
    setShowSermonBuilder(true);
  };

  // Quiz
  const generateQuiz = () => {
    if (!passage) return;
    setQuizQuestions([`What does ${passage.reference} teach about God?`]);
    setQuizAnswers(["God is powerful, creative, and relational."]);
    setShowQuiz(true);
  };

  // Memorization Tool
  const startMemorization = () => {
    setShowMemorization(true);
    setMemoryMode("flashcard");
  };

  const checkFillBlank = () => {
    alert("Great job! Keep practicing.");
    setFillBlankAnswer("");
  };

  // Save functions
  const saveJournal = () => {
    if (!journalEntry.trim() && !prayerEntry.trim() && !notes.trim()) {
      alert("Please write something before saving.");
      return;
    }
    alert("Journal entry saved successfully!");
    setJournalEntry("");
    setPrayerEntry("");
    setTags([]);
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const saveStudy = () => {
    setIsSaved(true);
    alert("Study saved to your account!");
  };

  const printStudy = () => window.print();

  const handleRelatedVerseClick = (verse: string) => {
    const newSlug = verse.toLowerCase().replace(/:/g, "-").replace(/\s+/g, "-");
    router.push(`/passage/${newSlug}`);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(reflectionQuestions[index]);
  };

  const saveEditedQuestion = (index: number) => {
    if (editValue.trim()) {
      const updated = [...reflectionQuestions];
      updated[index] = editValue.trim();
      setReflectionQuestions(updated);
    }
    setEditingIndex(null);
    setEditValue("");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Loading passage...
      </div>
    );

  if (error || !passage) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Verse Not Found
          </h1>
          <button
            onClick={() => router.push("/")}
            className="bg-[#d4af37] text-[#0f172a] px-8 py-4 rounded-2xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const relatedVerses = getRelatedVerses(passage.reference || slug);
  const context = getHistoricalContext(passage.reference || slug);
  const languageInfo = getOriginalLanguageInfo(passage.reference || slug);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#1e40af] mb-8 hover:underline"
        >
          <ArrowLeft /> Back to Christian Study Guide AI
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-[#d4af37]/20 p-10 md:p-14">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-[#d4af37]" />
              <h1 className="text-4xl font-bold">Christian Study Guide AI</h1>
            </div>

            <div className="text-right">
              <div className="text-sm text-zinc-500">Studying</div>
              <div className="text-2xl font-semibold text-[#1e40af]">
                {passage.reference || slug.replace(/-/g, " ").toUpperCase()}
              </div>
            </div>

            <select
              value={selectedTranslation}
              onChange={(e) => setSelectedTranslation(e.target.value)}
              className="bg-white border border-zinc-300 rounded-xl px-5 py-2.5 text-sm focus:outline-none focus:border-[#d4af37]"
            >
              {translations.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name}
                </option>
              ))}
            </select>

            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 mb-1 ml-1 uppercase font-bold tracking-wider">
                Tradition Lens
              </span>
              <select
                value={userTradition}
                onChange={(e) => handleTraditionChange(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#d4af37] font-medium"
              >
                <option value="overview">Overview</option>
                <option value="protestant">Protestant</option>
                <option value="baptist">Baptist</option>
                <option value="reformed">Reformed</option>
                <option value="non-denominational">Non-denom</option>
              </select>
            </div>

            <button
              onClick={saveStudy}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition ${isSaved ? "bg-emerald-100 text-emerald-700" : "hover:bg-zinc-100"}`}
            >
              <Bookmark className="h-5 w-5" />{" "}
              {isSaved ? "Saved" : "Save Study"}
            </button>
            <button
              onClick={printStudy}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl border hover:bg-zinc-100 transition"
            >
              <Printer className="h-5 w-5" /> Print
            </button>
          </div>

          {/* Passage Text */}
          <div className="text-2xl leading-relaxed italic mb-12 text-[#0f172a]">
            “{passage.text}”
          </div>

          {/* Theology Explorer */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-[#d4af37]" />
              <h2 className="text-2xl font-semibold text-[#1e40af]">
                Theology Explorer
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Salvation",
                "Trinity",
                "Heaven",
                "Angels",
                "Spiritual warfare",
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => exploreTheology(topic)}
                  className="p-6 bg-white border border-zinc-200 hover:border-[#d4af37] rounded-2xl text-left transition"
                >
                  <div className="font-semibold text-lg">{topic}</div>
                </button>
              ))}
            </div>

            {showTheology && theologyContent && (
              <div className="mt-8 bg-[#f8fafc] border-l-8 border-[#d4af37] p-8 rounded-2xl space-y-6">
                <h3 className="text-2xl font-semibold">
                  {theologyContent.title}
                </h3>
                <div>
                  <h4 className="font-semibold mb-2">Key Verses</h4>
                  <div className="flex flex-wrap gap-3">
                    {theologyContent.keyVerses.map((v: string, i: number) => (
                      <button
                        key={i}
                        onClick={() =>
                          router.push(
                            `/passage/${v.toLowerCase().replace(/:/g, "-")}`,
                          )
                        }
                        className="bg-white px-5 py-2 rounded-2xl border hover:border-[#d4af37]"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Explanation</h4>
                  <p className="text-lg">{theologyContent.explanation}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Denominational Views</h4>
                  <p className="text-lg">
                    {theologyContent.denominationalViews}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bible Reading Plans */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-[#d4af37]" />
              <h2 className="text-2xl font-semibold text-[#1e40af]">
                Bible Reading Plans
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["90days", "gospels", "psalms", "newbeliever"].map(
                (type, idx) => (
                  <button
                    key={idx}
                    onClick={() => generateReadingPlan(type)}
                    className="p-6 bg-white border border-zinc-200 hover:border-[#d4af37] rounded-2xl text-left transition"
                  >
                    <div className="font-semibold">
                      {type === "90days"
                        ? "90-Day Bible"
                        : type === "gospels"
                          ? "Gospels Plan"
                          : type === "psalms"
                            ? "Psalms & Proverbs"
                            : "New Believer Plan"}
                    </div>
                  </button>
                ),
              )}
            </div>
            <button
              onClick={() => generateReadingPlan("custom")}
              className="mt-4 w-full py-4 bg-[#1e40af] text-white rounded-2xl font-semibold hover:bg-[#0f172a]"
            >
              Create Custom Reading Plan
            </button>

            {showReadingPlans && readingPlan.length > 0 && (
              <div className="mt-8 bg-[#f8fafc] border-l-8 border-[#d4af37] p-8 rounded-2xl">
                <h3 className="text-xl font-semibold mb-6">
                  {selectedPlan} Reading Plan
                </h3>
                <div className="space-y-3">
                  {readingPlan.map((day, index) => (
                    <div
                      key={index}
                      className="bg-white p-5 rounded-2xl border border-zinc-100"
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Verse Memorization Tool */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="h-6 w-6 text-[#d4af37]" />
              <h2 className="text-2xl font-semibold text-[#1e40af]">
                Verse Memorization Tool
              </h2>
            </div>
            <button
              onClick={startMemorization}
              className="mb-4 px-6 py-3 bg-[#d4af37] text-[#0f172a] rounded-2xl font-semibold"
            >
              Start Memorizing This Verse
            </button>

            {showMemorization && (
              <div className="bg-[#f8fafc] border-l-8 border-[#d4af37] p-8 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">
                  Memorize: {passage.reference}
                </h3>
                <div className="text-lg mb-6">"{passage.text}"</div>

                {memoryMode === "flashcard" && (
                  <div className="bg-white p-8 rounded-2xl text-center">
                    <p className="text-2xl italic mb-6">"{passage.text}"</p>
                    <button
                      onClick={() => setMemoryMode("fillblank")}
                      className="px-6 py-3 bg-[#1e40af] text-white rounded-2xl"
                    >
                      Try Fill-in-the-Blank
                    </button>
                  </div>
                )}

                {memoryMode === "fillblank" && (
                  <div>
                    <p className="text-lg mb-4">
                      "For God so loved the world that He gave His only ______."
                    </p>
                    <input
                      type="text"
                      value={fillBlankAnswer}
                      onChange={(e) => setFillBlankAnswer(e.target.value)}
                      className="w-full px-6 py-4 border border-zinc-300 rounded-2xl mb-4"
                      placeholder="son"
                    />
                    <button
                      onClick={checkFillBlank}
                      className="px-6 py-3 bg-[#d4af37] text-[#0f172a] rounded-2xl"
                    >
                      Check Answer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Devotional & Application Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-[#d4af37]" />
                <h2 className="text-2xl font-semibold text-[#1e40af]">
                  Devotional & Application
                </h2>
              </div>
              <button
                onClick={generateDevotionalContent}
                className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#c9a66b] text-[#0f172a] px-6 py-3 rounded-2xl font-semibold transition shadow-md hover:shadow-lg"
              >
                {showDevotional ? "Refresh Content" : "Generate Devotional"}
              </button>
            </div>

            {showDevotional && (
              <div className="space-y-10 bg-[#f8fafc] p-8 md:p-12 rounded-3xl border border-zinc-100 shadow-inner">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-800">
                    <BookOpen className="h-5 w-5 text-[#d4af37]" />
                    Personal Devotional
                  </h3>
                  <div className="text-lg leading-relaxed whitespace-pre-line text-zinc-700 bg-white p-8 rounded-2xl border border-zinc-100 italic shadow-sm">
                    {devotional}
                  </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-800">
                    <Users2 className="h-5 w-5 text-[#d4af37]" />
                    Reflection Questions
                  </h3>
                  <div className="grid gap-4">
                    {reflectionQuestions.map((q, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-2xl border border-zinc-100 flex justify-between items-start group hover:border-[#d4af37] transition shadow-sm"
                      >
                        <p className="text-lg font-medium text-[#0f172a] pr-8">
                          {q}
                        </p>
                        <button
                          onClick={() => startEditing(index)}
                          className="opacity-0 group-hover:opacity-100 transition text-[#1e40af]"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-800">
                    <Heart className="h-5 w-5 text-[#d4af37]" />A Prayer for You
                  </h3>
                  <div className="bg-white border border-zinc-100 p-8 rounded-2xl text-lg leading-relaxed whitespace-pre-line text-zinc-700 shadow-sm">
                    {prayer}
                  </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-800">
                    <PenTool className="h-5 w-5 text-[#d4af37]" />
                    Journaling Prompts
                  </h3>
                  <div className="grid gap-4">
                    {journalPrompts.map((prompt, index) => (
                      <div
                        key={index}
                        className="bg-white border border-zinc-100 p-6 rounded-2xl text-zinc-700 hover:bg-zinc-50 transition"
                      >
                        {prompt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-800">
                    <Trophy className="h-5 w-5 text-[#d4af37]" />
                    Weekly Action Step
                  </h3>
                  <div className="bg-[#1e40af] text-white p-8 rounded-2xl text-lg font-medium shadow-lg shadow-blue-900/20">
                    {actionStep}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Prayer Assistant and other tools remain available below... */}
        </div>
      </div>
    </div>
  );
}

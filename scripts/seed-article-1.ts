/**
 * Article source:
 * Bob Hoekstra, "Day by Day by Grace" — Blue Letter Bible
 * https://www.blueletterbible.org/devotionals/dbdbg/view.cfm
 * Passage: 2 Corinthians 4:4–5 (NKJV)
 * Used as reference and inspiration for this reflection.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const slug = "the-light-of-the-gospel";

  const existing = await prisma.bibleDeepDive.findUnique({ where: { slug_lang: { slug, lang: "en" } } });
  if (existing) {
    console.log(`Already exists: "${existing.title}" — skipping.`);
    return;
  }

  const article = await prisma.bibleDeepDive.create({
    data: {
      slug,
      lang: "en",
      title: "The Light of the Gospel",
      scriptureRef: "2 Corinthians 4:4–5",
      scriptureText:
        "The god of this age has blinded the minds of unbelievers, so that they cannot see the light of the gospel that displays the glory of Christ, who is the image of God. For what we preach is not ourselves, but Jesus Christ as Lord, and ourselves as your servants for Jesus' sake.\n— 2 Corinthians 4:4–5 (NIV)",
      coverImage:
        "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&auto=format&fit=crop&q=80",
      reflection: `<p>The enemy of men's souls wants to keep perishing people in spiritual blindness. His influence runs through every system of the unbelieving world — politics, culture, education — with one primary goal: to prevent the light of the gospel from breaking through.</p>

<p>Yet into this dark world, we come carrying something extraordinary — <em>"the light of the gospel that displays the glory of Christ."</em> This is not just information. It is light. And light, by its very nature, overcomes darkness.</p>

<p>Jesus made this clear: <em>"I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life"</em> (John 8:12). When the light of Christ shines into a human soul, it doesn't just inform — it transforms. It turns the person from darkness to light, from the power of Satan to God (Acts 26:18).</p>

<h2>Not Ourselves, But Christ</h2>

<p>Paul is careful to clarify what this message is <em>not</em> about. It is not about the messenger. <em>"For what we preach is not ourselves, but Jesus Christ as Lord."</em> This is both a relief and a correction.</p>

<p>A relief — because the weight of the world's salvation does not rest on our personality, cleverness, or moral record. We are servants. The message is Christ.</p>

<p>A correction — because it is easy, even in ministry, to make things subtly about ourselves: our reputation, our platform, our approval. Paul strips this away. The glory belongs to Christ. We are only vessels.</p>

<p>What makes this possible is that the same God who said <em>"Let light shine out of darkness"</em> has made His light shine in our hearts (v.6). We carry real light — not our own, but His — and that is more than enough.</p>`,
      application: `<ul>
<li>Ask yourself honestly: in your conversations this week, are you pointing people toward Christ — or toward yourself, your opinions, your achievements?</li>
<li>Meditate on Ephesians 5:8: <em>"For you were once darkness, but now you are light in the Lord. Walk as children of light."</em> What would it look like to walk in that identity today?</li>
<li>If there is someone in your life who seems "blinded" — spiritually unresponsive — pray for them specifically. Ask God to break through their darkness, just as He once broke through yours.</li>
</ul>`,
      prayer:
        "Lord of glory, thank You for bringing me out of darkness and into Your light. Guard me from making ministry — or even my daily life — about myself. Let my words and my walk point clearly to You. Where I am tempted to seek my own recognition, remind me: the gospel is about Your glory, not mine. Shine through me today. Amen.",
      isPublished: true,
      publishedAt: new Date("2025-05-18"),
      createdBy: "admin",
    },
  });

  console.log(`✓ Created: "${article.title}" (${article.lang}) — slug: ${article.slug}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

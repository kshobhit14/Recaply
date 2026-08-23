<script>
  import { ArrowRight, Sparkles, Mic, CheckCircle2, ListChecks, WandSparkles } from "lucide-svelte";
  import Logo from "$lib/components/Logo.svelte";
</script>

<svelte:head>
  <title>Recaply — Turn Conversations into Clarity</title>
  <meta name="description" content="AI-powered meeting transcription and summaries." />
</svelte:head>

<header class="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
  <Logo />
  <a href="/login" class="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-700">Sign in</a>
</header>

<main>
  <section class="mx-auto max-w-5xl px-6 pb-24 pt-20 text-center">
    <div class="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
      <Sparkles size={15} /> AI meeting intelligence
    </div>
    <h1 class="text-5xl font-bold tracking-tight text-white sm:text-7xl">
      Turn conversations<br />
      <span class="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">into clarity.</span>
    </h1>
    <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
      Upload a meeting recording and let Recaply transcribe the discussion, surface decisions, and turn conversations into actionable tasks.
    </p>
    <div class="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
      <a href="/register" class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-zinc-950 hover:bg-zinc-200">
        Start with Recaply <ArrowRight size={17} />
      </a>
      <a href="/login" class="rounded-xl border border-zinc-800 px-6 py-3 font-semibold text-zinc-200 hover:bg-zinc-900">Open dashboard</a>
    </div>
  </section>

  <section class="mx-auto grid max-w-6xl gap-4 px-6 pb-24 md:grid-cols-3">
    {#each [
      { icon: Mic, title: "Transcribe", text: "Convert meeting audio into searchable text with Whisper." },
      { icon: WandSparkles, title: "Understand", text: "Generate concise summaries and surface the discussion that matters." },
      { icon: ListChecks, title: "Act", text: "Extract decisions, owners, deadlines, and actionable tasks." }
    ] as feature}
      <div class="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-glow">
        <svelte:component this={feature.icon} class="mb-5 text-violet-300" size={22} />
        <h2 class="text-lg font-semibold">{feature.title}</h2>
        <p class="mt-2 text-sm leading-6 text-zinc-500">{feature.text}</p>
      </div>
    {/each}
  </section>
</main>

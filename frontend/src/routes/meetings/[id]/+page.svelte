<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { ArrowLeft, CheckCircle2, CircleDot, ListChecks, Trash2 } from "lucide-svelte";
  import { api, getToken } from "$lib/api/client";

  let meeting = null;
  let error = "";

  onMount(async () => {
    if (!getToken()) return goto("/login");
    try { meeting = await api.meeting($page.params.id); }
    catch (e) { error = e.message; }
  });

  async function remove() {
    if (!confirm("Delete this meeting?")) return;
    await api.deleteMeeting(meeting._id);
    goto("/dashboard");
  }
</script>

<div class="min-h-screen">
  <header class="border-b border-zinc-800/70">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
      <a href="/dashboard" class="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white"><ArrowLeft size={17}/> Back to meetings</a>
      {#if meeting}<button on:click={remove} class="inline-flex items-center gap-2 rounded-xl border border-red-900/50 px-3 py-2 text-xs text-red-300 hover:bg-red-950/30"><Trash2 size={14}/> Delete</button>{/if}
    </div>
  </header>

  <main class="mx-auto max-w-5xl px-6 py-10">
    {#if error}
      <div class="rounded-2xl border border-red-900/50 bg-red-950/20 p-6 text-red-200">{error}</div>
    {:else if meeting}
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span class="text-sm text-violet-300">Meeting recap</span>
          <h1 class="mt-2 text-3xl font-semibold tracking-tight">{meeting.title}</h1>
          <p class="mt-2 text-sm text-zinc-600">{new Date(meeting.createdAt).toLocaleString()}</p>
        </div>
        <span class="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">{meeting.status}</span>
      </div>

      <section class="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-7 shadow-glow">
        <div class="flex items-center gap-2 text-sm font-medium text-zinc-400"><CircleDot size={15} class="text-violet-300"/> Executive summary</div>
        <p class="mt-4 max-w-4xl text-lg leading-8 text-zinc-200">{meeting.summary || "No summary available."}</p>
      </section>

      <div class="mt-5 grid gap-5 md:grid-cols-2">
        <section class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 class="font-semibold">Key points</h2>
          <ul class="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
            {#each meeting.keyPoints || [] as point}<li class="flex gap-3"><span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400"></span>{point}</li>{/each}
          </ul>
        </section>

        <section class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 class="font-semibold">Key decisions</h2>
          <ul class="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
            {#each meeting.decisions || [] as decision}<li class="flex gap-3"><CheckCircle2 size={17} class="mt-1 shrink-0 text-emerald-300"/>{decision}</li>{/each}
          </ul>
        </section>
      </div>

      <section class="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div class="flex items-center gap-2"><ListChecks size={18} class="text-violet-300"/><h2 class="font-semibold">Action items</h2></div>
        <div class="mt-4 overflow-hidden rounded-xl border border-zinc-800">
          {#if meeting.actionItems?.length}
            {#each meeting.actionItems as item}
              <div class="grid gap-2 border-b border-zinc-800 p-4 last:border-0 sm:grid-cols-[1fr_160px_150px]">
                <div class="text-sm text-zinc-200">{item.task}</div>
                <div class="text-xs text-zinc-500">{item.assignee}</div>
                <div class="text-xs text-zinc-500">{item.deadline}</div>
              </div>
            {/each}
          {:else}
            <div class="p-5 text-sm text-zinc-600">No action items found.</div>
          {/if}
        </div>
      </section>

      <details class="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
        <summary class="cursor-pointer text-sm font-medium text-zinc-400">View full transcript</summary>
        <p class="mt-5 whitespace-pre-wrap text-sm leading-7 text-zinc-500">{meeting.transcript}</p>
      </details>
    {/if}
  </main>
</div>

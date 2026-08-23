<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Upload, LogOut, Search, Clock3, FileAudio, ArrowUpRight, LoaderCircle } from "lucide-svelte";
  import Logo from "$lib/components/Logo.svelte";
  import { api, clearAuth, getUser } from "$lib/api/client";

  let user = null;
  let meetings = [];
  let query = "";
  let title = "";
  let file;
  let error = "";
  let uploading = false;

  onMount(async () => {
    user = getUser();
    if (!user) return goto("/login");
    try { meetings = await api.meetings(); } catch (e) { error = e.message; }
  });

  $: filtered = meetings.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));

  async function uploadMeeting() {
    if (!file) return;
    error = ""; uploading = true;
    try {
      const fd = new FormData();
      fd.append("audio", file);
      if (title) fd.append("title", title);
      const meeting = await api.upload(fd);
      meetings = [meeting, ...meetings];
      file = null; title = "";
      document.getElementById("audio-input").value = "";
    } catch (e) { error = e.message; }
    finally { uploading = false; }
  }

  function logout() {
    clearAuth();
    goto("/login");
  }
</script>

<svelte:head><title>Dashboard — Recaply</title></svelte:head>

<div class="min-h-screen">
  <header class="border-b border-zinc-800/70 bg-zinc-950/70 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <Logo />
      <div class="flex items-center gap-4">
        <span class="hidden text-sm text-zinc-500 sm:block">{user?.name}</span>
        <button on:click={logout} class="rounded-xl border border-zinc-800 p-2 text-zinc-400 hover:text-white" title="Sign out"><LogOut size={17} /></button>
      </div>
    </div>
  </header>

  <main class="mx-auto max-w-6xl px-6 py-10">
    <div class="mb-9">
      <p class="text-sm text-violet-300">Your workspace</p>
      <h1 class="mt-2 text-3xl font-semibold tracking-tight">Good to see you, {user?.name?.split(" ")[0] || "there"}.</h1>
      <p class="mt-2 text-zinc-500">Upload a meeting and let Recaply handle the notes.</p>
    </div>

    <section class="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-glow">
      <div class="flex items-center gap-3">
        <div class="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-300"><Upload size={19}/></div>
        <div><h2 class="font-semibold">New meeting</h2><p class="text-xs text-zinc-500">MP3, WAV, M4A or MP4 · up to 50 MB</p></div>
      </div>

      <div class="mt-5 grid gap-3 md:grid-cols-[1fr_1.5fr_auto]">
        <input bind:value={title} placeholder="Meeting title (optional)" class="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-violet-400" />
        <input id="audio-input" type="file" accept="audio/*,video/mp4" on:change={(e) => file = e.currentTarget.files[0]} class="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white" />
        <button on:click={uploadMeeting} disabled={!file || uploading} class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40">
          {#if uploading}<LoaderCircle class="animate-spin" size={17}/>{:else}<Upload size={17}/>{/if}
          {uploading ? "Processing..." : "Summarize"}
        </button>
      </div>
      {#if error}<p class="mt-3 text-sm text-red-300">{error}</p>{/if}
    </section>

    <div class="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><h2 class="text-xl font-semibold">Recent meetings</h2><p class="text-sm text-zinc-500">{meetings.length} meeting{meetings.length === 1 ? "" : "s"}</p></div>
      <div class="relative">
        <Search size={16} class="absolute left-3 top-3 text-zinc-600"/>
        <input bind:value={query} placeholder="Search meetings..." class="rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-violet-400" />
      </div>
    </div>

    <div class="mt-5 grid gap-3">
      {#if filtered.length}
        {#each filtered as meeting}
          <a href={`/meetings/${meeting._id}`} class="group flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/35 p-5 hover:border-zinc-700 hover:bg-zinc-900/70">
            <div class="flex min-w-0 items-center gap-4">
              <div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-400"><FileAudio size={19}/></div>
              <div class="min-w-0">
                <h3 class="truncate font-medium text-zinc-100">{meeting.title}</h3>
                <p class="mt-1 flex items-center gap-2 text-xs text-zinc-600"><Clock3 size={13}/> {new Date(meeting.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="rounded-full px-3 py-1 text-xs {meeting.status === 'completed' ? 'bg-emerald-400/10 text-emerald-300' : meeting.status === 'failed' ? 'bg-red-400/10 text-red-300' : 'bg-amber-400/10 text-amber-300'}">{meeting.status}</span>
              <ArrowUpRight size={17} class="text-zinc-600 group-hover:text-white"/>
            </div>
          </a>
        {/each}
      {:else}
        <div class="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-sm text-zinc-600">No meetings yet. Upload your first recording above.</div>
      {/if}
    </div>
  </main>
</div>

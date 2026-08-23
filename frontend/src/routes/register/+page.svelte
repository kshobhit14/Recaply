<script>
  import { goto } from "$app/navigation";
  import Logo from "$lib/components/Logo.svelte";
  import { api, setAuth } from "$lib/api/client";

  let name = "", email = "", password = "", error = "", loading = false;

  async function submit() {
    error = ""; loading = true;
    try {
      const data = await api.register({ name, email, password });
      setAuth(data.token, data.user);
      goto("/dashboard");
    } catch (e) { error = e.message; }
    finally { loading = false; }
  }
</script>

<div class="min-h-screen grid place-items-center px-6 py-10">
  <div class="w-full max-w-md">
    <Logo />
    <div class="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-glow">
      <h1 class="text-2xl font-semibold">Create your account</h1>
      <p class="mt-2 text-sm text-zinc-500">Start turning meetings into clear next steps.</p>
      <form class="mt-7 space-y-4" on:submit|preventDefault={submit}>
        <input bind:value={name} required placeholder="Full name" class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-400" />
        <input bind:value={email} type="email" required placeholder="Email" class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-400" />
        <input bind:value={password} type="password" minlength="6" required placeholder="Password (6+ characters)" class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-400" />
        {#if error}<p class="text-sm text-red-300">{error}</p>{/if}
        <button disabled={loading} class="w-full rounded-xl bg-white py-3 font-semibold text-zinc-950 disabled:opacity-50">{loading ? "Creating..." : "Create account"}</button>
      </form>
      <p class="mt-6 text-center text-sm text-zinc-500">Already have an account? <a href="/login" class="text-violet-300">Sign in</a></p>
    </div>
  </div>
</div>

<script>
  import { goto } from "$app/navigation";
  import Logo from "$lib/components/Logo.svelte";
  import { api, setAuth } from "$lib/api/client";

  let email = "";
  let password = "";
  let error = "";
  let loading = false;

  async function submit() {
    error = ""; loading = true;
    try {
      const data = await api.login({ email, password });
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
      <h1 class="text-2xl font-semibold">Welcome back</h1>
      <p class="mt-2 text-sm text-zinc-500">Sign in to continue to your meetings.</p>
      <form class="mt-7 space-y-4" on:submit|preventDefault={submit}>
        <input bind:value={email} type="email" required placeholder="Email" class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-400" />
        <input bind:value={password} type="password" required placeholder="Password" class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-400" />
        {#if error}<p class="text-sm text-red-300">{error}</p>{/if}
        <button disabled={loading} class="w-full rounded-xl bg-white py-3 font-semibold text-zinc-950 disabled:opacity-50">{loading ? "Signing in..." : "Sign in"}</button>
      </form>
      <p class="mt-6 text-center text-sm text-zinc-500">New here? <a href="/register" class="text-violet-300 hover:text-violet-200">Create an account</a></p>
    </div>
  </div>
</div>

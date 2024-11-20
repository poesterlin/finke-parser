<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 class="text-center mt-4 text-4xl font-bold">Finke Parser</h1>

<ul class="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-8">
	{#each data.entries as item}
		<li class="rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-xl">
			<a href={item.link} target="_blank" rel="noopener noreferrer" class="block">
				<article class="p-4">
					<h3 class="text-lg font-semibold text-gray-800">
						{item.plaats} 
					</h3>
                    <span class="text-sm text-gray-600">{item.distance.toFixed(2)} km</span>
					<div class="mt-3">
						<img src={item.img} alt={item.plaats} decoding="async" loading="lazy" class="h-40 w-full rounded-lg object-cover" />
					</div>
					<!-- details -->
					<div class="mt-4">
						<p class="text-sm text-gray-600">
							{item.kamers} Rooms
						</p>
						{#if item.prijs}
							<p class="text-sm text-gray-600">
								{item.prijs.toLocaleString()} €
							</p>
						{/if}
                        <p class="text-sm text-gray-600">
                            {item.oppervlakte} m²
                        </p>
					</div>
				</article>
			</a>
		</li>
	{/each}
</ul>

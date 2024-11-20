import { env } from '$env/dynamic/private';
import { imgBaseUrl } from '$lib';
import type { PageServerLoad } from './$types';

// example of data entry
// '84317': {
//     plaats: 'LEIDEN',
//     adres: 'Rijnsburgersingel',
//     kamers: 2,
//     status: 'huur',
//     prijs: '2.125',
//     oppervlakte: 50, 
//     oplevering: 'Gestoffeerd',
//     lat: '52.1649204',
//     long: '4.4884336',
//     img: '<img src="https://finkemakelaars.nl/wp-content/uploads/rw_images/84317_1.jpg" class="attachment-finke-maps size-finke-maps wp-post-image" alt="" decoding="async" loading="lazy" sizes="(max-width: 330px) 100vw, 330px" width="330">',
//     link: 'https://finkemakelaars.nl/woningen/rijnsburgersingel-leiden-2/',
//     id: 84317
//   },

interface DataEntry {
	plaats: string;
	adres: string;
	kamers: number;
	status: string;
	prijs: string | number;
	oppervlakte: number;
	oplevering: string;
	lat: string;
	long: string;
	img: string;
	link: string;
	id: number;
	distance: number;
}

interface Data {
	[key: string]: DataEntry;
}

export const load: PageServerLoad = async () => {
	const res = await fetch('https://finkemakelaars.nl/woningen/');

	const html = (await res.text()).replaceAll('\n', '').replaceAll('\t', '').replaceAll('  ', '');

	const start = `<script>// Dynamically generated locations based on provided dataconst finke_locations = `;
	const startIndex = html.indexOf(start);
	const clipStart = startIndex + start.length;
	const content = html.substring(clipStart);

	const end =
		";const finke_icon = 'https://finkemakelaars.nl/wp-content/themes/finke/img/Huren_Huis_Icoon-03.png';const finke_koop_icon = 'https://finkemakelaars.nl/wp-content/themes/finke/img/Icon_Groen_01.png';</script>";
	const endIndex = content.indexOf(end);
	const clipEnd = endIndex;
	const script = content.substring(0, clipEnd);

	const data = JSON.parse(script) as Data;

	return {
		entries: Object.values(data).map((entry) => {
			entry.distance = distance(
				parseFloat(env.LAT),
				parseFloat(env.LONG),
				parseFloat(entry.lat),
				parseFloat(entry.long)
			);
            const imgHref = entry.img.match(/src="([^"]*)"/)?.[1];
            entry.img = imgHref?.substring(imgBaseUrl.length) ?? '';

            entry.prijs = parseFloat(entry.prijs + '') * 1000;

			return entry;
		}).reverse().filter((entry) => entry.status === 'huur')
	};
};

/**
 * Calculate the distance between two points in kilometers
 * 
 * @param lat1 
 * @param lon1 
 * @param lat2 
 * @param lon2 
 * @returns 
 */
function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
	const p = 0.017453292519943295; // Math.PI / 180
	const c = Math.cos;
	const a =
		0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

	return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

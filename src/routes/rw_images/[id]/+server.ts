import { imgBaseUrl } from '$lib';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	const res = await fetch(`${imgBaseUrl}/rw_images/${id}`);

	return new Response(res.body, {
		headers: {
			'content-type': 'image/jpeg',
			'cache-control': 'public, max-age=31536000'
		}
	});
};

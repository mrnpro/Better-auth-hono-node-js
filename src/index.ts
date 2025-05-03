import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from "hono/cors";
import { auth } from './lib/auth.js';
import os from 'os';
function getDeviceIp(): string {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name] || []) {
			if (iface.family === 'IPv4' && !iface.internal) {
				return iface.address; // Return the first non-internal IPv4 address
			}
		}
	}
	return '127.0.0.1'; // Fallback to localhost if no external IP is found
}

const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null
	}
}>();

app.use('/*', cors())

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.get("/session", async (c) => {
	const session = c.get("session")
	const user = c.get("user")

	if (!user) return c.body(null, 401);
	return c.json({
		session,
		user
	});
});
const deviceIp = getDeviceIp();
serve({

	fetch: app.fetch,
	port: 3002,

}, (info) => {
	console.log(`Server is running on http://${deviceIp}:3002`);
})

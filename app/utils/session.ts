import { createCookieSessionStorage, redirect } from "@remix-run/node"; // or cloudflare/deno

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		// a Cookie from `createCookie` or the CookieOptions to create one
		cookie: {
			name: "__session",

			// all of these are optional
			// Expires can also be set (although maxAge overrides it when used in combination).
			// Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
			//
			// domain: "",
			// expires: new Date(Date.now() + 60_000),
			// httpOnly: true,
			// maxAge: 60,
			// path: "/",
			sameSite: "lax", // "lax" by default
			secrets: ["this is a secret"],
			secure: process.env.NODE_ENV === "production",
		},
	});

const getUserSession = async (
	request: Request,
	next: Function,
	require = false
) => {
	const newToken = checkForToken(request.url);
	const session = await getSession(request.headers.get("Cookie"));

	if (newToken) {
		// TODO: chen ck that the token is a valid one
		console.log("token detected : ", newToken);

		return next(newToken, session);
	} else if (!session.has("user")) {
		console.log("does not have a session, should we redirect ?", require);

		if (require) {
			return redirect("/", {
				headers: {
					"Set-Cookie": await destroySession(session),
				},
			});
		}
		return next(null, session);
	}

	console.log("should have a session ", session.data);
	return next(session.get("user"), session);
};

const checkForToken = (url: string) => {
	const urlObj = new URL(url);
	return urlObj.searchParams.get("token");
};

export { getSession, commitSession, destroySession, getUserSession };
